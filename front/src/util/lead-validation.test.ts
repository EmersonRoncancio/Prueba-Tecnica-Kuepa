import { emptyLeadForm, normalizeLeadForm, validateLeadForm } from './lead-validation'
import { leadMessage } from './lead-messages'

const valid = {
  first_name: 'Ana',
  last_name: 'Pérez',
  email: 'ana@example.com',
  mobile_phone: '3001234567',
  interestProgram: '66f0c0ffee00000000000001',
  description: '',
}

describe('validateLeadForm', () => {
  it('accepts a valid form', () => {
    expect(validateLeadForm(valid)).toEqual({})
  })

  it('requires every mandatory field', () => {
    expect(validateLeadForm(emptyLeadForm)).toEqual({
      first_name: 'lead.first_name.required',
      last_name: 'lead.last_name.required',
      email: 'lead.email.required',
      mobile_phone: 'lead.mobile_phone.required',
      interestProgram: 'lead.interestProgram.required',
    })
  })

  it('treats whitespace-only names as missing', () => {
    const errors = validateLeadForm({ ...valid, first_name: '   ' })
    expect(errors.first_name).toBe('lead.first_name.required')
  })

  it('rejects names longer than 100 characters and notes longer than 500', () => {
    const errors = validateLeadForm({
      ...valid,
      last_name: 'a'.repeat(101),
      description: 'b'.repeat(501),
    })
    expect(errors.last_name).toBe('lead.last_name.too_long')
    expect(errors.description).toBe('lead.description.too_long')
  })

  it.each(['plainaddress', 'a@b', 'a b@c.com', '@c.com'])('rejects invalid email %s', (email) => {
    expect(validateLeadForm({ ...valid, email }).email).toBe('lead.email.invalid')
  })

  it.each(['300 123 4567', '300-123-4567', '+57 300 123 4567', '1234567'])(
    'accepts phone %s',
    (mobile_phone) => {
      expect(validateLeadForm({ ...valid, mobile_phone }).mobile_phone).toBeUndefined()
    }
  )

  it.each(['123456', '1'.repeat(16), 'abc1234567', '30012+34567'])('rejects phone %s', (mobile_phone) => {
    expect(validateLeadForm({ ...valid, mobile_phone }).mobile_phone).toBe('lead.mobile_phone.invalid')
  })
})

describe('normalizeLeadForm', () => {
  it('trims, lowercases the email and strips phone separators', () => {
    expect(
      normalizeLeadForm({
        ...valid,
        first_name: '  Ana ',
        email: ' ANA@Example.COM ',
        mobile_phone: '+57 300-123 4567',
        description: ' hola ',
      })
    ).toEqual({
      ...valid,
      email: 'ana@example.com',
      mobile_phone: '+573001234567',
      description: 'hola',
    })
  })
})

describe('leadMessage', () => {
  it('maps known backend keys to Spanish messages', () => {
    expect(leadMessage('lead.email.invalid')).toMatch(/correo/i)
    expect(leadMessage('lead.email.duplicated')).toMatch(/ya está registrado/i)
  })

  it('falls back to a generic message for unknown keys', () => {
    expect(leadMessage('something.else')).toMatch(/inténtalo/i)
    expect(leadMessage(undefined)).toMatch(/inténtalo/i)
  })
})
