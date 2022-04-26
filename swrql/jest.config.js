module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
    moduleNameMapper: {
        "^csv-parse/sync":
          "<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs"
      }
};
