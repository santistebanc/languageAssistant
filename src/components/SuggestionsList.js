import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const SuggestionsList = ({list}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUGGESTIONS</Text>
      {list.map((item, i) => (
        <Text style={styles.result} key={i}>
          {item.text}
        </Text>
      ))}
    </View>
  );
};

export default SuggestionsList;

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
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
