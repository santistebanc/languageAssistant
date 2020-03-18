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

const PhrasesList = ({list, searchTerm}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EXAMPLES</Text>
      {list.map((item, i) => (
        <Text key={i} style={styles.result}>
          {item.text && searchTerm && getHighlightedText(item.text, searchTerm)}
        </Text>
      ))}
    </View>
  );
};

export default PhrasesList;

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
  },
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
    marginBottom: 10,
    flexDirection: 'row',
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
