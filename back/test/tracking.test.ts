import request from 'supertest'
import { buildTestApp } from './helpers/testApp'
import { authHeader, fakeConsole } from './helpers/auth'
import { Tracking } from '@app/models'
import { run as runTrackingSeeder } from '../src/seeders/trackingSeeder'

const app = buildTestApp()

describe('GET /api/tracking', () => {
  it('responds 401 without a token', async () => {
    const res = await request(app).get('/api/tracking')
    expect(res.status).toBe(401)
  })

  it('lists stages sorted by order ascending', async () => {
    await Tracking.create([
      { name: 'Second', order: 2 },
      { name: 'Third', order: 3 },
      { name: 'First', order: 1 },
    ])

    const res = await request(app).get('/api/tracking').set(authHeader())

    expect(res.status).toBe(200)
    expect(res.body.list.map((t) => t.name)).toEqual(['First', 'Second', 'Third'])
  })
})

describe('trackingSeeder', () => {
  it('upserts the pipeline stages in order, idempotently', async () => {
    expect(await runTrackingSeeder({}, fakeConsole)).toBe(true)
    expect(await runTrackingSeeder({}, fakeConsole)).toBe(true)

    const stages = await Tracking.find({}).sort({ order: 1 }).lean()
    expect(stages.map((s) => [s.order, s.name])).toEqual([
      [1, 'Nuevo'],
      [2, 'Contactado'],
      [3, 'Interesado'],
      [4, 'En proceso de matrícula'],
      [5, 'Matriculado'],
      [6, 'Descartado'],
    ])
  })
})
