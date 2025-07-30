import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('ServerInfo: Starting function execution');

    try {
        // 最简单的测试 - 只返回固定数据
        context.log('ServerInfo: About to return test response');
        
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: 'ServerInfo test response',
                timestamp: new Date().toISOString(),
                method: request.method,
                url: request.url
            })
        };
    } catch (error) {
        context.log('ServerInfo: Error in try-catch:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: 'Function error',
                details: String(error)
            })
        };
    }
};

export default httpTrigger;