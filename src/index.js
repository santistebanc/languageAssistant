import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {RuuiProvider} from 'react-universal-ui';
import searchService from './search';
import TranslationsList from './components/TranslationsList';
import SimilarList from './components/SimilarList';
import SuggestionsList from './components/SuggestionsList';
import {translationsDeu, similarDeu, suggestionsDeu} from './state';

const App = () => {
  let searchTerm = useRef('');
  const [inputValue, setInputValue] = useState('');
  const [translations, setTranslations] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search] = useState(searchService(settings));
  useEffect(() => {
    const subscription = translationsDeu.subscribe(index => {
      const list = index.get(searchTerm.current);
      if (list) {
        setTranslations([...translations, ...list]);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = similarDeu.subscribe(index => {
      setSimilar([...(index.get(searchTerm.current) || [])]);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = suggestionsDeu.subscribe(index => {
      setSuggestions([...(index.get(searchTerm.current) || [])]);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onBlurInput = () => {
    if (inputValue && inputValue !== searchTerm.current) {
      setTranslations([]);
      setSimilar([]);
      setSuggestions([]);
      searchTerm.current = inputValue;
      search.new(inputValue);
    }
  };
  const inputChange = text => {
    setInputValue(text);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onBlur={onBlurInput}
        value={inputValue}
        onChangeText={inputChange}
      />
      <ScrollView>
        <SuggestionsList list={suggestions} />
        <TranslationsList list={translations} />
        <SimilarList list={similar} />
      </ScrollView>
    </View>
  );
};

function AppContainer(props) {
  return (
    <RuuiProvider>
      <App />
    </RuuiProvider>
  );
}

export default AppContainer;

const styles = StyleSheet.create({
  translation: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
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

const settings = {
  entries: [
    {
      title: 'Google Translate ENG',
      id: 'gt_deu_eng',
    },
    {
      title: 'Google Translate ESP',
      id: 'gt_deu_esp',
    },
  ],
};
