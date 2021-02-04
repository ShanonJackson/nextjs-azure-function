"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var manifest = require("../manifest.json");
var basePath = require("../routes-manifest.json");
var Stream = require("stream");
var http = require("http");
var AzureCompat = function (azContext, azReq) {
    azContext.res = azContext.res || {};
    azContext.res.headers = azContext.res.headers || {};
    var newStream = new Stream.Readable();
    var req = Object.assign(newStream, http.IncomingMessage.prototype, {
        url: azReq.url,
        pathname: "/" + azReq.url.split("/").slice(3).join("/"),
        rawHeaders: [],
        headers: azReq.headers,
        method: azReq.method,
        log: azContext.log,
        getHeader: function (name) { return req.headers[name.toLowerCase()]; },
        getHeaders: function () { return azReq.headers; },
        connection: {}
    });
    var res = new Stream();
    Object.defineProperty(res, "statusCode", {
        get: function () {
            if (!azContext.res)
                return;
            return azContext.res.status;
        },
        set: function (code) {
            if (!azContext.res)
                return;
            return (azContext.res.status = code);
        }
    });
    res.writeHead = function (status, headers) {
        if (!azContext.res)
            return;
        azContext.res.status = status;
        if (headers)
            azContext.res.headers = Object.assign(azContext.res.headers, headers);
    };
    res.headers = {};
    res.write = function (chunk) {
        if (!azContext.res)
            return;
        azContext.res.body = chunk;
    };
    res.setHeader = function (name, value) {
        if (!azContext.res)
            return;
        return (azContext.res.headers[name.toLowerCase()] = value);
    };
    res.removeHeader = function (name) {
        if (!azContext.res)
            return;
        delete azContext.res.headers[name.toLowerCase()];
    };
    res.getHeader = function (name) {
        if (!azContext.res)
            return;
        return azContext.res.headers[name.toLowerCase()];
    };
    res.getHeaders = function () {
        if (!azContext.res)
            return;
        return azContext.res.headers;
    };
    res.hasHeader = function (name) { return !!res.getHeader(name); };
    if (azReq.body)
        req.push(Buffer.from(JSON.stringify(azReq.body)), undefined);
    req.push(null);
    var promise = new Promise(function (resolve) {
        res.end = function (text) {
            if (azContext.res)
                azContext.res.body = text;
            resolve(azContext);
        };
    });
    return { req: req, res: res, promise: promise };
};
var handlerFactory = function (page) { return function (azContext, azReq) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, req, res, promise;
    return __generator(this, function (_b) {
        _a = AzureCompat(azContext, azReq), req = _a.req, res = _a.res, promise = _a.promise;
        if (page.render instanceof Function) {
            page.render(req, res);
        }
        else {
            page["default"](req, res);
        }
        return [2 /*return*/, promise];
    });
}); }; };
// end api-gw compat code
var normaliseUri = function (uri) { return (uri === "/" ? "/index" : uri); };
var router = function (manifest) {
    var _a = manifest.apis, dynamic = _a.dynamic, nonDynamic = _a.nonDynamic;
    return function (path) {
        if (basePath && path.startsWith(basePath))
            path = path.slice(basePath.length);
        if (nonDynamic[path]) {
            return nonDynamic[path];
        }
        for (var route in dynamic) {
            var _a = dynamic[route], file = _a.file, regex = _a.regex;
            var re = new RegExp(regex, "i");
            var pathMatchesRoute = re.test(path);
            if (pathMatchesRoute) {
                return file;
            }
        }
        return null;
    };
};
module.exports = function (context, req) { return __awaiter(void 0, void 0, void 0, function () {
    var uri, pagePath, page;
    return __generator(this, function (_a) {
        uri = normaliseUri("/" + req.url.split("?")[0].split("/").slice(3).join("/"));
        pagePath = router(manifest)(uri);
        if (!pagePath) {
            return [2 /*return*/, { res: { status: 404 } }];
        }
        page = require("../" + pagePath);
        return [2 /*return*/, handlerFactory(page)(context, req)];
    });
}); };
