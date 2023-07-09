"use strict";
/**
 * This is a script to refresh the mock return data for tests.
 */
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.questionIds = void 0;
var fs = require("fs");
var https = require("https");
var path = require("path");
var toml = require("toml");
exports.questionIds = [8486];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var codaToken;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codaToken = readCodaToken();
                    return [4 /*yield*/, Promise.all(exports.questionIds.map(function (questionId) { return __awaiter(_this, void 0, void 0, function () {
                            var data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getData(questionId, codaToken)];
                                    case 1:
                                        data = _a.sent();
                                        return [4 /*yield*/, writeFile(questionId, data)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var getData = function (questionId, codaToken) { return __awaiter(void 0, void 0, void 0, function () {
    var options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    hostname: 'coda.io',
                    port: 443,
                    path: "/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%22".concat(questionId, "%22"),
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer ".concat(codaToken)
                    }
                };
                return [4 /*yield*/, httpGet(options)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var httpGet = function (options) {
    return new Promise(function (resolve, reject) {
        var req = https.request(options, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                resolve(data);
            });
        });
        req.on('error', function (error) {
            reject(error);
        });
        req.end();
    });
};
var writeFile = function (questionId, data) {
    var filename = "question-".concat(questionId, ".json");
    var filePath = path.join(__dirname, filename);
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, function (err) {
            if (err) {
                console.error('An error occurred:', err);
                reject(err);
            }
            else {
                console.log('File has been written successfully.');
                resolve();
            }
        });
    });
};
var readCodaToken = function () {
    var wranglerToml = fs.readFileSync('wrangler.toml', 'utf8');
    var config = toml.parse(wranglerToml);
    var codaToken = config.vars.CODA_TOKEN;
    return codaToken;
};
main();
