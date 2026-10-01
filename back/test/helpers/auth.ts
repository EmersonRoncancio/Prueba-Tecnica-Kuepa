import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import config from 'config'

/** Authorization header signed the same way authService signs login tokens. */
export const authHeader = () => {
  const token = jwt.sign({ user: new mongoose.Types.ObjectId().toString() }, config.jwt, { expiresIn: '1h' })
  return { Authorization: `Bearer ${token}` }
}

/** Minimal stand-in for the CLI console passed to seeders. */
export const fakeConsole: any = { log: jest.fn() }
