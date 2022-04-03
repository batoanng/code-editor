import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from '../plugins';

let service: esbuild.Service;
export default async (rawCode: string) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    }

    // const result = await bundler.transform(input, {
    //     loader: 'jsx',
    //     target: 'es2015',
    // });
    //
    // setCode(result.code);

    // Use this function and config to intercept ESBuild
    // to find the path should be for the dependencies
    const result = await service.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    });

    return result.outputFiles[0].text;
};
