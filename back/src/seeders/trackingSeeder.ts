import { Tracking } from '@app/models'
import { IConsole } from '@client/client'

export const stages = [
  { order: 1, name: 'Nuevo', description: 'Lead recién registrado, sin contacto aún.' },
  { order: 2, name: 'Contactado', description: 'Ya se tuvo un primer contacto con el lead.' },
  { order: 3, name: 'Interesado', description: 'El lead mostró interés en el programa.' },
  { order: 4, name: 'En proceso de matrícula', description: 'El lead está completando su matrícula.' },
  { order: 5, name: 'Matriculado', description: 'El lead se matriculó en el programa.' },
  { order: 6, name: 'Descartado', description: 'El lead no continuará con el proceso.' },
]

export const run = async(_params, console:IConsole) => {
  try{
    for (const stage of stages) {
      await Tracking.updateOne(
        { name: stage.name },
        { $set: { order: stage.order, description: stage.description } },
        { upsert: true }
      )
    }
  } catch (error) {
    console.log('error', error)
    return false
  }
  return true
}
