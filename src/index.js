import React, {useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {RuuiProvider} from 'react-universal-ui';
import ResultsList from './components/ResultsList';
import Flag from './components/Flag';
import {SearchSession} from './actions';
import {observer} from 'mobx-react';

const App = observer(({search}) => {
  const [inputValue, setInputValue] = useState('');

  const onBlurInput = () => {
    if (inputValue) {
      search.query = inputValue;
    }
  };
  const inputChange = (text) => {
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
          code={search && search.detectedLang}
          width={40}
          height={34}
          style={styles.flag}
        />
      </View>
      <ScrollView>
        <ResultsList results={search.results} />
      </ScrollView>
    </View>
  );
});

function AppContainer(props) {
  return (
    <RuuiProvider>
      <App search={new SearchSession()} />
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
