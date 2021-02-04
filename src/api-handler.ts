/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HttpRequest, Context } from "@azure/functions";
const manifest = require("../manifest.json");
const basePath = require("../routes-manifest.json");
const Stream = require("stream");
const http = require("http");

const AzureCompat = (azContext: Context, azReq: HttpRequest) => {
	azContext.res = azContext.res || {};
	azContext.res.headers = azContext.res.headers || {};
	const newStream = new Stream.Readable();
	const req = Object.assign(newStream, http.IncomingMessage.prototype, {
		url: azReq.url,
		pathname: "/" + azReq.url.split("/").slice(3).join("/"),
		rawHeaders: [],
		headers: azReq.headers,
		method: azReq.method,
		log: azContext.log,
		getHeader: (name: string) => req.headers[name.toLowerCase()],
		getHeaders: () => azReq.headers,
		connection: {},
	});

	const res = new Stream();
	Object.defineProperty(res, "statusCode", {
		get() {
			if (!azContext.res) return;
			return azContext.res.status;
		},
		set(code) {
			if (!azContext.res) return;
			return (azContext.res.status = code);
		},
	});
	res.writeHead = (status: string, headers: any) => {
		if (!azContext.res) return;
		azContext.res.status = status;
		if (headers) azContext.res.headers = Object.assign(azContext.res.headers, headers);
	};
	res.headers = {};
	res.write = (chunk: any) => {
		if (!azContext.res) return;
		azContext.res.body = chunk;
	};
	res.setHeader = (name: string, value: string) => {
		if (!azContext.res) return;
		return (azContext.res.headers[name.toLowerCase()] = value);
	};
	res.removeHeader = (name: string) => {
		if (!azContext.res) return;
		delete azContext.res.headers[name.toLowerCase()];
	};
	res.getHeader = (name: string) => {
		if (!azContext.res) return;
		return azContext.res.headers[name.toLowerCase()];
	};
	res.getHeaders = () => {
		if (!azContext.res) return;
		return azContext.res.headers;
	};
	res.hasHeader = (name: string) => !!res.getHeader(name);
	if (azReq.body) req.push(Buffer.from(JSON.stringify(azReq.body)), undefined);
	req.push(null);
	const promise = new Promise(function (resolve) {
		res.end = (text: any) => {
			if (azContext.res) azContext.res.body = text;
			resolve(azContext);
		};
	});
	return { req: req, res: res, promise: promise };
};

const handlerFactory = (page: any) => async (azContext: Context, azReq: HttpRequest) => {
	const { req, res, promise } = AzureCompat(azContext, azReq);
	if (page.render instanceof Function) {
		page.render(req, res);
	} else {
		page.default(req, res);
	}
	return promise;
};
// end api-gw compat code

const normaliseUri = (uri: string): string => (uri === "/" ? "/index" : uri);

const router = (manifest: any): ((path: string) => string | null) => {
	const {
		apis: { dynamic, nonDynamic },
	} = manifest;
	return (path: string): string | null => {
		if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);
		if (nonDynamic[path]) {
			return nonDynamic[path];
		}
		for (const route in dynamic) {
			const { file, regex } = dynamic[route];
			const re = new RegExp(regex, "i");
			const pathMatchesRoute = re.test(path);

			if (pathMatchesRoute) {
				return file;
			}
		}
		return null;
	};
};

module.exports = async (context: Context, req: HttpRequest) => {
	const uri = normaliseUri("/" + req.url.split("?")[0].split("/").slice(3).join("/"));
	const pagePath = router(manifest)(uri);
	if (!pagePath) {
		return { res: { status: 404 } };
	}
	// eslint-disable-next-line
	const page = require(`../${pagePath}`);
	return handlerFactory(page)(context, req);
};
