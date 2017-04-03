const newError = require('../util/util.newError.js');
const filterAllRules = require('../util/util.filterAllRules.js');
const flattenArray = require('../util/util.flattenArray.js');

module.exports = {
    name: "perilousSelector",
    rule: (fileModule, fileModules) => {
        let rules = filterAllRules(fileModule.stylesheet.rules);
        let perilousSelectors = rules.reduce((perilousSelectors, rule) => {

            let dangerousSelectors = rule.selectors.filter(selector => {
                let isTagname = selector.match(/^\./) === null;
                let hasChevron = selector.indexOf('>') > -1;
                let isPerilous = isTagname || hasChevron;

                return isPerilous;
            }).map(selector => {
                return {
                    selector: selector,
                    position: rule.position
                };
            });

            return perilousSelectors.concat(dangerousSelectors);
        }, []);
        let errors = perilousSelectors.map(perilousSelector => newError(`perilous selector "${perilousSelector.selector}"`, perilousSelector, fileModule.filePath));
        
        return errors;
    }
};