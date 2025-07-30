import * as env from "../src/_config";
import * as data_parse from "../src/utils/player-data-handler/web";

module.exports = async function (context: any, req: any) {
    context.log('PgcPlayerWebPlayurl: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api', '');
        const url_data = `${mappedPath}${urlObject.search}`;
        
        let PassWebOnCheck: 0 | 1 = 0; // 当检测到请求来自B站时不受web_on开关影响
        
        // Get header values - req.headers is a plain object in traditional Azure Functions
        const origin = req.headers.origin;
        const referer = req.headers.referer;
        const cookieHeader = req.headers.cookie;
        
        // Set CORS headers
        const headers: any = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        };

        if (
            (origin && new RegExp("^https?://([a-z]+.bilibili.com|bilibili.com)$", "g").test(origin)) ||
            (env.pass_web_on_check && referer === "https://www.bilibili.com")
        ) {
            headers['Access-Control-Allow-Origin'] = origin;
            PassWebOnCheck = 1;
        }

        // Extract cookies from headers (Azure Functions doesn't have req.cookies like Next.js)
        const cookies = {};
        if (cookieHeader) {
            cookieHeader.split(';').forEach(cookie => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    cookies[key] = value;
                }
            });
        }

        const continue_execute = await data_parse.middleware(
            url_data,
            cookies,
            PassWebOnCheck,
            req.method
        );

        if (continue_execute[0] == false) {
            context.res = {
                status: 200,
                headers: {
                    ...headers,
                    'Cache-Control': 'max-age=30, s-maxage=30, stale-while-revalidate=30',
                    'CDN-Cache-Control': 'max-age=30',
                    'Cloudflare-CDN-Cache-Control': 'max-age=30',
                    'Vercel-CDN-Cache-Control': 'max-age=30'
                },
                body: JSON.stringify(env.block(continue_execute[1], continue_execute[2] || ""))
            };
        } else {
            const result = await data_parse.main(
                url_data,
                cookies,
                continue_execute[2] as {
                    uid: number;
                    vip_type: 0 | 1 | 2;
                }
            );

            context.res = {
                status: 200,
                headers: {
                    ...headers,
                    'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
                    'CDN-Cache-Control': 'max-age=3600',
                    'Cloudflare-CDN-Cache-Control': 'max-age=3600',
                    'Vercel-CDN-Cache-Control': 'max-age=3600'
                },
                body: JSON.stringify(result)
            };
        }
    } catch (error) {
        context.log('PgcPlayerWebPlayurl: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};