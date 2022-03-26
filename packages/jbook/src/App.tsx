import React, { useState, useEffect } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

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

        // console.log(result);

        setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

export default App;
