import React, {useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {RuuiProvider} from 'react-universal-ui';
import Search from './search';
import TranslationsList from './components/TranslationsList';
import SimilarList from './components/SimilarList';
import SuggestionsList from './components/SuggestionsList';
import PhrasesList from './components/PhrasesList';
import Flag from './components/Flag';
import {observer} from 'mobx-react';

const App = observer(({service}) => {
  const [inputValue, setInputValue] = useState('');

  const onBlurInput = () => {
    if (inputValue) {
      service.search(inputValue);
    }
  };
  const inputChange = text => {
    setInputValue(text);
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <TextInput
          style={styles.input}
          onBlur={onBlurInput}
          value={inputValue}
          onChangeText={inputChange}
        />
        <Flag
          code={service.detectedLang}
          width={40}
          height={34}
          style={styles.flag}
        />
      </View>
      <ScrollView>
        <SuggestionsList list={service.suggestions} />
        <TranslationsList list={service.translations} />
        <PhrasesList list={service.examplePhrases} />
        <SimilarList list={service.similarTerms} />
      </ScrollView>
    </View>
  );
});

function AppContainer(props) {
  return (
    <RuuiProvider>
      <App service={Search} />
    </RuuiProvider>
  );
}

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  searchbar: {
    flexDirection: 'row',
  },
  translation: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#d6d7da',
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingLeft: 4,
    height: 'auto',
    minWidth: 200,
  },
});
