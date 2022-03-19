# Online Code Editor
A CLI to launch an interactive development environment for writing and document code.

Users are able to build tech note with markdown syntax, also use code editor to install an build module on an online tool.
1. This project is built with TS
2. Monorepo is used by lerna
3. Code bundle by [ESBuild](https://esbuild.github.io)
   1. Bundling code remote or locally
      - Remove and extra request to API server, make code executes faster.
      - We don't have to maintain an API server.
      - Less complexity - no moving code back and forth.
      - **Issue**: when bundle, ESBuild tries to find dependencies on hard drive, but the code is built on browser, so no file system and ESBuild will throw an error.
        - solution: 
          - We need to build a plugin to intercept ESBuild and find the path should be for the dependencies.
          - Use [unpkg](https://unpkg.com) to overcome CORS issue when we get the package from npm: unpkg will redirect to main file (index) of current version of dependencies.