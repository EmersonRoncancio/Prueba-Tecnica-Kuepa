import type { LeadPayload } from '@/services/types'

export interface LeadFormValues {
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  interestProgram: string
  description: string
}

/** Field name to backend error key (see `lead-messages`). */
export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>

export const emptyLeadForm: LeadFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  mobile_phone: '',
  interestProgram: '',
  description: '',
}

// Mirrors back/src/app/domains/lead/leadValidator.ts
const MAX_NAME = 100
const MAX_DESCRIPTION = 500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Colombian mobile: 3XXXXXXXXX, 573XXXXXXXXX or +573XXXXXXXXX (after stripping separators)
const CO_MOBILE_PATTERN = /^(?:\+?57)?(3\d{9})$/

/** Strips separators and normalizes a Colombian mobile to +573XXXXXXXXX; otherwise returns the stripped input. */
const normalizePhone = (value: string): string => {
  const stripped = value.trim().replace(/[\s\-().]/g, '')
  const match = CO_MOBILE_PATTERN.exec(stripped)
  return match ? `+57${match[1]}` : stripped
}

export const normalizeLeadForm = (values: LeadFormValues): LeadFormValues => ({
  first_name: values.first_name.trim(),
  last_name: values.last_name.trim(),
  email: values.email.trim().toLowerCase(),
  mobile_phone: normalizePhone(values.mobile_phone),
  interestProgram: values.interestProgram.trim(),
  description: values.description.trim(),
})

export const validateLeadForm = (input: LeadFormValues): LeadFormErrors => {
  const v = normalizeLeadForm(input)
  const errors: LeadFormErrors = {}

  if (!v.first_name) errors.first_name = 'lead.first_name.required'
  else if (v.first_name.length > MAX_NAME) errors.first_name = 'lead.first_name.too_long'

  if (!v.last_name) errors.last_name = 'lead.last_name.required'
  else if (v.last_name.length > MAX_NAME) errors.last_name = 'lead.last_name.too_long'

  if (!v.email) errors.email = 'lead.email.required'
  else if (!EMAIL_PATTERN.test(v.email)) errors.email = 'lead.email.invalid'

  if (!v.mobile_phone) errors.mobile_phone = 'lead.mobile_phone.required'
  else if (!CO_MOBILE_PATTERN.test(v.mobile_phone)) errors.mobile_phone = 'lead.mobile_phone.invalid'

  if (!v.interestProgram) errors.interestProgram = 'lead.interestProgram.required'

  if (v.description.length > MAX_DESCRIPTION) errors.description = 'lead.description.too_long'

  return errors
}
