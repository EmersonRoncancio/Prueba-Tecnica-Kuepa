import request from 'supertest'
import { buildTestApp, textParser } from './helpers/testApp'

describe('app', () => {
  it('GET / responds 200', async () => {
    const res = await request(buildTestApp()).get('/').buffer(true).parse(textParser)
    expect(res.status).toBe(200)
    expect(res.body).toBe('API is running')
  })
})
