import React from "react";
import { View, StyleSheet, Text } from "react-native";
import TranslationsList from "./TranslationsList";
import { observer } from "mobx-react";
import ResultText from "./ResultText";

const ResultsList = observer(({ results = [], query }) => {
  return (
    <View style={styles.container}>
      {results.map((term, i) => (
        <React.Fragment key={i}>
          <ResultText style={styles.title} value={term.text || ""} />
          <TranslationsList term={term} query={query} />
        </React.Fragment>
      ))}
    </View>
  );
});

export default ResultsList;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "#333333",
    marginBottom: 5,
    marginTop: 18,
  },
  result: {
    fontSize: 16,
    paddingLeft: 4,
  },
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
