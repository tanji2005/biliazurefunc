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
const _config_1 = require("../src/_config");
const api = "https://api.bilibili.com";
const httpTrigger = (request, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log('HTTP trigger function processed a request.');
    _config_1.logger
        .child({ action: "获取服务器IP", method: request.method, url: request.url })
        .info({});
    try {
        const response = yield fetch(api + "/x/web-interface/zone", _config_1.fetch_config_UA);
        const jsonResponse = yield response.json();
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonResponse)
        };
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