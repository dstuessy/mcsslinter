const flattenArray = require('../util/util.flattenArray.js');

module.exports = [
    {
        name: "duplicateDeclaration",
        rule: (fileModule, fileModules) => {
            let rules = fileModule.stylesheet.rules.filter(rule => rule.type === "rule");
            let erroneousDeclarations = rules.map(rule => {
                let declarationProperties = rule.declarations.map(declaration => declaration.property);

                return rule.declarations.filter(declaration => {
                    let matchingProperties = declarationProperties.filter(declarationProperty => declarationProperty === declaration.property);
                    let isDuplicate = matchingProperties.length > 1;

                    return isDuplicate;
                });
            });
            let flattenedErroneousDeclarations = flattenArray(erroneousDeclarations);
            let errors = flattenedErroneousDeclarations.map(erroneousDeclaration => {
                return {
                    message: "duplicate property",
                    position: erroneousDeclaration.position
                };
            });
            
            return errors;
        }
    }
];