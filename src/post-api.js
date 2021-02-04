/* eslint-disable */
const fs = require("fs");

/* move directory into ./api */
fs.renameSync("./.serverless_nextjs/api-lambda", "./api");

/* create azure function configuration file. */
fs.mkdirSync("./api/function");
fs.writeFileSync(
	"./api/function/function.json",
	JSON.stringify(
		{
			bindings: [
				{
					authLevel: "anonymous",
					type: "httpTrigger",
					direction: "in",
					name: "req",
					methods: ["get", "post", "put", "options", "delete"],
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
fs.renameSync("./api/index.js", "./api/function/function.js");