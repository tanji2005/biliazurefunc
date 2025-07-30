import {
  local_cache_secret,
  db_bitio_enabled,
  db_bitio_pool,
} from "../src/_config";

module.exports = async function (context: any, req: any) {
    context.log('AdminInit: Starting');
    try {
        // 提取查询参数
        const urlObject = new URL(req.url);
        const queryParams = new URLSearchParams(urlObject.search);
        const secret = queryParams.get('s');

        if (secret !== local_cache_secret) {
            context.res = {
                status: 403,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mes: "Secret Error!" })
            };
        } else if (db_bitio_enabled === 0) {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mes: "未启用Postgresql数据库" })
            };
        } else {
            await db_bitio_pool
                .query(
                    `CREATE TABLE blacklist(
                  uid             BIGINT      PRIMARY KEY,
                  type            SMALLINT    NOT NULL,
                  reason          TEXT,
                  ban_until       INT8
                )`
                )
                .catch((err) => console.error(err));
                
            await db_bitio_pool
                .query(
                    `CREATE TABLE cache(
                  cid             BIGINT,
                  ep              BIGINT,
                  need_vip        BOOLEAN     NOT NULL     DEFAULT false,
                  exp             BIGINT      NOT NULL,
                  data            JSON        NOT NULL
                )`
                )
                .catch((err) => console.error(err));
                
            await db_bitio_pool
                .query(
                    `CREATE TABLE log(
                  uid             BIGINT,
                  vip_type        BIGINT,
                  access_key      TEXT,
                  url             TEXT,
                  visit_time      BIGINT     NOT NULL
                )`
                )
                .catch((err) => console.error(err));
                
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mes: "Postgresql Init Done!" })
            };
        }
    } catch (error) {
        context.log('AdminInit: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};