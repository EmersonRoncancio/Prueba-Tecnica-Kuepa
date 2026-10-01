import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLeadForm } from '@/hooks/use-lead-form'
import type { Lead, Program } from '@/services/types'
import { LeadField, leadInputClass } from './lead-field'
import { LeadFormSection } from './lead-form-section'
import { LeadProgramSelect } from './lead-program-select'

interface LeadFormProps {
  programs: Program[]
  onCreated: (lead: Lead) => void
}

export function LeadForm({ programs, onCreated }: LeadFormProps) {
  const { values, errors, formError, submitting, setField, submit } = useLeadForm(onCreated)
  const text = (name: keyof typeof values) => ({
    value: values[name],
    onChange: (e: { target: { value: string } }) => setField(name, e.target.value),
    className: leadInputClass,
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <LeadFormSection title="Datos personales">
        <LeadField id="lead-first-name" label="Nombres" required error={errors.first_name}>
          {(aria) => <Input {...aria} {...text('first_name')} autoComplete="given-name" />}
        </LeadField>
        <LeadField id="lead-last-name" label="Apellidos" required error={errors.last_name}>
          {(aria) => <Input {...aria} {...text('last_name')} autoComplete="family-name" />}
        </LeadField>
      </LeadFormSection>

      <LeadFormSection title="Contacto">
        <LeadField id="lead-email" label="Correo electrónico" required error={errors.email}>
          {(aria) => <Input {...aria} {...text('email')} type="email" autoComplete="email" />}
        </LeadField>
        <LeadField id="lead-phone" label="Celular" required error={errors.mobile_phone} hint="Ej: +57 300 123 4567">
          {(aria) => <Input {...aria} {...text('mobile_phone')} type="tel" autoComplete="tel" />}
        </LeadField>
      </LeadFormSection>

      <LeadFormSection title="Interés académico">
        <div className="sm:col-span-2 flex flex-col gap-3">
          <LeadField id="lead-program" label="Programa de interés" required error={errors.interestProgram}>
            {({ id, ...aria }) => (
              <LeadProgramSelect
                id={id}
                programs={programs}
                value={values.interestProgram}
                onChange={(value) => setField('interestProgram', value)}
                invalid={aria['aria-invalid']}
                describedBy={aria['aria-describedby']}
              />
            )}
          </LeadField>
          <LeadField id="lead-description" label="Nota (opcional)" error={errors.description}>
            {(aria) => (
              <Textarea {...aria} {...text('description')} rows={3} className={`${leadInputClass} h-auto border-solid`} />
            )}
          </LeadField>
        </div>
      </LeadFormSection>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 self-end rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Registrando…' : 'Registrar prospecto'}
      </button>
    </form>
  )
}
