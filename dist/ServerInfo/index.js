var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 使用基本的模块导出格式 - 这是唯一在Azure Functions v4中工作的方式
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('ServerInfo: Starting with Bilibili API call');
        try {
            const api = "https://api.bilibili.com";
            context.log('ServerInfo: About to fetch from Bilibili API');
            const response = yield fetch(api + "/x/web-interface/zone", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                }
            });
            context.log('ServerInfo: Fetch completed, status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonResponse = yield response.json();
            context.log('ServerInfo: JSON parsed successfully');
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonResponse)
            };
            context.log('ServerInfo: Response set successfully');
        }
        catch (error) {
            context.log('ServerInfo: Error occurred:', error);
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Internal server error',
                    details: error instanceof Error ? error.message : String(error)
                })
            };
        }
    });
};
//# sourceMappingURL=index.js.map