// @import_dependencies

// @import_services

// @import_models
import { Tracking } from "@app/models"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"

// @import_types


class TrackingService {
  
  
  constructor () {}
  
  public async list (_params) {
    try{
      const list = await Tracking.find({})
      .sort({order: 1})
      .lean()
      
      return responseUtility.success({
        list
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('server.error', null, { code: 500 })
    }
  }
}

export const trackingService = new TrackingService()
export { TrackingService }
