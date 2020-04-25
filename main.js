const {
    getFiles,
    writeLogFile
}                       = require("./files");
const upload            = require("./upload");

const folderPath        = "../../demo";
const logPath           = `./logs/log-${ Date.now() }`;

const main = async () => {
    const allFiles = await getFiles(folderPath);
    const totalFiles = allFiles.length;

    if(totalFiles > 0) {
        console.log(`${totalFiles} files to be uploaded.`);
        for(let file of allFiles) {
            try {
                const res = await upload(file);
                await writeLogFile(logPath, res);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    else {
        console.log("No Files to upload!");
    }
};

main()
.catch(error => {
    console.log(error);
});