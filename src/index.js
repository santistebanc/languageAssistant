import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {RuuiProvider} from 'react-universal-ui';
import searchService from './search';
import TranslationsList from './components/TranslationsList';
// import SimilarList from './components/SimilarList';
// import SuggestionsList from './components/SuggestionsList';
import {translationsIndex, languageDetected} from './state';
import Flag from './components/Flag';

const App = () => {
  const searchTerm = useRef('');
  const detectedLanguage = useRef('eng');
  const [inputValue, setInputValue] = useState('');
  const [translations, setTranslations] = useState([]);
  const [inputLanguage, setInputLanguage] = useState('eng');
  // const [similar, setSimilar] = useState([]);
  // const [suggestions, setSuggestions] = useState([]);
  const [search] = useState(searchService(settings));

  const getInputLanguage = () => inputLanguage;

  useEffect(() => {
    const subscription = languageDetected.subscribe(lang => {
      detectedLanguage.current = lang;
      setInputLanguage(lang);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = translationsIndex.subscribe(index => {
      const langidx = index[detectedLanguage.current] || {};
      const list = langidx[searchTerm.current];
      if (list) {
        setTranslations([...translations, ...list]);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const subscription = similarDeu.subscribe(index => {
  //     setSimilar([...(index.get(searchTerm.current) || [])]);
  //   });
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   const subscription = suggestionsDeu.subscribe(index => {
  //     setSuggestions([...(index.get(searchTerm.current) || [])]);
  //   });
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  const onBlurInput = () => {
    if (inputValue && inputValue !== searchTerm.current) {
      setTranslations([]);
      // setSimilar([]);
      // setSuggestions([]);
      searchTerm.current = inputValue;
      search.new(inputValue);
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
        <Flag code={inputLanguage} width={40} height={34} style={styles.flag} />
      </View>
      <ScrollView>
        {/* <SuggestionsList list={suggestions} /> */}
        <TranslationsList list={translations} />
        {/* <SimilarList list={similar} /> */}
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
