import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Entry = ({title, children}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

export default Entry;

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
  },
  container: {
    borderWidth: 1,
    borderColor: '#d6d7da',
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
