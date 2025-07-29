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
exports.delExpCache = exports.addNewCache = exports.readCache = exports.addNewLog_notion = exports.addNewLog_bitio = void 0;
exports.isEmptyObject = isEmptyObject;
const qs_1 = __importDefault(require("qs"));
const env = __importStar(require("../_config"));
const db = __importStar(require("./_sstore"));
const db_notion = __importStar(require("./notion-database/_db"));
const blacklist = __importStar(require("./_blacklist"));
const loggerc = env.logger.child({ action: "调用组件(_player)" });
/**
 * 检测是否为空Object `{}`
 * @param obj
 */
function isEmptyObject(obj) {
    return (obj &&
        Object.getPrototypeOf(obj) === Object.prototype &&
        Object.keys(obj).length === 0);
}
const addNewLog_bitio = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!env.db_bitio_enabled)
        return;
    yield env.db_bitio_pool.query("INSERT INTO log (access_key,uid,vip_type,url,visit_time) VALUES ($1,$2,$3,$4,$5)", [data.access_key, data.UID, data.vip_type, data.url, Date.now()]);
    return;
});
exports.addNewLog_bitio = addNewLog_bitio;
const addNewLog_notion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!env.db_NOTION_log)
        return;
    const res = yield db_notion.update(env.db_NOTION_log, JSON.stringify({
        parent: { database_id: env.db_NOTION_log },
        properties: {
            access_key: {
                id: "title",
                type: "title",
                title: [
                    {
                        type: "text",
                        text: { content: data.access_key },
                        plain_text: data.access_key,
                    },
                ],
            },
            UID: {
                number: data.UID,
            },
            vip_type: {
                number: data.vip_type,
            },
            url: {
                rich_text: [
                    { type: "text", text: { content: data.url }, plain_text: data.url },
                ],
            },
            visit_time: {
                number: Date.now(),
            },
        },
    }));
    return res;
});
exports.addNewLog_notion = addNewLog_notion;
const readCache = (cid, ep_id, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!env.db_local_enabled && !env.db_bitio_enabled)
        return;
    if (!cid)
        cid = 0;
    if (!ep_id)
        ep_id = 0;
    const log = loggerc.child({
        module: "读取缓存",
    });
    let log_data = { cache_way: "unknown" }, to_return = {};
    let c_vip;
    if (env.db_local_enabled) {
        log_data.cache_way = "db_local";
        c_vip = yield db.get({ key: `c-vip-${cid}-${ep_id}` });
    }
    else if (env.db_bitio_enabled) {
        log_data.cache_way = "db_pg";
        let queryWhere = "";
        if (cid && !ep_id)
            queryWhere = `cid = ${cid}`;
        else if (ep_id && !cid)
            queryWhere = `ep = ${ep_id}`;
        else
            queryWhere = `(cid = ${cid} AND ep = ${ep_id})`;
        c_vip = yield env.db_bitio_pool
            .query(`SELECT (data) FROM cache WHERE exp >= $1 AND need_vip = true AND ${queryWhere}`, [Math.round(Number(new Date()) / 1000)])
            .then((res) => { var _a; return ((_a = res.rows[0]) === null || _a === void 0 ? void 0 : _a.data) || undefined; });
    }
    if (c_vip) {
        if (info.vip_type !== 0)
            to_return = c_vip;
        else if (env.whitelist_vip_enabled &&
            ((_a = (yield blacklist.main(info.uid)).data) === null || _a === void 0 ? void 0 : _a.is_whitelist))
            to_return = c_vip;
    }
    else {
        let c_normal;
        if (env.db_local_enabled) {
            log_data.cache_way = "db_local";
            c_normal = yield db.get({ key: `c-${cid}-${ep_id}` });
        }
        else if (env.db_bitio_enabled) {
            log_data.cache_way = "db_pg";
            let queryWhere = "";
            if (cid && !ep_id)
                queryWhere = `cid = ${cid}`;
            else if (ep_id && !cid)
                queryWhere = `ep = ${ep_id}`;
            else
                queryWhere = `(cid = ${cid} AND ep = ${ep_id})`;
            c_normal = yield env.db_bitio_pool
                .query(`SELECT (data) FROM cache WHERE exp >= $1 AND need_vip = false AND ${queryWhere}`, [Math.round(Number(new Date()) / 1000)])
                .then((res) => { var _a; return ((_a = res.rows[0]) === null || _a === void 0 ? void 0 : _a.data) || undefined; });
        }
        if (!c_normal)
            yield (0, exports.delExpCache)(cid, ep_id); //删除过时缓存
        to_return = c_normal;
    }
    const log2 = log.child(log_data);
    log2.info({});
    log2.debug({ context: to_return });
    return to_return;
});
exports.readCache = readCache;
const addNewCache = (url_data, res_data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!env.db_local_enabled && !env.db_bitio_enabled)
        return;
    const log = loggerc.child({
        module: "添加缓存",
    });
    let log_data = { cache_way: "unknown" };
    const need_vip = res_data.has_paid ? 1 : 0;
    const url = new URL(url_data, env.api.main.app.playurl);
    const data = qs_1.default.parse(url.search.slice(1));
    const res_data_str = env.try_unblock_CDN_speed_enabled
        ? JSON.stringify(res_data).replace(/bw=[^&]*/g, "bw=1280000")
        : JSON.stringify(res_data); //尝试解除下载速度限制
    const deadline = Number((res_data_str.match(/deadline=[^&]*/) || [""])[0].slice(9) ||
        Math.round((Number(new Date()) + env.cache_time) / 1000));
    if (env.db_local_enabled) {
        log_data.cache_way = "db_local";
        if (need_vip)
            db.set(`c-vip-${Number(data.cid) || 0}-${Number(data.ep_id) || 0}`, res_data_str, deadline);
        else
            db.set(`c-${Number(data.cid) || 0}-${Number(data.ep_id) || 0}`, res_data_str, deadline);
    }
    else if (env.db_bitio_enabled) {
        log_data.cache_way = "db_pg";
        yield env.db_bitio_pool.query("INSERT INTO cache (need_vip,exp,cid,ep,data) VALUES ($1,$2,$3,$4,$5)", [
            need_vip,
            deadline,
            Number(data.cid) || 0,
            Number(data.ep_id) || 0,
            res_data,
        ]);
    }
    log.info({});
    log.debug({ context: res_data });
});
exports.addNewCache = addNewCache;
const delExpCache = (cid, ep_id) => __awaiter(void 0, void 0, void 0, function* () {
    const log = loggerc.child({
        module: "删除缓存",
    });
    if (env.db_local_enabled)
        db.clear();
    else if (env.db_bitio_enabled)
        yield env.db_bitio_pool.query("DELETE FROM cache WHERE exp <= $1", [
            Math.round(Number(new Date()) / 1000),
        ]);
    log.info({});
});
exports.delExpCache = delExpCache;
//# sourceMappingURL=_player.js.map