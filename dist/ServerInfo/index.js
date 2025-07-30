var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 使用最基本的模块导出，不依赖特定类型
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('ServerInfo: Starting with basic module.exports');
        try {
            context.log('ServerInfo: Creating basic response');
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'ServerInfo basic response',
                    timestamp: new Date().toISOString(),
                    method: (req === null || req === void 0 ? void 0 : req.method) || 'unknown',
                    url: (req === null || req === void 0 ? void 0 : req.url) || 'unknown'
                })
            };
            context.log('ServerInfo: Response created successfully');
        }
        catch (error) {
            context.log('ServerInfo: Error occurred:', error);
            context.res = {
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
};
//# sourceMappingURL=index.js.map