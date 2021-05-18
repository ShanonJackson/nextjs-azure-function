/* eslint-disable */
const fs = require("fs");
const path = require("path");
/* move directory into ./api */


const join  = (str) => path.join(process.cwd(), str);
fs.renameSync(join("./.serverless_nextjs/api-lambda"), join("./api"));

/* create azure function configuration file. */
fs.mkdirSync(join("./api/function"));
fs.writeFileSync(
	join("./api/function/function.json"),
	JSON.stringify(
		{
			bindings: [
				{
					authLevel: "anonymous",
					type: "httpTrigger",
					direction: "in",
					name: "req",
					methods: ["get", "post", "put", "options", "delete", "patch"],
					route: "{*all}",
				},
				{
					type: "http",
					direction: "out",
					name: "res",
				},
			],
		},
		null,
		4,
	),
	"utf8",
);
fs.renameSync(join("./api/index.js"), join("./api/function/function.js"));