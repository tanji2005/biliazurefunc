import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const api = "https://api.bilibili.com";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('ServerInfo: HTTP trigger function processed a request.');

    try {
        context.log('ServerInfo: About to fetch from bilibili API');
        
        // 简化的fetch配置
        const response = await fetch(api + "/x/web-interface/zone", {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
            }
        });
        
        context.log('ServerInfo: Fetch completed, status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        context.log('ServerInfo: JSON parsed successfully');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonResponse)
        };
    } catch (error) {
        context.log('ServerInfo: Error occurred:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};

export default httpTrigger;