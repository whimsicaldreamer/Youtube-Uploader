const recursive = require("recursive-readdir");
const fs        = require("fs");
const path      = require("path");

const getFiles = async (filePath) => {
    const pathToCheck = path.resolve(filePath);

    try {
        const fileList = await recursive(pathToCheck);
        return await fileList.filter(filePath => path.extname(filePath) === ".mp4");
    }
    catch (error) {
        console.log(`Failed to traverse directories: ${ error }`);
    }
};

const removeFile = (filePath) => {
    const pathToDelete = path.resolve(filePath);

    fs.unlink(pathToDelete, (error) => {
        if(error) return console.log(`Failed to delete file: ${ error }`);

        console.log(path.basename(pathToDelete) + " deleted...");
    });
};

const writeLogFile = async (path, contents) => {
    const { uploadStatus, file, urlID } = contents;
    const log = fs.createWriteStream(path, { flags: "a" });
    log.write(`${ file } - https://youtu.be/${ urlID } - ${ uploadStatus }\n`);
    log.end();
};

module.exports = { getFiles, removeFile, writeLogFile };