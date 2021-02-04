// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Builder } from "@sls-next/lambda-at-edge";
import { join } from "path";
import { copy } from "fs-extra";
import { API_LAMBDA_CODE_DIR } from "@sls-next/lambda-at-edge/dist/build";

const main = async () => {
    const nextConfigPath = process.cwd();

    const builder = new Builder(
        process.cwd(),
        join(nextConfigPath, ".serverless_nextjs"),
        {
            cmd: "node_modules/.bin/next",
            args: ["build"],
            useServerlessTraceTarget: true,
        }
    );

    await builder.build(true);

    await copy(
        require.resolve("./api-handler.js"),
        join(builder.outputDir, API_LAMBDA_CODE_DIR, "index.js")
    );
}

main();

export default "module";
