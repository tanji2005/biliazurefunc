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
const checkBlackList = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    //黑白名单验证
    const blacklist_data = yield blacklist.main(uid);
    if (blacklist_data.code != 0)
        return [false, 3];
    else {
        if (env.whitelist_enabled) {
            if (blacklist_data.data.is_whitelist)
                return [true, 0];
            else
                return [false, 5];
        }
        if (env.blacklist_enabled && blacklist_data.data.is_blacklist)
            return [false, 4];
        return [true, 0];
    }
});
/**
 * 数据处理中间件 \
 * 返回为 true - 继续执行 \
 * 返回为 false - 阻止进行 \
 * 返回为 true 时，0-标准执行 1-检查vip
 * 返回一个 [boolean,number] 参数0决定是否继续执行，参数1决定封锁信息
 * @param url_data 域名后的请求数据
 * @param cookies cookies
 * @return {boolean} boolean
 */
const middleware = (url_data, cookies, //FIXME 未添加完整类型
PassWebOnCheck, method) => __awaiter(void 0, void 0, void 0, function* () {
    const log = env.logger.child({
        action: "获取playurl(网页端)",
        method: method || "unknown",
        url: url_data,
    });
    //请求头验证
    if (!env.web_on && PassWebOnCheck === 0)
        return [false, 1];
    //信息获取
    const url = new URL(url_data, env.api.main.web.playurl);
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
    if (!env.need_login)
        return [true, 0, { uid: 0, vip_type: 0 }];
    //信息获取
    if (env.need_login && !data.access_key && !cookies.access_key) {
        return [false, 6]; //要求登录
    }
    //仅允许access_key或cookies鉴权
    //旧cookies2accesskey失效，新API会产生登录信息，故删除仅cookies鉴权
    let access_key;
    if (!data.access_key && cookies.access_key) {
        //拯救一下只传cookies的BBDown
        //需手动为BBDown的请求带上特定cookie-'access_key'
        access_key = cookies.access_key;
    }
    const info = yield bili.access_key2info(data.access_key || access_key);
    if (!info)
        return [false, 6]; //查询信息失败
    const log_data = {
        access_key: data.access_key || access_key,
        UID: info.uid,
        vip_type: info.vip_type,
        url: url_data,
    };
    log.info({});
    log.debug({
        cookies,
        user_info: log_data,
    });
    yield playerUtil.addNewLog_bitio(log_data);
    yield playerUtil.addNewLog_notion(log_data);
    //黑白名单验证
    const checked_res = yield checkBlackList(info.uid);
    return [...checked_res, JSON.stringify(info)];
});
exports.middleware = middleware;
const main = (url_data, cookies, info_cache) => __awaiter(void 0, void 0, void 0, function* () {
    //信息获取
    const url = new URL(url_data, env.api.main.web.playurl);
    const data = qs_1.default.parse(url.search.slice(1));
    //有access_key优先，否则若有cookies用cookies
    //TODO 转发cookies做验证：1. 支持cookies2info 2. cookies(JSON2string)
    const login = data.access_key || !playerUtil.isEmptyObject(cookies);
    if (login) {
        let info = info_cache || null, access_key;
        if (!data.access_key && cookies)
            access_key = cookies.access_key;
        if (!info)
            info = yield bili.access_key2info(data.access_key || access_key);
        const rCache = yield playerUtil.readCache(Number(data.cid), Number(data.ep_id), info);
        if (rCache)
            return { code: 0, message: "success", result: rCache };
        else {
            const res = (yield fetch(env.api.main.web.playurl +
                url_data +
                (access_key ? "&access_key=" + access_key : ""), env.fetch_config_UA).then((res) => res.json()));
            if (res.code === 0)
                yield playerUtil.addNewCache(url_data, res === null || res === void 0 ? void 0 : res.result);
            return env.try_unblock_CDN_speed_enabled
                ? JSON.parse(JSON.stringify(res).replace(/bw=[^&]*/g, "bw=1280000"))
                : res; //尝试解除下载速度限制
        }
    }
    else {
        cookies = bili.getCookies();
        // console.log(env.api.main.web.playurl + url_data);
        const res = (yield fetch(env.api.main.web.playurl + url_data, {
            headers: { "User-Agent": env.UA, cookie: cookies },
        }).then((res) => res.json()));
        // console.log(res);
        if (res.code === 0)
            yield playerUtil.addNewCache(url_data, res === null || res === void 0 ? void 0 : res.result);
        return env.try_unblock_CDN_speed_enabled
            ? JSON.parse(JSON.stringify(res).replace(/bw=[^&]*/g, "bw=1280000"))
            : res; //尝试解除下载速度限制
    }
});
exports.main = main;
//# sourceMappingURL=web.js.map