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
const sstore_1 = __importDefault(require("@beetcb/sstore"));
const _config_1 = require("../src/_config");
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('AdminClean: Starting');
        try {
            // 提取查询参数
            const urlObject = new URL(req.url);
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
                sstore_1.default.clear();
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mes: "Clean All Cache and Logs! Done!" })
                };
            }
        }
        catch (error) {
            context.log('AdminClean: Error:', error);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error', details: String(error) })
            };
        }
    });
};
//# sourceMappingURL=index.js.map