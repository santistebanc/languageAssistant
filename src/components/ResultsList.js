import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TranslationsList from './TranslationsList';
import {observer} from 'mobx-react';

const ResultsList = observer(({results = []}) => {
  return (
    <View style={styles.container}>
      {results.map((term, i) => (
        <React.Fragment key={i}>
          <Text style={styles.title}>{term.text}</Text>
          <TranslationsList
            list={term.translations?.map((tr) => tr.term) || []}
          />
        </React.Fragment>
      ))}
    </View>
  );
});

export default ResultsList;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
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
