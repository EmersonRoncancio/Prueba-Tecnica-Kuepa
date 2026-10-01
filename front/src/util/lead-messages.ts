const GENERIC = 'No pudimos completar la solicitud. Inténtalo de nuevo.'

/** Single place that maps backend error keys to user-facing Spanish messages. */
const messages: Record<string, string> = {
  'lead.first_name.required': 'El nombre es obligatorio.',
  'lead.first_name.too_long': 'El nombre no puede superar los 100 caracteres.',
  'lead.last_name.required': 'El apellido es obligatorio.',
  'lead.last_name.too_long': 'El apellido no puede superar los 100 caracteres.',
  'lead.email.required': 'El correo electrónico es obligatorio.',
  'lead.email.invalid': 'Ingresa un correo electrónico válido.',
  'lead.email.duplicated': 'Este correo ya está registrado.',
  'lead.mobile_phone.required': 'El teléfono es obligatorio.',
  'lead.mobile_phone.invalid': 'El teléfono debe tener entre 7 y 15 dígitos (puede iniciar con +).',
  'lead.interestProgram.required': 'Selecciona un programa de interés.',
  'lead.interestProgram.invalid': 'Selecciona un programa válido.',
  'lead.description.too_long': 'La nota no puede superar los 500 caracteres.',
  'program.not_found': 'El programa seleccionado ya no existe.',
  'lead.not_found': 'El prospecto ya no existe.',
  'tracking.not_found': 'La etapa seleccionada ya no existe.',
}

export const leadMessage = (key?: string): string => (key && messages[key]) || GENERIC
