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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
const _config_1 = require("../src/_config");
const confPath = `/tmp/conf/${(0, crypto_1.createHash)("md5")
    .update("conf.json", "utf8")
    .digest("hex")}`;
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('AdminLog: Starting');
        try {
            // 从完整的请求 URL 中提取路径和查询参数
            const urlObject = new URL(req.url);
            const url_data = `${urlObject.pathname}${urlObject.search}`;
            // 提取查询参数
            const queryParams = new URLSearchParams(urlObject.search);
            const secret = queryParams.get('s');
            if (secret !== _config_1.local_cache_secret) {
                context.res = {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mes: "Secret Error!" })
                };
            }
            else {
                let hotConf = {};
                if (!fs_1.default.existsSync("/tmp")) {
                    fs_1.default.mkdirSync("/tmp");
                }
                else {
                    if (!fs_1.default.existsSync("/tmp/conf")) {
                        fs_1.default.mkdirSync("/tmp/conf");
                    }
                }
                if (!fs_1.default.existsSync(confPath)) {
                    fs_1.default.writeFileSync(confPath, "{}");
                }
                hotConf = yield JSON.parse(fs_1.default.readFileSync(confPath).toString() || "{}");
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(hotConf)
                };
            }
        }
        catch (error) {
            context.log('AdminLog: Error:', error);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error', details: String(error) })
            };
        }
    });
};
//# sourceMappingURL=index.js.map