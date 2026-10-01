import { get } from "../util/http"
import type { ListResponse, Program } from "./types"

const api = '/program'

export const programService = {
  api,
  /** Resolves to `undefined` when the request fails (see `util/http`). */
  list: async (): Promise<ListResponse<Program> | undefined> => {
    return await get({ api })
  },
}
