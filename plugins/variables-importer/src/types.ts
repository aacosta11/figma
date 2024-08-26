
export type FigmaVariable = ({
   name: string;
   description?: string;
   code_syntax?: never;
   hide_from_publishing?: never;
} & (
      { value: string; value_type: "STRING" } |
      { value: boolean, value_type: "BOOLEAN" } |
      { value: number, value_type: "FLOAT" } |
      { value: RGB, value_type: "COLOR" }
   )
)

export type CreateCollectionDto = {
   collection_name: string;
   variables: { [key: string]: FigmaVariable };
}


export enum UiMessage {
   CreateCollection = "CREATE_COLLECTION",
}

export type IncomingMessage = ({
   code: UiMessage.CreateCollection;
   data: CreateCollectionDto;
})
