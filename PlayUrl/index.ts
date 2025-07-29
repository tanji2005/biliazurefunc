import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as appHandler from "../src/utils/player-data-handler/app";
import * as env from "../src/_config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // 从完整的请求 URL 中提取路径和查询参数
    const urlObject = new URL(req.url);
    const url_data = `${urlObject.pathname}${urlObject.search}`;

    // 2. 调用 middleware 进行前置检查
    const continue_execute = await appHandler.middleware(
        url_data,
        req.headers, // Azure 的 headers 对象格式与 Node 的 IncomingHttpHeaders 兼容
        req.method
    );

    // 3. 根据 middleware 的结果决定下一步
    if (continue_execute[0] === false) {
        // 检查不通过，返回错误信息
        context.res = {
            status: 412, // Precondition Failed
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=30, s-maxage=30'
            },
            body: env.block(continue_execute[1], continue_execute[2] || "")
        };
    } else {
        // 检查通过，调用 main 函数获取数据
        const result = await appHandler.main(
            url_data,
            JSON.parse(continue_execute[2]) // middleware 会返回用户信息的 JSON 字符串
        );

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=3600, s-maxage=3600'
            },
            body: result
        };
    }
};

export default httpTrigger;