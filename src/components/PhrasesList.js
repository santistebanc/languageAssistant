import React from "react";
import { View, StyleSheet, Text, Clipboard } from "react-native";
import ResultText from "./ResultText";

const getHighlightedText = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <Text style={styles.highlight} key={i}>
        {part}
      </Text>
    ) : (
      <Text style={styles.context} key={i}>
        {part}
      </Text>
    )
  );
};

const PhrasesList = ({ list, query, trans }) => {
  return (
    <View style={styles.container}>
      {list.map(
        (item, i) =>
          item.text &&
          query && (
            <React.Fragment key={i}>
              <ResultText
                style={styles.result}
                value={getHighlightedText(item.text, query)}
              />
              {item.translations
                .filter((tr) => tr.terms.some((t) => t === trans))
                .map((it, k) => (
                  <ResultText
                    key={k}
                    style={styles.trans}
                    value={getHighlightedText(it.text, trans.text)}
                  />
                ))}
            </React.Fragment>
          )
      )}
    </View>
  );
};

export default PhrasesList;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  flag: {
    marginBottom: 4,
    marginRight: 4,
  },
  result: {
    fontSize: 16,
    paddingLeft: 4,
    flexDirection: "row",
    color: "#365871",
  },
  trans: {
    fontSize: 12,
    paddingLeft: 4,
    marginBottom: 14,
    flexDirection: "row",
    color: "#578DB5",
  },
  context: {
    fontSize: 16,
    textAlign: "left",
  },
  highlight: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
