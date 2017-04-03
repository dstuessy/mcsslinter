const flattenArray = require('./util.flattenArray.js');

module.exports = function findRules (rules) {
    let firstRules = rules.filter(rule => rule.type === 'rule');
    let mediaQueries = rules.filter(rule => rule.type === 'media');
    let nestedRules = flattenArray(mediaQueries.map(mediaQuery => findRules(mediaQuery.rules)));

    return firstRules.concat(nestedRules);
};