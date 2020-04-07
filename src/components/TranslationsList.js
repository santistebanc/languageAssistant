import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Flag from './Flag';
import {observer} from 'mobx-react';
import PhrasesList from './PhrasesList';

const TranslationsList = observer(({term, query}) => {
  return (
    <View style={styles.container}>
      {(term.translations?.map(tr => tr.term) || []).map((item, i) => (
        <React.Fragment key={i}>
          <View style={styles.item}>
            <Flag code={item.lang} width={16} height={12} style={styles.flag} />
            <Text style={styles.result}>{item.text}</Text>
          </View>
          <PhrasesList
            list={
              term.examplePhrases
                ?.filter(it =>
                  it.phrase.translations.some(tr =>
                    item.examplePhrases
                      .map(ex => ex.phrase)
                      .includes(tr.phrase),
                  ),
                )
                .map(it => it.phrase) || []
            }
            query={query}
            trans={item.text}
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
