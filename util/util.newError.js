module.exports = function(message, declaration, filePath) {
    return {
        type: 'error',
        message: message,
        position: declaration.position,
        filePath: filePath
    };
};