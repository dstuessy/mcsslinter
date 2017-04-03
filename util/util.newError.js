module.exports = function(message, declaration, filePath) {
    return {
        message: message,
        position: declaration.position,
        filePath: filePath
    };
};