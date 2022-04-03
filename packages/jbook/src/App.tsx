import React, { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const iframe = useRef<any>();
    const [bundler, setBundler] = useState<any>(null);

    const startService = async () => {
        const esBuildBundler = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
        setBundler(esBuildBundler);
    };
    useEffect(() => {
        startService();
    }, []);

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

    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message', (event) => {
                        eval(event.data);
                    }, false);
                </script>
            </body>
        </html>
    `;

    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
            <iframe sandbox="allow-scripts" srcDoc={html} ref={iframe} />
        </div>
    );
};

export default App;
