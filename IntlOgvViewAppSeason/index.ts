import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as env from "../src/_config";

const api = env.api.intl.season_info;

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(request.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(api + url_data, {
            method: request.method,
        });

        const jsonResponse: {
            code: number;
            result: {
                modules: {
                    episodes: {
                        subtitles: {
                            id: number;
                            is_machine: boolean;
                            key: string;
                            title: string;
                            url: string;
                        }[];
                    }[];
                }[];
            };
        } = await response.json();

        if (jsonResponse.code === 0 && env.th_subtitle_api) {
            let m_res = jsonResponse;
            if (m_res.result?.modules[0]?.episodes) {
                const episodes = m_res.result?.modules[0]?.episodes;
                for (const ep of episodes) {
                    // Processing logic can be added here if needed
                }
            }
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(m_res)
            };
        } else {
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonResponse)
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