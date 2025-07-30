import * as _blacklist from "../src/utils/_blacklist";
import { logger } from "../src/_config";

module.exports = async function (context: any, req: any) {
    context.log('Users: Starting');

    try {
        // Azure Functions v4中从URL路径中提取动态参数
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/');
        const uid = pathSegments[pathSegments.length - 1]; // 获取路径最后一段作为uid
        
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
            body: JSON.stringify(result)
        };
    } catch (error) {
        context.log('Users: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};