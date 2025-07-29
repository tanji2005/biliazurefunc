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
const appHandler = __importStar(require("../src/utils/player-data-handler/app"));
const env = __importStar(require("../src/_config"));
const _headers_1 = require("../src/utils/_headers");
const httpTrigger = (request, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log('HTTP trigger function processed a request.');
    // 从完整的请求 URL 中提取路径和查询参数
    const urlObject = new URL(request.url);
    const url_data = `${urlObject.pathname}${urlObject.search}`;
    // 2. 调用 middleware 进行前置检查
    const continue_execute = yield appHandler.middleware(url_data, (0, _headers_1.convertHeaders)(request.headers), // Convert Azure v4 Headers to IncomingHttpHeaders
    request.method);
    // 3. 根据 middleware 的结果决定下一步
    if (continue_execute[0] === false) {
        // 检查不通过，返回错误信息
        return {
            status: 412, // Precondition Failed
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=30, s-maxage=30'
            },
            body: JSON.stringify(env.block(continue_execute[1], continue_execute[2] || ""))
        };
    }
    else {
        // 检查通过，调用 main 函数获取数据
        const result = yield appHandler.main(url_data, JSON.parse(continue_execute[2]) // middleware 会返回用户信息的 JSON 字符串
        );
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=3600, s-maxage=3600'
            },
            body: JSON.stringify(result)
        };
    }
});
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map