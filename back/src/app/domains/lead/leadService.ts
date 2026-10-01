// @import_dependencies

// @import_services

// @import_models
import { Lead, Program, Tracking } from "@app/models"

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility"
import { validateLead, isObjectId } from "@app/domains/lead/leadValidator"

// @import_types

const POPULATE = [
  { path: 'interestProgram' },
  { path: 'trackings.tracking' },
]

class LeadService {
  
  
  constructor () {}
  
  public async upsert (_params) {
    try{
      const { errors, values } = validateLead(_params)
      if(Object.keys(errors).length){
        return responseUtility.error('lead.invalid', null, { code: 400, errors })
      }
      
      const program = await Program.findOne({_id: values.interestProgram}).lean()
      if(!program) return responseUtility.error('program.not_found', null, { code: 404 })
      
      const duplicated = await Lead.findOne({email: values.email}).lean()
      if(duplicated) return responseUtility.error('lead.email.duplicated', null, { code: 409 })
      
      const initial = await Tracking.findOne({}).sort({order: 1}).lean()
      if(!initial) return responseUtility.error('tracking.not_configured', null, { code: 500 })
      
      const { description, ...fields } = values
      const created = await Lead.create({
        ...fields,
        full_name: `${fields.first_name} ${fields.last_name}`,
        trackings: [{ tracking: initial._id, description }],
      })
      
      const lead = await Lead.findOne({_id: created._id}).populate(POPULATE).lean()
      
      return responseUtility.success({
        object: lead
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('server.error', null, { code: 500 })
    }
  }
  
  public async list (_params) {
    try{
      const list = await Lead.find({})
      .sort({created_at: -1})
      .populate(POPULATE)
      .lean()
      
      return responseUtility.success({
        list
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('server.error', null, { code: 500 })
    }
  }
  
  public async move (_params:{_id:string, tracking:string, description?:string}) {
    try{
      const errors: Record<string, string> = {}
      if(!isObjectId(_params._id)) errors._id = 'lead.id.invalid'
      if(!isObjectId(_params.tracking)) errors.tracking = 'tracking.id.invalid'
      if(Object.keys(errors).length){
        return responseUtility.error('lead.invalid', null, { code: 400, errors })
      }
      
      const [lead, tracking] = await Promise.all([
        Lead.findOne({_id: _params._id}).lean(),
        Tracking.findOne({_id: _params.tracking}).lean(),
      ])
      if(!lead) return responseUtility.error('lead.not_found', null, { code: 404 })
      if(!tracking) return responseUtility.error('tracking.not_found', null, { code: 404 })
      
      const description = typeof _params.description === 'string' ? _params.description.trim() : ''
      
      const moved = await Lead.findOneAndUpdate(
        {_id: lead._id},
        {$push: {trackings: {tracking: tracking._id, description}}},
        {new: true}
      )
      .populate(POPULATE)
      .lean()
      
      return responseUtility.success({
        object: moved
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('server.error', null, { code: 500 })
    }
  }
}



export const leadService = new LeadService()
export { LeadService }
