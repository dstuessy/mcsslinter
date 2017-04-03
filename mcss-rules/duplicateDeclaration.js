const newError = require('../util/util.newError.js');
const filterAllRules = require('../util/util.filterAllRules.js');
const flattenArray = require('../util/util.flattenArray.js');

module.exports = {
    name: "duplicateDeclaration",
    rule: (fileModule, fileModules) => {
        let rules = filterAllRules(fileModule.stylesheet.rules);
        let erroneousDeclarations = rules.map(rule => {

            return rule.declarations.filter(declaration => {
                let matchingProperties = rule.declarations.filter(a => a.property === declaration.property);
                let isDuplicate = matchingProperties.length > 1;

                return isDuplicate;
            });
        });
        let flattenedErroneousDeclarations = flattenArray(erroneousDeclarations);
        let errors = flattenedErroneousDeclarations.map(erroneousDeclaration => newError(`duplicate property "${erroneousDeclaration.property}"`, erroneousDeclaration, fileModule.filePath));
        
        return errors;
    }
};