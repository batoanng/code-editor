import React, { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';
import CodeEditor, { CodeEditorProps } from './components/code-editor';

const App = () => {
    const [input, setInput] = useState('');
    const iframe = useRef<any>();
    const [bundler, setBundler] = useState<any>(null);

    const html = `
        <html lang='en'>
            <head title='Code Preview'><title>Code Preview</title></head>
            <body>
                <div id='root'></div>
                <script>
                    window.addEventListener('message', (event) => {
                        try {
                          eval(event.data);
                        } catch (e) {
                            const rootEl = document.querySelector('#root');
                            rootEl.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + e + '</div>';
                            throw e;
                        }
                    }, false);
                </script>
            </body>
        </html>
    `;

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

        iframe.current.srcdoc = html;

        // const result = await bundler.transform(input, {
        //     loader: 'jsx',
        //     target: 'es2015',
        // });
        //
        // setCode(result.code);

        /**
         * Use this function and config to intercept ESBuild
         * to find the path should be for the dependencies
         */
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
        // setCode(result.outputFiles[0].text);

        /**
         * Instead of use set code, we use this to overcome passing event from parent to child
         * Also pass code as a string, prevent case unescaped code
         */
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
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
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <iframe title="Code Preview" sandbox="allow-scripts" srcDoc={html} ref={iframe} />
        </div>
    );
};

export default App;
