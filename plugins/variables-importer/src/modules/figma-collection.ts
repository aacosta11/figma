import { FigmaVariable } from '../modules/figma-variable';


export class FigmaCollection {
   private _collection: VariableCollection;

   constructor(name: string) {
      this._collection = figma.variables.createVariableCollection(name);
   }

   get modeId() {
      return this._collection.modes[0].modeId;
   }

   addVariable(figmaVariable: FigmaVariable) {
      const { name, description, value, value_type } = figmaVariable.toJSON();
      const variable = figma.variables.createVariable(name, this._collection, value_type);
      if (description) variable.description = description;
      variable.setValueForMode(this.modeId, value);
   }
}