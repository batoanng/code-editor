import React, { useState, useEffect } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';
import CodeEditor, { CodeEditorProps } from './components/code-editor';
import Preview from './components/preview';

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const [bundler, setBundler] = useState<any>(null);

    const startService = async () => {
        const esBuildBundler = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
        setBundler(esBuildBundler);
    };

    const onClick = async () => {
        if (!bundler) {
            return;
        }

        // const result = await bundler.transform(input, {
        //     loader: 'jsx',
        //     target: 'es2015',
        // });
        //
        // setCode(result.code);

        // Use this function and config to intercept ESBuild
        // to find the path should be for the dependencies
        const result = await bundler.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });
        setCode(result.outputFiles[0].text);
    };

    useEffect(() => {
        startService().then();
    }, []);

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
