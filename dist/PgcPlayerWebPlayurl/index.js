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
const data_parse = __importStar(require("../src/utils/player-data-handler/web"));
const httpTrigger = (request, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log('HTTP trigger function processed a request.');
    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(request.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        let PassWebOnCheck = 0; // 当检测到请求来自B站时不受web_on开关影响
        // Get header values using Azure Functions v4 Headers API
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        const cookieHeader = request.headers.get('cookie');
        // Set CORS headers
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        };
        if ((origin && new RegExp("^https?://([a-z]+.bilibili.com|bilibili.com)$", "g").test(origin)) ||
            (env.pass_web_on_check && referer === "https://www.bilibili.com")) {
            headers['Access-Control-Allow-Origin'] = origin;
            PassWebOnCheck = 1;
        }
        // Extract cookies from headers (Azure Functions doesn't have req.cookies like Next.js)
        const cookies = {};
        if (cookieHeader) {
            cookieHeader.split(';').forEach(cookie => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    cookies[key] = value;
                }
            });
        }
        const continue_execute = yield data_parse.middleware(url_data, cookies, PassWebOnCheck, request.method);
        if (continue_execute[0] == false) {
            return {
                status: 200,
                headers: Object.assign(Object.assign({}, headers), { 'Cache-Control': 'max-age=30, s-maxage=30, stale-while-revalidate=30', 'CDN-Cache-Control': 'max-age=30', 'Cloudflare-CDN-Cache-Control': 'max-age=30', 'Vercel-CDN-Cache-Control': 'max-age=30' }),
                body: JSON.stringify(env.block(continue_execute[1], continue_execute[2] || ""))
            };
        }
        else {
            const result = yield data_parse.main(url_data, cookies, continue_execute[2]);
            return {
                status: 200,
                headers: Object.assign(Object.assign({}, headers), { 'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=3600', 'CDN-Cache-Control': 'max-age=3600', 'Cloudflare-CDN-Cache-Control': 'max-age=3600', 'Vercel-CDN-Cache-Control': 'max-age=3600' }),
                body: JSON.stringify(result)
            };
        }
    }
    catch (error) {
        context.log('Error:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
});
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map