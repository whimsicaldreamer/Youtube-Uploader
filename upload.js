const fs                = require("fs");
const fsp               = fs.promises;
const readline          = require("readline");
const { promisify }     = require("util");
const path              = require("path");
const cliProgress       = require("cli-progress");
const { google }        = require("googleapis");
const OAuth2            = google.auth.OAuth2;
const TOKEN_PATH        = "token.json";
const SCOPES            = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"];

readline.Interface.prototype.question[promisify.custom] = function(prompt) {
    return new Promise(resolve =>
        readline.Interface.prototype.question.call(this, prompt, resolve),
    );
};
readline.Interface.prototype.questionAsync = promisify(
    readline.Interface.prototype.question,
);

const getFileName = (filePath) => {
    return path.parse(filePath).name;
};

const getCredentials = async () => {
    try {
        // Load client secrets from a local file.
        const content = await fsp.readFile("credentials.json");
        return JSON.parse(content);
    }
    catch(error) {
        console.log(`Error loading client secret file: ${ error }`);
    }
};

const authorize = async () => {
    const credentials = await getCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    let token = await readAccessToken();

    if(!token) {
        const { tokens } = await getAccessToken(oAuth2Client);
        token = tokens;
        await writeAccessToken(token);
    }

    oAuth2Client.setCredentials(token);

    return oAuth2Client;
};

const readAccessToken = async () => {
    try {
        const token = await fsp.readFile(TOKEN_PATH);
        return JSON.parse(token);
    }
    catch(error) {
        return false;
    }
};

const writeAccessToken = async (token) => {
    try {
        // Store the token to disk for later program executions
        await fsp.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log(`Token stored to ${ TOKEN_PATH }`);
    }
    catch (error) {
        return console.log(error);
    }
};

const getAccessToken = async (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });

    console.log(`Authorize this app by visiting this url: ${ authUrl }`);

    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code  = await r1.questionAsync("Enter the code from that page here: ");
    r1.close();

    try {
        return await oAuth2Client.getToken(code);
    }
    catch (error) {
        return console.log(`Error retrieving access token: ${ error }`);
    }
};

const upload = async (filePath) => {
    const auth = await authorize();

    const file = filePath; // File location
    const fileSize = fs.statSync(file).size;
    const title = getFileName(filePath); // Filename becomes title
    const category = "27"; // 'Education' category
    const privacy = "private"; // unlisted video setting

    // Initialize youtube API
    const youtube = google.youtube({ version: "v3", auth });

    console.log(`Uploading: ${ title }`);
    const progressBar = new cliProgress.SingleBar({
        format: "|{bar}| {percentage}% uploaded",
        hideCursor: true,
        stopOnComplete: true,
    }, cliProgress.Presets.shades_grey);
    progressBar.start(100, 0);

    const res = await youtube.videos.insert(
        {
            part: "id,snippet,status",
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    title: title,
                    description: "",
                    categoryId: category,
                },
                status: {
                    privacyStatus: privacy,
                    selfDeclaredMadeForKids: true,
                },
            },
            media: {
                body: fs.createReadStream(file),
            },
        },
        {
            onUploadProgress: evt => {
                const progress = (evt.bytesRead / fileSize) * 100;
                progressBar.update(progress);
            },
        }
    );

    return({ uploadStatus: res.data.status.uploadStatus, file: res.data.snippet.title, urlID: res.data.id });
};

module.exports = upload;