const fs = require('fs');
const css = require('css');

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

    function lintCss(fileModules) {
        console.log();
    }

    Linter.lint = function (dirPath) {
        let filePaths = getFilePaths(dirPath);
        let fileModules = filePaths.map(filePath => {
            return {
                filePath: filePath,
                rules: getFileContent(filePath)
            };
        });

        lintCss(fileModules);
    };

    return Linter;
} ());