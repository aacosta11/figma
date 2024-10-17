import { type FigmaVariable as TFigmaVariable, type VariableValue, type CodeSyntax, commonValidators, valueValidators, inferredValueType, validateFigmaVariable } from '../schemas/figma-variable';


export class FigmaVariable {
   protected _variable: TFigmaVariable;

   constructor(name: string, value?: VariableValue) {
      this._variable = validateFigmaVariable({ name, value });
   }

   get variable(): TFigmaVariable { return this._variable; }
   set variable(variable: TFigmaVariable) { this._variable = validateFigmaVariable(variable); }

   get name(): string { return this._variable?.name; }
   get description(): string | undefined { return this._variable?.description; }
   get codeSyntax(): CodeSyntax | undefined { return this._variable?.code_syntax; }
   get hideFromPublishing(): boolean | undefined { return this._variable?.hideFromPublishing; }
   get value() { return this._variable?.value; }
   get value_type() { return this._variable?.value_type; }

   set name(name: string) { this._variable.name = commonValidators.name(name); }
   set description(description: string) { this._variable.description = commonValidators.description(description); }
   set codeSyntax(code_syntax: CodeSyntax) { this._variable.code_syntax = commonValidators.code_syntax(code_syntax); }
   set hideFromPublishing(hideFromPublishing: boolean) { this._variable.hideFromPublishing = commonValidators.hideFromPublishing(hideFromPublishing); }

   setValue(value: VariableValue) {
      try {
         const validatedValueTypePair = inferredValueType(value);
         this._variable.value = validatedValueTypePair.value;
         this._variable.value_type = validatedValueTypePair.value_type;
      } catch (error) {
         console.error(error);
      }
   }

   toString(replacer?: (number | string)[] | null, space?: string | number) {
      return JSON.stringify(this._variable, replacer, space);
   }

   toJSON() {
      return this._variable;
   }
}
