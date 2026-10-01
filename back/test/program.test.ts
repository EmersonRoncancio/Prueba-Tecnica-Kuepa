import request from 'supertest'
import { buildTestApp } from './helpers/testApp'
import { authHeader, fakeConsole } from './helpers/auth'
import { Program } from '@app/models'
import { run as runProgramSeeder } from '../src/seeders/programSeeder'

const app = buildTestApp()

describe('GET /api/program', () => {
  it('responds 401 without a token', async () => {
    const res = await request(app).get('/api/program')
    expect(res.status).toBe(401)
  })

  it('lists programs sorted by name', async () => {
    await Program.create([{ name: 'Zeta', description: 'z' }, { name: 'Alpha', description: 'a' }])

    const res = await request(app).get('/api/program').set(authHeader())

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('success')
    expect(res.body.list.map((p) => p.name)).toEqual(['Alpha', 'Zeta'])
  })
})

describe('programSeeder', () => {
  it('upserts programs idempotently by name', async () => {
    expect(await runProgramSeeder({}, fakeConsole)).toBe(true)
    const first = await Program.countDocuments({})
    expect(first).toBeGreaterThanOrEqual(5)

    expect(await runProgramSeeder({}, fakeConsole)).toBe(true)
    expect(await Program.countDocuments({})).toBe(first)
  })
})
