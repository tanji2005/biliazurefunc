import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as _blacklist from "../src/utils/_blacklist";
import { logger } from "../src/_config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // 获取动态路由参数
    const uid = context.bindingData.uid;
    
    logger
        .child({ action: "获取黑/白名单", method: req.method, url: req.url })
        .info({ uid: uid });

    // 调用黑名单检查功能（恢复原始功能）
    const result = await _blacklist.main(Number(uid));
    
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: result
    };
};

export default httpTrigger;