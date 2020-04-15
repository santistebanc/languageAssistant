import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Flag from "./Flag";
import { observer } from "mobx-react";
import PhrasesList from "./PhrasesList";
import ResultText from "./ResultText";

const TranslationsList = observer(({ term, query }) => {
  return (
    <View style={styles.container}>
      {term.translations
        .sort(
          (a, b) =>
            (b.examplePhrases.length ? 5000 : 0) +
            (b.frequencyScores?.[0]?.freq || 0) -
            (a.examplePhrases.length ? 5000 : 0) -
            (a.frequencyScores?.[0]?.freq || 0)
        )
        .map((item, i) => (
          <React.Fragment key={i}>
            <View style={styles.item}>
              <Flag
                code={item.lang}
                width={16}
                height={12}
                style={styles.flag}
              />
              <ResultText
                style={styles.result}
                value={
                  item.text || ""
                }
              />
            </View>
            <PhrasesList
              list={item.examplePhrases.map((ph) =>
                ph.translations.find((tr) => tr.lang === term.lang)
              )}
              query={query}
              trans={item}
            />
          </React.Fragment>
        ))}
    </View>
  );
});

export default TranslationsList;

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  flag: {
    marginBottom: 4,
    marginRight: 4,
    marginTop: 6
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
