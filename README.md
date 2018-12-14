Steps to run this:
1. npm install
2. npm run downloadAntlr
3. npm run buildGrammar
4. npm run test

downloadAntlr will download the antlr binary, Java is required so buildGrammar will only work if Java is in PATH.

buildGrammar then creates the JS parser and lexer files that are needed to parse documents.

The tests contain some samples to validate text input for .items file from openhab.