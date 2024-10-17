import { type FigmaVariable } from "../modules/figma-variable";

export type CreateCollectionDto = {
   collection_name: string;
   variables: FigmaVariable[];
}

export enum UiMessage {
   CreateCollection = "CREATE_COLLECTION",
}

export type IncomingMessage = ({
   code: UiMessage.CreateCollection;
   data: CreateCollectionDto;
})
