import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'fileCache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: inputCode
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

                // When do load css packages ESBuild returns 2 files: js and css
                // css file does not have any place to store
                // So we must do it manually
                const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';
                const escaped = data.replace(/\n/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'");
                const contents =
                    fileType === 'css'
                        ? `
                            const style = document.createElement('style');
                            style.innerText = '${escaped}';
                            document.head.appendChild(style);
                        `
                        : data;

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents,
                    resolveDir: new URL('./', request.responseURL).pathname // This returns exactly file path of nested file instead of path of index file
                };

                // store response in cache
                await fileCache.setItem(args.path, result);

                return result;
            });
        }
    };
};
