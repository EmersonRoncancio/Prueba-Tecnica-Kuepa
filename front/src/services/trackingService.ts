import { get } from "../util/http"
import type { ListResponse, Tracking } from "./types"

const api = '/tracking'

export const trackingService = {
  api,
  /** Pipeline stages ordered by `order`. Resolves to `undefined` on failure. */
  list: async (): Promise<ListResponse<Tracking> | undefined> => {
    return await get({ api })
  },
}
