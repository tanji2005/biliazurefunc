import { IncomingHttpHeaders } from "http";

/**
 * 将Azure Functions v4的Headers对象转换为Node.js的IncomingHttpHeaders格式
 * 用于与现有核心逻辑保持兼容性
 */
export function convertHeaders(azureHeaders: any): IncomingHttpHeaders {
    const headers: IncomingHttpHeaders = {};
    // 使用任意类型避免Headers类型冲突
    azureHeaders.forEach((value: string, key: string) => {
        headers[key.toLowerCase()] = value;
    });
    return headers;
}