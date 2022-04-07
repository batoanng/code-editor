import React from 'react';
import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';
import { Provider } from 'react-redux';
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
