# BiliRoaming Azure Functions 代理

本仓库提供一个精简的 Azure Functions 部署，仅保留了 BiliRoaming 所需的几个核心接口。  
逻辑与 [biliroaming-ts-server-vercel](https://github.com/bili-vd-bak/biliroaming-ts-server-vercel) 保持一致，但运行环境为 Azure Functions。  
生成的构建产物会同时部署到三个 Azure Function App：`biliroaming`、`biliesasian`、`bilihk`。

## 已开通的函数

| 函数目录 | 路由 | 目标地址 |
| --- | --- | --- |
| `XWebInterfaceSearchType` | `/x/web-interface/search/type` | `https://api.bilibili.com` |
| `XV2SearchType` | `/x/v2/search/type` | `https://app.bilibili.com` |
| `PgcViewWebSeason` | `/pgc/view/web/season` | `https://api.bilibili.com` |
| `PgcViewV2AppSeason` | `/pgc/view/v2/app/season` | `https://api.bilibili.com` |
| `PgcPlayerWebPlayurl` | `/pgc/player/web/playurl` | `https://api.bilibili.com`（强制附带 Referer 与 CORS） |
| `PgcPlayerApiPlayurl` | `/pgc/player/api/playurl` | `https://api.bilibili.com` |

所有函数都复用 `src/proxy.ts` 中的轻量代理实现，负责转发请求、保留必要头部，并在检测到浏览器来源时补齐 CORS 响应。

## 开发流程

```bash
npm install
npm run build
func start            # 可选：需要安装 Azure Functions Core Tools
```

TypeScript 会将编译结果输出到 `dist/`，GitHub Actions 也会使用同一份产物完成三个 Function App 的部署。

## 部署说明

- `.github/workflows/` 下的工作流使用 `azure/login@v2` 进行 OIDC 登录。  
- 工作流依赖仓库中已存在的 Secrets：`AZUREAPPSERVICE_{CLIENTID|TENANTID|SUBSCRIPTIONID}_…`，请确保这些 Secret 始终指向有效的 Azure AD 应用与订阅。  
- 此项目仅面向 Azure 环境提供支持，请勿在其他云环境使用同一套自动化脚本或凭据。

## 致谢

- `biliroaming-ts-server-vercel` 维护者与贡献者。  
- OpenAI Codex（基于 GPT-5 的助手）提供的开发协助。  
- Anthropic Claude Code 的思路与工具支持。  
- Microsoft 365 Developer Program 提供的 E5 订阅资源。

---

**仅限 Azure 使用提醒：** 部署、凭据与工作流都依赖 Azure Functions 和 Azure AD，如需在其他平台使用请务必重新评估并更换部署方案。***
