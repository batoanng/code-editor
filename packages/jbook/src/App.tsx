import React, { useState } from 'react';
import CodeEditor, { CodeEditorProps } from './components/code-editor';
import Preview from './components/preview';
import bundler from './bundler';

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const onClick = async () => {
        const compiledCode = await bundler(input);

        setCode(compiledCode);
    };
    const codeEditorProps: CodeEditorProps = {
        initialValue: 'const a = 1;',
        onChange: (value) => setInput(value)
    };

    return (
        <div>
            <CodeEditor {...codeEditorProps} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code} />
        </div>
    );
};

export default App;
