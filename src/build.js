#!/usr/bin/env node
const { exec } = require("child_process");
(async () => {
    const execute = (command) => {
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                resolve(true);
            });
        });
    };
    console.log("Build in progress...");
    await execute("node ./node_modules/nextjs-azure-function/src/index.js && node ./node_modules/nextjs-azure-function/src/post-api.js")
})()
