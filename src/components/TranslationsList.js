import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Flag from './Flag';

const TranslationsList = ({list}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRANSLATIONS</Text>
      {list.map((item, i) => (
        <View key={i} style={styles.item}>
          <Flag code={item.lang} width={16} height={12} style={styles.flag} />
          <Text style={styles.result}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default TranslationsList;

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
  },
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
