import { Program } from '@app/models'
import { IConsole } from '@client/client'

export const programs = [
  {
    name: 'Bachillerato Virtual',
    description: 'Completa tu bachillerato 100% en línea, a tu ritmo y con acompañamiento docente.',
  },
  {
    name: 'Técnico Laboral en Sistemas',
    description: 'Formación técnica en soporte, redes y fundamentos de programación.',
  },
  {
    name: 'Técnico Laboral en Auxiliar Administrativo',
    description: 'Gestión documental, atención al cliente y herramientas ofimáticas para el entorno administrativo.',
  },
  {
    name: 'Técnico Laboral en Contabilidad',
    description: 'Contabilidad básica, nómina e impuestos con software contable.',
  },
  {
    name: 'Inglés',
    description: 'Programa de inglés virtual por niveles, del básico al intermedio.',
  },
]

export const run = async(_params, console:IConsole) => {
  try{
    for (const program of programs) {
      await Program.updateOne(
        { name: program.name },
        { $set: { description: program.description } },
        { upsert: true }
      )
    }
  } catch (error) {
    console.log('error', error)
    return false
  }
  return true
}
