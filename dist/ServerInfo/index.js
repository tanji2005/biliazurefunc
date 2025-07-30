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
Object.defineProperty(exports, "__esModule", { value: true });
const httpTrigger = (request, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log('ServerInfo: Starting function execution');
    try {
        // 最简单的测试 - 只返回固定数据
        context.log('ServerInfo: About to return test response');
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'ServerInfo test response',
                timestamp: new Date().toISOString(),
                method: request.method,
                url: request.url
            })
        };
    }
    catch (error) {
        context.log('ServerInfo: Error in try-catch:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Function error',
                details: String(error)
            })
        };
    }
});
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map