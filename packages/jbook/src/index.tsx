import * as esbuild from 'esbuild-wasm';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const [bundler, setBundler] = useState<any>(null);

    const startService = async () => {
        const esBundler = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm',
        });
        setBundler(esBundler);
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
            entryPoints: ['index.ts'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()],
        });

        setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
