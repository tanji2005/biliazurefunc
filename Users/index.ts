import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as _blacklist from "../src/utils/_blacklist";
import { logger } from "../src/_config";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    // Azure Functions v4中从URL路径中提取动态参数
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const uid = pathSegments[pathSegments.length - 1]; // 获取路径最后一段作为uid
    
    logger
        .child({ action: "获取黑/白名单", method: request.method, url: request.url })
        .info({ uid: uid });

    // 调用黑名单检查功能（恢复原始功能）
    const result = await _blacklist.main(Number(uid));
    
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    };
};

export default httpTrigger;