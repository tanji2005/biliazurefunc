"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHeaders = convertHeaders;
/**
 * 将Azure Functions v4的Headers对象转换为Node.js的IncomingHttpHeaders格式
 * 用于与现有核心逻辑保持兼容性
 */
function convertHeaders(azureHeaders) {
    const headers = {};
    // 使用任意类型避免Headers类型冲突
    azureHeaders.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });
    return headers;
}
//# sourceMappingURL=_headers.js.map