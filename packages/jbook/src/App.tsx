import React from 'react';
import { Provider } from 'react-redux';
import { store } from './state';
import CellList from './components/cell-list';

const App = () => {
    return (
        <Provider store={store}>
            <CellList />
        </Provider>
    );
};

export default App;
