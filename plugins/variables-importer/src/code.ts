// https://www.figma.com/plugin-docs/how-plugins-run

import { FigmaCollection } from "./figma-variables-module";
import { UiMessage, IncomingMessage } from "./types";


function main() {
  figma.showUI(__html__, { themeColors: true });

  figma.ui.onmessage = (msg: IncomingMessage) => {
    if (!msg.code) return;

    switch (msg.code) {
      case UiMessage.CreateCollection:
        console.log("adding collection...");
        console.log(msg.data);
        const collection = new FigmaCollection(msg.data.collection_name);
        for (const key of Object.keys(msg.data.variables)) {
          collection.addVariable(msg.data.variables[key]);
        }
        console.log("collection added!");
        break;
    }
  }
}


main();