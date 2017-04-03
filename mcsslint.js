const fs = require('fs');
const css = require('css');
const flattenArray = require('./util/util.flattenArray.js');

const mcssRules = require('./mcss-rules/mcss-rules.js');

module.exports = (function () {

    const Linter = {};

    function isUnique(filePath, i, list) {
        return list.indexOf(filePath) === i;
    }

    function getFilePaths(dirPath) {
        let entryNames = fs.readdirSync(dirPath);
        let entryPaths = entryNames.map(entryName => `${dirPath}/${entryName}`);
        let filePaths = entryPaths.filter(entryPath => /\.css$/.test(entryPath));
        let dirPaths = entryPaths.filter(entryPath => fs.lstatSync(entryPath).isDirectory());
        let leftoverFilePaths = dirPaths.reduce(
            (filePaths, dirPath) => filePaths.concat(getFilePaths(dirPath)),
            filePaths
        );

        return filePaths
            .concat(leftoverFilePaths)
            .filter(isUnique);
    }

    function getFileContent(filePath) {
        return fs.readFileSync(filePath).toString();
    }

    function lintCss(fileModule, fileModules, mcssRules) {
        return mcssRules.reduce((results, mcssRule) => {
            let ruleFn = mcssRule.rule;
            return results.concat(ruleFn(fileModule, fileModules));
        }, []);
    }

    Linter.lint = function (dirPath) {
        let filePaths = getFilePaths(dirPath);
        let fileModules = filePaths.map(filePath => {
            let fileContent = getFileContent(filePath);
            let parsedFileContent = css.parse(fileContent);

            return {
                filePath: filePath,
                stylesheet: parsedFileContent.stylesheet
            };
        });
        let lintingResults = fileModules.map(fileModule => lintCss(fileModule, fileModules, mcssRules));
        let flattenedLintingResults = flattenArray(lintingResults);

        return flattenedLintingResults;
    };

    Linter.log = function (errors, output) {
        errors.forEach(output || function (error) {
            console.log(`${error.message}\n\tin line ${error.position.start.line} and column ${error.position.start.column} of file ${error.filePath}\n`);
        });
    };

    return Linter;
} ());