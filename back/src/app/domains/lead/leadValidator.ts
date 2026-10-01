export interface ILeadInput {
  first_name?: unknown
  last_name?: unknown
  email?: unknown
  mobile_phone?: unknown
  interestProgram?: unknown
  description?: unknown
  [key: string]: unknown
}

export interface ILeadValues {
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  interestProgram: string
  description: string
}

export interface ILeadValidation {
  errors: Record<string, string>
  values: ILeadValues
}

const MAX_NAME = 100
const MAX_DESCRIPTION = 500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Colombian mobile: 3XXXXXXXXX, 573XXXXXXXXX or +573XXXXXXXXX (after stripping separators)
const CO_MOBILE_PATTERN = /^(?:\+?57)?(3\d{9})$/
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

export const isObjectId = (value: unknown): value is string =>
  typeof value === 'string' && OBJECT_ID_PATTERN.test(value)

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

/** Strips separators and normalizes a Colombian mobile to +573XXXXXXXXX; otherwise returns the stripped input. */
const normalizePhone = (value: string): string => {
  const stripped = value.replace(/[\s\-().]/g, '')
  const match = CO_MOBILE_PATTERN.exec(stripped)
  return match ? `+57${match[1]}` : stripped
}

/**
 * Validates and normalizes the lead registration payload.
 * Only whitelisted fields are returned in `values`; the rest is ignored.
 */
export const validateLead = (input: ILeadInput = {}): ILeadValidation => {
  const errors: Record<string, string> = {}

  const first_name = text(input.first_name)
  const last_name = text(input.last_name)
  const email = text(input.email).toLowerCase()
  const mobile_phone = normalizePhone(text(input.mobile_phone))
  const interestProgram = text(input.interestProgram)
  const description = text(input.description)

  if (!first_name) errors.first_name = 'lead.first_name.required'
  else if (first_name.length > MAX_NAME) errors.first_name = 'lead.first_name.too_long'

  if (!last_name) errors.last_name = 'lead.last_name.required'
  else if (last_name.length > MAX_NAME) errors.last_name = 'lead.last_name.too_long'

  if (!email) errors.email = 'lead.email.required'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'lead.email.invalid'

  if (!mobile_phone) errors.mobile_phone = 'lead.mobile_phone.required'
  else if (!CO_MOBILE_PATTERN.test(mobile_phone)) errors.mobile_phone = 'lead.mobile_phone.invalid'

  if (!interestProgram) errors.interestProgram = 'lead.interestProgram.required'
  else if (!isObjectId(interestProgram)) errors.interestProgram = 'lead.interestProgram.invalid'

  if (description.length > MAX_DESCRIPTION) errors.description = 'lead.description.too_long'

  return {
    errors,
    values: { first_name, last_name, email, mobile_phone, interestProgram, description },
  }
}
