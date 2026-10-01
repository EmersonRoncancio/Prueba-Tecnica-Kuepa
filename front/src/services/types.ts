export interface Program {
  _id: string
  name: string
  description?: string
}

export interface Tracking {
  _id: string
  name: string
  description?: string
  order: number
}

export interface LeadTracking {
  _id?: string
  tracking: Tracking | string
  description?: string
}

export interface Lead {
  _id: string
  full_name: string
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  interestProgram: Program | null
  trackings: LeadTracking[]
  created_at: string
}

export interface ListResponse<T> {
  code: number
  status: string
  list: T[]
}

export interface ObjectResponse<T> {
  code: number
  status: string
  object: T
}

/** Error envelope returned by the API (see `responseUtility.error`). */
export interface ApiError {
  code: number
  status: string
  message?: string
  system_message?: string
  errors?: Record<string, string>
}

export interface LeadPayload {
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  interestProgram: string
  description?: string
}

export interface MovePayload {
  _id: string
  tracking: string
  description?: string
}
