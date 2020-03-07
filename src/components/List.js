import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Entry from './Entry';

const List = ({settings, search}) => {
  const [results, setResults] = useState(
    settings.entries.map(entry => ({
      title: entry.title,
      id: entry.id,
      loading: true,
      content: '',
    })),
  );
  search.observable.subscribe(event => {
    settings.entries.forEach(e => {
      if (e.id === event.id && event.status === 'success') {
        const entry = results.find(res => res.id === e.id);
        entry.loading = false;
        entry.content = event.payload;
      }
    });
    setResults([...results]);
  });
  return (
    <View style={styles.container}>
      {results.map(result => (
        <Entry key={result.id} title={result.title}>
          {result.loading ? (
            <Text>{'...loading'}</Text>
          ) : (
            <Text>{result.content}</Text>
          )}
        </Entry>
      ))}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },
});
