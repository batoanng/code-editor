import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';
import { OnLoadResult } from 'esbuild-wasm';

const fileCache = localForage.createInstance({
    name: 'fileCache'
});

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                if (args.path === 'index.js') {
                    return { path: args.path, namespace: 'a' };
                }

                /**
                 * This solves issue import multiple files
                 */
                if (args.path.includes('./') || args.path.includes('../')) {
                    return {
                        namespace: 'a',
                        path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href
                    };
                }
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                          const message = require('@joker7t/common-utils');
                          console.log(message);
                        `
                    };
                }

                // Check to see if we already fetch this file
                // and if it is in the cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

                // if it is, return immediately
                if (cachedResult) {
                    return cachedResult;
                }

                const { data, request } = await axios.get(args.path);
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname // This returns exactly file path of nested file instead of path of index file
                };

                // store response in cache
                await fileCache.setItem(args.path, result);

                return result;
            });
        }
    };
};
