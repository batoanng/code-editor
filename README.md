# Online Code Editor
A tool to launch an interactive development environment for writing and document code.

## Introduction
Users are able to build tech note with markdown syntax, also use code editor to install an build module on an online tool.
1. This project is built with TS
2. Monorepo is used by [Lerna](https://lerna.js.org/)
    1. CLI:
        - Need to know how to start up the Local API
    2. Local API:
        - Need to serve up the React App
        - Need to be able to save/load cells from a file
    3. React App (client):
        - Need to make its production assets available to either the local api or the public api
  
## Detailed design
### CLI
1. This is the tool that users can run from the command line, powered by [Commander](https://www.npmjs.com/package/commander) to utilize user's commands.
2. This module contains code to start up local API
3. Allow user to persist their code/text and share with others
4. Allow user to choose specific file to open up or save cells into.

### Local API
1. an [Express](https://www.npmjs.com/package/express) server plays a role as a middleware between CLI and React App.
   1. Send back the assets for React App.
   2. Find list of cells store in a file (named provided to the CLI) and send those back.
   3. Take the list of cells and store them into a file.
2. **Issues**: 
   - when doing active development, Local API must respond the change from browser to React App and vice versa.
   
   => Solution: use [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) to reflect the changes.

### React App
1. Code bundle by [ESBuild](https://esbuild.github.io)
    1. Bundling code remote or locally
        - Remove and extra request to API server, make code executes faster.
        - We don't have to maintain an API server.
        - Less complexity - no moving code back and forth.
        - **Issue**: when bundle, ESBuild tries to find dependencies on hard drive, but the code is built on browser, so no file system and ESBuild will throw an error.
            - solution:
                - We need to build a plugin to intercept ESBuild and find the path should be for the dependencies.
                - Use [unpkg](https://unpkg.com) to overcome CORS issue when we get the package from npm: unpkg will redirect to main file (index) of current version of dependencies.
                    - Issue with multiple and nested packages: Build a plugins to resolve file path, separate index file and other relative path.
                    - Issue with too much request call for 1 packages: use [localForage](https://www.npmjs.com/package/localforage) to cache requests.
    2. Challenges when execute user code
        - Code will be provided to preview as a string, we have to execute it safely.
        - This code may have advance js syntax in it that your browser cannot execute.
        - This code may have import statements from other js or css libraries. We have to deal with those import statements before execute the code.
    3. Issues with untrusted code
        - User provides code might throw errors and cause a program to crash.
        - User provides code might mutate the DOM, causing our program to crash.
        - User might accidentally run code provided by another malicious users.
       
    => This can be solved by running user's code in IFrame with direct communication disabled.
2. Use an open source editor to write code: [@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react) gives an almost-perfect editing experience immediately
3. Using [Redux](https://redux.js.org/) to centralize all the states of cell and bundled code, every component can watch to this and do update, prevent props drilling
4. Share code between code cells:
    In order to reuse code from previous code cells, we can access to redux and join bundled code from cells together, that would help user do not type again a variable or a function, just call them from previous cells is enough.
 
