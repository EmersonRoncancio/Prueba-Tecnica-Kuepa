import { validateLead } from '../src/app/domains/lead/leadValidator'

const PROGRAM_ID = '64b7f0c2a1b2c3d4e5f60718'

const valid = () => ({
  first_name: ' Ana ',
  last_name: 'Gómez',
  email: ' ANA@Example.COM ',
  mobile_phone: '+57 300 123 4567',
  interestProgram: PROGRAM_ID,
})

describe('validateLead', () => {
  it('accepts valid input and returns normalized values', () => {
    const { errors, values } = validateLead(valid())

    expect(errors).toEqual({})
    expect(values).toEqual({
      first_name: 'Ana',
      last_name: 'Gómez',
      email: 'ana@example.com',
      mobile_phone: '+573001234567',
      interestProgram: PROGRAM_ID,
      description: '',
    })
  })

  it('whitelists fields and ignores anything else', () => {
    const { values } = validateLead({ ...valid(), status: 'inactive', _id: 'x', trackings: [1] })
    expect(Object.keys(values).sort()).toEqual(
      ['description', 'email', 'first_name', 'interestProgram', 'last_name', 'mobile_phone']
    )
  })

  it('reports every missing required field', () => {
    const { errors } = validateLead({})
    expect(errors).toEqual({
      first_name: 'lead.first_name.required',
      last_name: 'lead.last_name.required',
      email: 'lead.email.required',
      mobile_phone: 'lead.mobile_phone.required',
      interestProgram: 'lead.interestProgram.required',
    })
  })

  it('treats blank strings and non-string values as missing', () => {
    const { errors } = validateLead({ ...valid(), first_name: '   ', last_name: { $ne: '' } })
    expect(errors.first_name).toBe('lead.first_name.required')
    expect(errors.last_name).toBe('lead.last_name.required')
  })

  it.each(['plain', 'a@b', 'a b@c.com', '@c.com'])('rejects invalid email %s', (email) => {
    expect(validateLead({ ...valid(), email }).errors.email).toBe('lead.email.invalid')
  })

  it.each([
    '123456',
    '1234567890123456',
    'abc1234567',
    '+',
    '12+3456789',
    '1234567',
    '601 234 5678',
    '6012345678',
    '300123456',
    '30012345678',
    '+1 300 123 4567',
    '+583001234567',
    '3001234abc',
    '+57 601 234 5678',
  ])('rejects invalid mobile phone %s', (mobile_phone) => {
    expect(validateLead({ ...valid(), mobile_phone }).errors.mobile_phone).toBe('lead.mobile_phone.invalid')
  })

  it.each([
    '3001234567',
    '300 123 4567',
    '300-123-4567',
    '(300) 123.4567',
    '573001234567',
    '57 300 123 4567',
    '+573001234567',
    '+57 300 123 4567',
  ])('accepts and normalizes mobile phone %s', (mobile_phone) => {
    const { errors, values } = validateLead({ ...valid(), mobile_phone })
    expect(errors.mobile_phone).toBeUndefined()
    expect(values.mobile_phone).toBe('+573001234567')
  })

  it('rejects an invalid program id', () => {
    expect(validateLead({ ...valid(), interestProgram: 'nope' }).errors.interestProgram)
      .toBe('lead.interestProgram.invalid')
  })

  it('keeps an optional trimmed description', () => {
    expect(validateLead({ ...valid(), description: '  Wants evening classes ' }).values.description)
      .toBe('Wants evening classes')
  })
})
