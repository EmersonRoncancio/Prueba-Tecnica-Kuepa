import { get, post } from "../util/http"
import type {
  ApiError, Lead, LeadPayload, ListResponse, MovePayload, ObjectResponse,
} from "./types"

const api = '/lead'

type Result<T> = Promise<T | ApiError | undefined>

export const leadService = {
  api,
  get: async({_id}:{_id:string}) =>{
    return await get({api: `${api}/get/${_id}`})
  },
  /** Resolves to `undefined` when the request fails (see `util/http`). */
  list: async (): Promise<ListResponse<Lead> | undefined> => {
    return await get({ api })
  },
  create: async (data: LeadPayload): Result<ObjectResponse<Lead>> => {
    return await post({ api: `${api}/upsert`, options: { data: { ...data } } })
  },
  move: async (data: MovePayload): Result<ObjectResponse<Lead>> => {
    return await post({ api: `${api}/move`, options: { data: { ...data } } })
  },
}
