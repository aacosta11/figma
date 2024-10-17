// https://www.figma.com/plugin-docs/how-plugins-run

import { FigmaCollection } from "./modules/figma-collection";
import { FigmaVariable } from "./modules/figma-variable";
import { UiMessage, type IncomingMessage } from "./modules/incoming-message";


function main() {
  figma.showUI(__html__, { themeColors: true });

  figma.ui.onmessage = (msg: IncomingMessage) => {
    if (!msg.code) return;

    switch (msg.code) {
      case UiMessage.CreateCollection:
        console.log("adding collection...");
        const variables: FigmaVariable[] = [];
        for (const variable of msg.data.variables) {
          const figmaVariable = new FigmaVariable(variable.name, variable.value);
          variables.push(figmaVariable);
        }
        if (variables.length === 0) {
          console.error("No variables to add to collection!");
          return;
        }
        const collection = new FigmaCollection(msg.data.collection_name);
        for (const figmaVariable of variables) {
          collection.addVariable(figmaVariable);
        }
        console.log("collection added!");
        break;
    }
  }
}


main();

