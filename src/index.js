import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {RuuiProvider} from 'react-universal-ui';
import searchService from './search';
import List from './components/List';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [search] = useState(searchService(settings));
  useEffect(() => {
    search.observable.subscribe(event => console.log('new event ', event));
  }, [search]);
  const onBlurInput = () => {
    search.new(inputValue);
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
      <List settings={settings} search={search} />
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
      id: 'gt_detect_eng',
    },
    {
      title: 'Google Translate ESP',
      id: 'gt_detect_esp',
    },
  ],
};
