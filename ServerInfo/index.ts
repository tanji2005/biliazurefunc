// 使用最基本的模块导出，不依赖特定类型
module.exports = async function (context: any, req: any) {
    context.log('ServerInfo: Starting with basic module.exports');

    try {
        context.log('ServerInfo: Creating basic response');
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: 'ServerInfo basic response',
                timestamp: new Date().toISOString(),
                method: req?.method || 'unknown',
                url: req?.url || 'unknown'
            })
        };
        
        context.log('ServerInfo: Response created successfully');
    } catch (error) {
        context.log('ServerInfo: Error occurred:', error);
        context.res = {
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