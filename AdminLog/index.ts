import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import fs from "fs";
import { createHash } from "crypto";
import { local_cache_secret } from "../src/_config";

const confPath = `/tmp/conf/${createHash("md5")
  .update("conf.json", "utf8")
  .digest("hex")}`;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // 从完整的请求 URL 中提取路径和查询参数
    const urlObject = new URL(req.url);
    const url_data = `${urlObject.pathname}${urlObject.search}`;

    // 提取查询参数
    const queryParams = new URLSearchParams(urlObject.search);
    const secret = queryParams.get('s');

    if (secret !== local_cache_secret) {
        context.res = {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { mes: "Secret Error!" }
        };
    } else {
        let hotConf = {};

        if (!fs.existsSync("/tmp")) {
            fs.mkdirSync("/tmp");
        } else {
            if (!fs.existsSync("/tmp/conf")) {
                fs.mkdirSync("/tmp/conf");
            }
        }

        if (!fs.existsSync(confPath)) {
            fs.writeFileSync(confPath, "{}");
        }

        hotConf = await JSON.parse(fs.readFileSync(confPath).toString() || "{}");

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: hotConf
        };
    }
};

export default httpTrigger;