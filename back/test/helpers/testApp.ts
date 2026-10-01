import { App } from '@app/app'

/** Builds the Express application without connecting to Mongo or listening. */
export const buildTestApp = () => new App().build()

/**
 * `GET /` replies plain text under a JSON content type (set by the request
 * middleware), so supertest needs a raw text parser to read it.
 */
export const textParser = (res: any, callback: (err: Error | null, body: string) => void) => {
  let data = ''
  res.setEncoding('utf8')
  res.on('data', (chunk: string) => { data += chunk })
  res.on('end', () => callback(null, data))
}
