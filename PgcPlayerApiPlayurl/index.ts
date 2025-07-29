import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as env from "../src/_config";
import * as data_parse from "../src/utils/player-data-handler/app";
import { convertHeaders } from "../src/utils/_headers";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(request.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;

        const continue_execute = await data_parse.middleware(
            url_data,
            convertHeaders(request.headers),
            request.method
        );

        if (continue_execute[0] == false) {
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
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
                JSON.parse(continue_execute[2])
            );

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
                    'CDN-Cache-Control': 'max-age=3600',
                    'Cloudflare-CDN-Cache-Control': 'max-age=3600',
                    'Vercel-CDN-Cache-Control': 'max-age=3600'
                },
                body: JSON.stringify(result)
            };
        }
    } catch (error) {
        context.log('Error:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

export default httpTrigger;