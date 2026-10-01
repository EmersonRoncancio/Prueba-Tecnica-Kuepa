import { FormEvent, useState } from 'react'
import { toast } from '@/components/hooks/use-toast'
import { leadService } from '@/services/leadService'
import type { ApiError, Lead } from '@/services/types'
import {
  emptyLeadForm, LeadFormErrors, LeadFormValues, normalizeLeadForm, validateLeadForm,
} from '@/util/lead-validation'
import { leadMessage } from '@/util/lead-messages'

const errorKey = (response: ApiError) => response.message ?? response.system_message

export function useLeadForm(onCreated: (lead: Lead) => void) {
  const [values, setValues] = useState<LeadFormValues>(emptyLeadForm)
  const [errors, setErrors] = useState<LeadFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const setField = (name: keyof LeadFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleError = (error?: ApiError) => {
    if (error?.code === 400 && error.errors) setErrors(error.errors as LeadFormErrors)
    else if (error?.code === 409) setErrors({ email: errorKey(error) ?? 'lead.email.duplicated' })
    else setFormError(leadMessage(error && errorKey(error)))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    const found = validateLeadForm(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    const response = await leadService.create(normalizeLeadForm(values))
    setSubmitting(false)

    if (response && 'object' in response) {
      toast({ title: 'Prospecto registrado', description: `${response.object.full_name} fue agregado al pipeline.` })
      setValues(emptyLeadForm)
      onCreated(response.object)
    } else {
      handleError(response as ApiError | undefined)
    }
  }

  return { values, errors, formError, submitting, setField, submit }
}
