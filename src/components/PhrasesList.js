import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const PhrasesList = ({list}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EXAMPLES</Text>
      {list.map(item => (
        <Text style={styles.result} key={item.text}>
          {item.text}
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
  },
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
