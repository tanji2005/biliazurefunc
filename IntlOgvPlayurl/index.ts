import * as env from "../src/_config";

module.exports = async function (context: any, req: any) {
    context.log('IntlOgvPlayurl: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/legacy/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api/legacy', '');
        const url_data = `${mappedPath}${urlObject.search}`;
        
        const response = await fetch(env.api.intl.playurl + url_data, {
            method: req.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const textResponse = await response.text();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textResponse
        };
    } catch (error) {
        context.log('IntlOgvPlayurl: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};