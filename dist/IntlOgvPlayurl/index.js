"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = __importStar(require("../src/_config"));
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('IntlOgvPlayurl: Starting');
        try {
            // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
            const urlObject = new URL(req.url);
            // 将 /api/[path] 映射为 /[path]
            const mappedPath = urlObject.pathname.replace('/api', '');
            const url_data = `${mappedPath}${urlObject.search}`;
            const response = yield fetch(env.api.intl.playurl + url_data, {
                method: req.method,
                headers: {
                    "User-Agent": env.UA,
                },
            });
            const textResponse = yield response.text();
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: textResponse
            };
        }
        catch (error) {
            context.log('IntlOgvPlayurl: Error:', error);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error', details: String(error) })
            };
        }
    });
};
//# sourceMappingURL=index.js.map