// @import_dependencies
import { Request, Response } from 'express'

// @import_services
import { LeadService } from '@app/domains/lead/leadService'

// @import_models
import {  } from "@app/models"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"

// @import_types

class LeadController {
  

  
  private service = new LeadService()

  constructor () {}

  public upsert = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.upsert(_params)
    return responseUtility.build(res, response)
  }

  public list = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.list(_params)
    return responseUtility.build(res, response)
  }

  public move = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.move(_params)
    return responseUtility.build(res, response)
  }
}


export const leadController = new LeadController()
export { LeadController }