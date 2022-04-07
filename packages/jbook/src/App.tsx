import React from 'react';
import { Provider } from 'react-redux';
import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';
import { store } from './state';

const App = () => {
    return (
        <Provider store={store}>
            <CodeCell />
            <TextEditor />
        </Provider>
    );
};

export default App;
