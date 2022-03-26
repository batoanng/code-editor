import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            /**
             * Handle root entry files
             */
            build.onResolve({ filter: /(^index\.js$)/ }, (args: any) => {
                return { path: args.path, namespace: 'a' };
            });

            /**
             * This solves issue import multiple files
             */
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                return {
                    namespace: 'a',
                    path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href
                };
            });

            /**
             * Handle main files of module
             */
            build.onResolve({ filter: /.*/ }, (args: any) => {
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                };
            });
        }
    };
};
