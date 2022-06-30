const fs = require('fs');

function removeFile(filePath) {
    fs.unlink(filePath, (err) => {
        return new Error(err);
    });
}

module.exports = {
    removeFile
};