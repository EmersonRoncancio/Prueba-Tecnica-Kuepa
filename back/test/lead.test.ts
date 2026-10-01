import request from 'supertest'
import mongoose from 'mongoose'
import { buildTestApp } from './helpers/testApp'
import { authHeader } from './helpers/auth'
import { Lead, Program, Tracking } from '@app/models'

const app = buildTestApp()

const seedCatalog = async () => {
  const program = await Program.create({ name: 'Inglés', description: 'English' })
  const [nuevo, contactado] = await Tracking.create([
    { name: 'Contactado', order: 2 },
    { name: 'Nuevo', order: 1 },
  ]).then(([b, a]) => [a, b])
  return { program, nuevo, contactado }
}

const payload = (program, extra = {}) => ({
  first_name: 'Ana',
  last_name: 'Gómez',
  email: 'ana@example.com',
  mobile_phone: '3001234567',
  interestProgram: program._id.toString(),
  ...extra,
})

describe('auth', () => {
  it.each([
    ['get', '/api/lead'],
    ['post', '/api/lead/upsert'],
    ['post', '/api/lead/move'],
  ])('%s %s responds 401 without a token', async (method, path) => {
    const res = await request(app)[method](path)
    expect(res.status).toBe(401)
  })
})

describe('POST /api/lead/upsert', () => {
  it('creates a lead in the lowest-order stage with a populated response', async () => {
    const { program, nuevo } = await seedCatalog()

    const res = await request(app)
      .post('/api/lead/upsert')
      .set(authHeader())
      .send(payload(program, { email: ' ANA@Example.com ', description: 'Asked by phone' }))

    expect(res.status).toBe(200)
    const lead = res.body.object
    expect(lead.full_name).toBe('Ana Gómez')
    expect(lead.email).toBe('ana@example.com')
    expect(lead.interestProgram.name).toBe('Inglés')
    expect(lead.trackings).toHaveLength(1)
    expect(lead.trackings[0].tracking._id).toBe(nuevo._id.toString())
    expect(lead.trackings[0].tracking.name).toBe('Nuevo')
    expect(lead.trackings[0].description).toBe('Asked by phone')
  })

  it('ignores non-whitelisted fields', async () => {
    const { program } = await seedCatalog()

    const res = await request(app)
      .post('/api/lead/upsert')
      .set(authHeader())
      .send(payload(program, { status: 'inactive', incremental: 99, trackings: [] }))

    expect(res.status).toBe(200)
    expect(res.body.object.status).toBe('active')
    expect(res.body.object.incremental).toBeUndefined()
    expect(res.body.object.trackings).toHaveLength(1)
  })

  it('responds 400 with field errors on invalid input', async () => {
    await seedCatalog()

    const res = await request(app)
      .post('/api/lead/upsert')
      .set(authHeader())
      .send({ first_name: 'Ana', email: 'bad', mobile_phone: '12' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('lead.invalid')
    expect(res.body.errors).toMatchObject({
      last_name: 'lead.last_name.required',
      email: 'lead.email.invalid',
      mobile_phone: 'lead.mobile_phone.invalid',
      interestProgram: 'lead.interestProgram.required',
    })
    expect(await Lead.countDocuments({})).toBe(0)
  })

  it('responds 409 on a duplicate email', async () => {
    const { program } = await seedCatalog()
    await request(app).post('/api/lead/upsert').set(authHeader()).send(payload(program))

    const res = await request(app)
      .post('/api/lead/upsert')
      .set(authHeader())
      .send(payload(program, { email: 'ANA@example.com' }))

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('lead.email.duplicated')
    expect(await Lead.countDocuments({})).toBe(1)
  })

  it('responds 404 when the program does not exist', async () => {
    await seedCatalog()

    const res = await request(app)
      .post('/api/lead/upsert')
      .set(authHeader())
      .send(payload({ _id: new mongoose.Types.ObjectId() }))

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('program.not_found')
  })
})

describe('GET /api/lead', () => {
  it('lists populated leads, newest first', async () => {
    const { program } = await seedCatalog()
    await request(app).post('/api/lead/upsert').set(authHeader()).send(payload(program, { email: 'a@x.com' }))
    await request(app).post('/api/lead/upsert').set(authHeader()).send(payload(program, { email: 'b@x.com' }))

    const res = await request(app).get('/api/lead').set(authHeader())

    expect(res.status).toBe(200)
    expect(res.body.list.map((l) => l.email)).toEqual(['b@x.com', 'a@x.com'])
    expect(res.body.list[0].interestProgram.name).toBe('Inglés')
    expect(res.body.list[0].trackings[0].tracking.name).toBe('Nuevo')
  })
})

describe('POST /api/lead/move', () => {
  const createLead = async (program) => {
    const res = await request(app).post('/api/lead/upsert').set(authHeader()).send(payload(program))
    return res.body.object
  }

  it('appends a tracking and returns the populated lead', async () => {
    const { program, contactado } = await seedCatalog()
    const lead = await createLead(program)

    const res = await request(app)
      .post('/api/lead/move')
      .set(authHeader())
      .send({ _id: lead._id, tracking: contactado._id.toString(), description: 'Called' })

    expect(res.status).toBe(200)
    const trackings = res.body.object.trackings
    expect(trackings).toHaveLength(2)
    expect(trackings[1].tracking.name).toBe('Contactado')
    expect(trackings[1].description).toBe('Called')
    expect(res.body.object.interestProgram.name).toBe('Inglés')
  })

  it('responds 400 on invalid ids', async () => {
    const res = await request(app)
      .post('/api/lead/move')
      .set(authHeader())
      .send({ _id: 'nope', tracking: '123' })

    expect(res.status).toBe(400)
    expect(res.body.errors).toMatchObject({ _id: 'lead.id.invalid', tracking: 'tracking.id.invalid' })
  })

  it('responds 404 for an unknown lead', async () => {
    const { contactado } = await seedCatalog()

    const res = await request(app)
      .post('/api/lead/move')
      .set(authHeader())
      .send({ _id: new mongoose.Types.ObjectId().toString(), tracking: contactado._id.toString() })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('lead.not_found')
  })

  it('responds 404 for an unknown tracking', async () => {
    const { program } = await seedCatalog()
    const lead = await createLead(program)

    const res = await request(app)
      .post('/api/lead/move')
      .set(authHeader())
      .send({ _id: lead._id, tracking: new mongoose.Types.ObjectId().toString() })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('tracking.not_found')
  })
})
