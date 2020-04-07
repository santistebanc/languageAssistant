import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const getHighlightedText = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <Text style={styles.highlight} key={i}>
        {part}
      </Text>
    ) : (
      <Text style={styles.context} key={i}>
        {part}
      </Text>
    ),
  );
};

const PhrasesList = ({list, query, trans}) => {
  return (
    <View style={styles.container}>
      {list.map((item, i) => (
        <React.Fragment key={i}>
          <Text style={styles.result}>
            {item.text && query && getHighlightedText(item.text, query)}
          </Text>
          <Text key={i} style={styles.trans}>
            {item.text &&
              query &&
              getHighlightedText(item.translations[0].phrase.text, trans)}
          </Text>
        </React.Fragment>
      ))}
    </View>
  );
};

export default PhrasesList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flag: {
    marginBottom: 4,
    marginRight: 4,
  },
  result: {
    fontSize: 16,
    paddingLeft: 4,
    flexDirection: 'row',
    color: '#365871',
  },
  trans: {
    fontSize: 12,
    paddingLeft: 4,
    marginBottom: 14,
    flexDirection: 'row',
    color: '#578DB5',
  },
  context: {
    fontSize: 16,
    textAlign: 'left',
  },
  highlight: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
  },
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
