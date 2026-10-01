// @import_dependencies
import { Request, Response } from 'express'

// @import_services
import { TrackingService } from '@app/domains/tracking/trackingService'

// @import_models
import {  } from "@app/models"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"

// @import_types

class TrackingController {
  

  
  private service = new TrackingService()

  constructor () {}

  public list = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.list(_params)
    return responseUtility.build(res, response)
  }
}


export const trackingController = new TrackingController()
export { TrackingController }
