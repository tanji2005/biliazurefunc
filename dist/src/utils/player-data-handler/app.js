"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.middleware = void 0;
const qs_1 = __importDefault(require("qs"));
const env = __importStar(require("../../_config"));
const blacklist = __importStar(require("../_blacklist"));
const bili = __importStar(require("../_bili"));
const playerUtil = __importStar(require("../_player"));
const fetchDataFromBiliAndCache = (url_data) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("从BiliBili获取数据", "尝试中");
    try {
        const response = yield fetch(env.api.main.app.playurl + url_data, env.fetch_config_UA);
        // 检查响应状态
        if (!response.ok) {
            console.log("Bilibili API响应错误:", response.status, response.statusText);
            return { code: -1, message: `HTTP ${response.status}: ${response.statusText}` };
        }
        // 检查内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.log("Bilibili API返回非JSON内容:", contentType);
            const text = yield response.text();
            console.log("Response text:", text.substring(0, 200));
            return { code: -1, message: "API返回了非JSON响应" };
        }
        const res = yield response.json();
        if (res.code === 0)
            yield playerUtil.addNewCache(url_data, res);
        // else console.log("从BiliBili获取数据错误", res);
        return env.try_unblock_CDN_speed_enabled
            ? JSON.parse(JSON.stringify(res).replace(/bw=[^&]*/g, "bw=1280000"))
            : res; //尝试解除下载速度限制
    }
    catch (error) {
        console.log("fetchDataFromBiliAndCache错误:", error);
        return { code: -1, message: `请求失败: ${error instanceof Error ? error.message : String(error)}` };
    }
});
/**
 * 数据处理中间件 \
 * 返回为 true - 继续执行 \
 * 返回为 false - 阻止进行 \
 * 返回为 true 时，0-标准执行 1-检查vip
 * 返回一个 [boolean,number] 参数0决定是否继续执行，参数1决定封锁信息
 * @param url_data 域名后的请求数据
 * @param headers 请求头
 * @return {boolean} boolean
 */
const middleware = (url_data, headers, method) => __awaiter(void 0, void 0, void 0, function* () {
    const log = env.logger.child({
        action: "获取playurl(APP端)",
        method: method || "unknown",
        url: url_data,
    });
    //请求头验证
    if (!headers["x-from-biliroaming"] && env.web_on === 0)
        return [false, 1];
    if (env.ver_min !== 0 && env.ver_min > Number(headers["build"]))
        return [false, 2];
    //信息获取
    const url = new URL(url_data, env.api.main.app.playurl);
    if (!url.search || !url.search)
        return [false, 7]; //缺少参数
    const data = qs_1.default.parse(url.search.slice(1));
    //自定义请求参数验证
    if (data.ep_id && env.block_bangumi.ep.includes(Number(data.ep_id)))
        return [false, 8, "ep_id" + data.ep_id];
    if (data.cid && env.block_bangumi.cid.includes(Number(data.cid)))
        return [false, 8, "cid" + data.cid];
    if (data.avid && env.block_bangumi.avid.includes(Number(data.avid)))
        return [false, 8, "avid" + data.avid];
    if (data.bvid && env.block_bangumi.bvid.includes(data.bvid))
        return [false, 8, "bvid" + data.bvid];
    //免登陆
    const info = yield bili.access_keyParams2info(url.search);
    if (info.uid === 0) {
        //查询信息失败
        if (!env.need_login)
            return [true, 0, JSON.stringify(info)];
        else
            return [false, 6];
    }
    //信息获取
    if (!data.access_key)
        return [false, 7]; //缺少参数 need_login=1才需此行
    if (env.need_login && !data.access_key)
        return [false, 6]; //need_login强制为1
    const log_data = {
        access_key: data.access_key,
        UID: info.uid,
        vip_type: info.vip_type,
        url: url_data,
    };
    log.info({});
    log.debug({ headers, user_info: log_data });
    yield playerUtil.addNewLog_bitio(log_data);
    yield playerUtil.addNewLog_notion(log_data);
    //黑白名单验证
    const blacklist_data = yield blacklist.main(info.uid);
    if (blacklist_data.code != 0)
        return [false, 3];
    else {
        if (env.whitelist_enabled) {
            if (blacklist_data.data.is_whitelist)
                return [true, 0, JSON.stringify(info)];
            else
                return [false, 5];
        }
        if (env.blacklist_enabled && blacklist_data.data.is_blacklist)
            return [false, 4];
        return [true, 0, JSON.stringify(info)];
    }
});
exports.middleware = middleware;
const main = (url_data, info_cahce) => __awaiter(void 0, void 0, void 0, function* () {
    //信息获取
    const url = new URL(url_data, env.api.main.app.playurl);
    const data = qs_1.default.parse(url.search.slice(1));
    const info = info_cahce || (yield bili.access_keyParams2info(url.search));
    if (env.need_login && info.uid === 0)
        return env.block(6);
    const rCache = yield playerUtil.readCache(Number(data.cid), Number(data.ep_id), info);
    // if (rCache) return JSON.parse(rCache);
    if (rCache)
        return rCache;
    else
        return fetchDataFromBiliAndCache(url_data);
});
exports.main = main;
//# sourceMappingURL=app.js.map