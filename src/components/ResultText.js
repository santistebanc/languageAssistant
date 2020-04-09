import React from "react";
import { Clipboard } from "react-native";
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import SearchSession from "../search";

export default (props) => (
  <SelectableText
    menuItems={["Search", "Copy"]}
    onSelection={({ eventType, content }) => {
      if (content) {
        if (eventType === "Copy") {
          Clipboard.setString(content);
        } else if (eventType === "Search") {
          SearchSession.query = content;
        }
      }
    }}
    {...props}
  />
);
