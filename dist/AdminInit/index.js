"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _config_1 = require("../src/_config");
const httpTrigger = (request, context) => __awaiter(void 0, void 0, void 0, function* () {
    context.log('HTTP trigger function processed a request.');
    // 提取查询参数
    const urlObject = new URL(request.url);
    const queryParams = new URLSearchParams(urlObject.search);
    const secret = queryParams.get('s');
    if (secret !== _config_1.local_cache_secret) {
        return {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: "Secret Error!" })
        };
    }
    else if (_config_1.db_bitio_enabled === 0) {
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: "未启用Postgresql数据库" })
        };
    }
    else {
        yield _config_1.db_bitio_pool
            .query(`CREATE TABLE blacklist(
              uid             BIGINT      PRIMARY KEY,
              type            SMALLINT    NOT NULL,
              reason          TEXT,
              ban_until       INT8
            )`)
            .catch((err) => console.error(err));
        yield _config_1.db_bitio_pool
            .query(`CREATE TABLE cache(
              cid             BIGINT,
              ep              BIGINT,
              need_vip        BOOLEAN     NOT NULL     DEFAULT false,
              exp             BIGINT      NOT NULL,
              data            JSON        NOT NULL
            )`)
            .catch((err) => console.error(err));
        yield _config_1.db_bitio_pool
            .query(`CREATE TABLE log(
              uid             BIGINT,
              vip_type        BIGINT,
              access_key      TEXT,
              url             TEXT,
              visit_time      BIGINT     NOT NULL
            )`)
            .catch((err) => console.error(err));
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: "Postgresql Init Done!" })
        };
    }
});
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map