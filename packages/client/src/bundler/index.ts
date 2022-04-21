import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

let service: esbuild.Service;
export default async (rawCode: string) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    }

    try {
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

        return {
            code: result.outputFiles[0].text,
            err: ''
        };
    } catch (err: any) {
        return {
            code: '',
            err: err.message
        };
    }
};
