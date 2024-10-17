
export type VariableValue = boolean | string | number | RGB | RGBA

export type VariableType = 'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING'

export type VariableValueTypePair = { value_type: 'BOOLEAN', value: boolean } | { value_type: 'COLOR', value: RGB | RGBA } | { value_type: 'FLOAT', value: number } | { value_type: 'STRING', value: string }

export type CodeSyntax = Partial<Record<CodeSyntaxPlatform, string>>

export type FigmaVariable = {
   name: string,
   description?: string,
   code_syntax?: CodeSyntax,
   hideFromPublishing?: boolean,
} & VariableValueTypePair


export const commonValidators = {
   name: (value: string) => {
      if (typeof value !== 'string') throw new Error('Name must be a string')
      if (value.length === 0) throw new Error('Name cannot be empty')
      return value.trim()
   },
   description: (value: string) => {
      if (typeof value !== 'string') throw new Error('Description must be a string')
      return value.trim()
   },
   code_syntax: function (value: CodeSyntax): FigmaVariable['code_syntax'] {
      if (typeof value !== 'object') throw new Error('Code syntax must be an object')
      return {
         WEB: value.WEB ? value.WEB.trim() : undefined,
         ANDROID: value.ANDROID ? value.ANDROID.trim() : undefined,
         iOS: value.iOS ? value.iOS.trim() : undefined,
      }
   },
   hideFromPublishing: (value: boolean) => {
      return !!value
   },
}

export const valueValidators = {
   boolean: function (value: boolean): boolean {
      return !!value
   },
   float: function (value: number): number {
      if (typeof value !== 'number') throw new Error('Value must be a number')
      return value
   },
   string: function (value: string): string {
      if (typeof value !== 'string') throw new Error('Value must be a string')
      return value.trim()
   },
   color: function (value: RGB | RGBA): RGB | RGBA {
      if (typeof value !== 'object') throw new Error('Value must be an object')
      if (value.r === undefined) throw new Error('Color must have a red value')
      if (value.g === undefined) throw new Error('Color must have a green value')
      if (value.b === undefined) throw new Error('Color must have a blue value')
      return value
   },
}


export const explicitValueType = (value_type: VariableType, value: unknown): VariableValueTypePair => {
   switch (value_type) {
      case 'BOOLEAN':
         return { value_type, value: valueValidators.boolean(value as boolean) }
      case 'COLOR':
         return { value_type, value: valueValidators.color(value as RGB | RGBA) }
      case 'FLOAT':
         return { value_type, value: valueValidators.float(value as number) }
      case 'STRING':
         return { value_type, value: valueValidators.string(value as string) }
      default:
         throw new Error('Invalid value type')
   }
}

export const inferredValueType = (value: unknown): VariableValueTypePair => {
   switch (typeof value) {
      case 'boolean':
         return { value_type: 'BOOLEAN', value: valueValidators.boolean(value as boolean) }
      case 'number':
         return { value_type: 'FLOAT', value: valueValidators.float(value as number) }
      case 'string':
         return { value_type: 'STRING', value: valueValidators.string(value as string) }
      case 'object':
         return { value_type: 'COLOR', value: valueValidators.color(value as RGB | RGBA) }
      default:
         throw new Error('Invalid value type')
   }
}


export const validateFigmaVariable = (variable: unknown): FigmaVariable => {
   if (typeof variable !== 'object') throw new Error('Variable must be an object')
   if (variable === null) throw new Error('Variable cannot be null')

   const { name, description, code_syntax, hideFromPublishing, value, value_type } = variable as FigmaVariable

   const validatedVariable: FigmaVariable = {
      name: commonValidators.name(name),
      description: description ? commonValidators.description(description) : undefined,
      code_syntax: code_syntax ? commonValidators.code_syntax(code_syntax) : undefined,
      hideFromPublishing: hideFromPublishing ? commonValidators.hideFromPublishing(hideFromPublishing) : undefined,
      ...(value_type ? explicitValueType(value_type, value) : inferredValueType(value))
   } as FigmaVariable

   return validatedVariable
}
