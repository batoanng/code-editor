module.exports = {
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    testRegex: [
        "((__tests__|test)/(?!__mocks__).*|(\\.|/)(test|spec))\\.(tsx|ts)?$",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageThreshold: {
        global: {
            lines: 80,
            statements: 80,
        },
    },
    coveragePathIgnorePatterns: [
        "src/(.*)/(.*).d.ts",
        "src/(.*).stories.tsx",
        "src/(.*)/(.*).stories.tsx",
        "node_modules/(.*)",
    ],
    testResultsProcessor: "jest-sonar-reporter",
};
