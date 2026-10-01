// @import_dependencies

// @import_services

// @import_models
import { Program } from "@app/models"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"

// @import_types


class ProgramService {
  
  
  constructor () {}
  
  public async list (_params) {
    try{
      const list = await Program.find({})
      .sort({name: 1})
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

export const programService = new ProgramService()
export { ProgramService }
