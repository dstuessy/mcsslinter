module.exports = function (arr) {
    return arr.reduce((flattened, item) => {
        if (Array.isArray(item)) {
            return flattened.concat(item);
        } else {
            return flattened.concat([item]);
        }
    }, []);
};