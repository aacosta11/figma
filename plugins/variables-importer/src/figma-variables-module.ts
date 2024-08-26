import { FigmaVariable as TFigmaVariable } from "./types";

// #region FigmaVariable class
export class FigmaVariable {
   private _name: TFigmaVariable["name"] = "";
   private _value: TFigmaVariable["value"] = "";
   private _value_type: TFigmaVariable["value_type"] = "STRING";
   private _description?: TFigmaVariable["description"];
   private _code_syntax?: TFigmaVariable["code_syntax"]; 
   private _hide_from_publishing?: TFigmaVariable["hide_from_publishing"];

   constructor(v: TFigmaVariable) {
      if (!v.name) throw new Error("name is required");
      if (!v.value) throw new Error("value is required");
      if (!v.value_type) throw new Error("value_type is required");
      this.name = v.name;
      this.description = v.description;
      this.value_type = v.value_type;
      this.value = v.value;
   }
   get name() { return this._name; }
   set name(n: string) {
      if (!n || typeof n !== "string") throw new Error("name is required");
      this._name = n;
   }
   get description() { return this._description; }
   set description(d: string | undefined) {
      if (d && typeof d !== "string") throw new Error("description must be a string");
      this._description = d;
   }
   get value() { return this._value; }
   set value(v: string | boolean | number | RGB) {
      switch (this._value_type) {
         case "STRING":
            if (typeof v !== "string") throw new Error("value must be a string");
            break;
         case "BOOLEAN":
            if (typeof v !== "boolean") throw new Error("value must be a boolean");
            break;
         case "FLOAT":
            if (typeof v !== "number") throw new Error("value must be a number");
            break;
         case "COLOR":
            if (typeof v !== "object") throw new Error("value must be an rgb object");
            if (!v.r || !v.g || !v.b) throw new Error("value must have r, g, and b properties");
            break;
         default:
            throw new Error("value_type must be one of 'STRING', 'BOOLEAN', 'FLOAT', or 'COLOR'");
      }
      this._value = v;
   }
   get value_type() { return this._value_type; }
   set value_type(t: "STRING" | "BOOLEAN" | "FLOAT" | "COLOR") {
      if (!t) throw new Error("value_type is required");
      if (["STRING", "BOOLEAN", "FLOAT", "COLOR"].indexOf(t) === -1) throw new Error("value_type must be one of 'STRING', 'BOOLEAN', 'FLOAT', or 'COLOR'");
      this._value_type = t;
   }
}

// #region FigmaCollection class
export class FigmaCollection {
   private _collection: VariableCollection;

   constructor(name: string) {
      this._collection = figma.variables.createVariableCollection(name);
   }

   get modeId() {
      return this._collection.modes[0].modeId;
   }

   addVariable(v: TFigmaVariable) {
      const { name, description, value, value_type } = new FigmaVariable(v);
      const variable = figma.variables.createVariable(name, this._collection, value_type);
      if (description) variable.description = description;
      variable.setValueForMode(this.modeId, value);
   }
}