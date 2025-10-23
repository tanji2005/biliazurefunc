# BiliRoaming Azure Functions Proxy

This repository hosts a minimal Azure Functions deployment that proxies a handful of BiliRoaming routes.  
It mirrors the behaviour of [biliroaming-ts-server-vercel](https://github.com/bili-vd-bak/biliroaming-ts-server-vercel) while targeting Azure Functions.  
The same build output is used by three production Function Apps (`biliroaming`, `biliesasian`, `bilihk`).

> 📄 A Chinese translation is available in [`README.zh-CN.md`](README.zh-CN.md).

## Available Functions

| Function | Route | Target |
| --- | --- | --- |
| `XWebInterfaceSearchType` | `/x/web-interface/search/type` | `https://api.bilibili.com` |
| `XV2SearchType` | `/x/v2/search/type` | `https://app.bilibili.com` |
| `PgcViewWebSeason` | `/pgc/view/web/season` | `https://api.bilibili.com` |
| `PgcViewV2AppSeason` | `/pgc/view/v2/app/season` | `https://api.bilibili.com` |
| `PgcPlayerWebPlayurl` | `/pgc/player/web/playurl` | `https://api.bilibili.com` (forces referer + CORS) |
| `PgcPlayerApiPlayurl` | `/pgc/player/api/playurl` | `https://api.bilibili.com` |

All functions share the lightweight proxy implementation in `src/proxy.ts`, which forwards the original request, preserves headers, and optionally sets CORS when a browser origin is detected.

## Development

```bash
npm install
npm run build
func start            # optional: requires Azure Functions Core Tools
```

The TypeScript compiler outputs to `dist/`; GitHub Actions uses the same build artifact for all three Function Apps.

## Deployment Notes

- GitHub Actions workflows under `.github/workflows/` handle CI/CD using OIDC (`azure/login@v2`).  
- Each workflow references the existing repository secrets named `AZUREAPPSERVICE_{CLIENTID|TENANTID|SUBSCRIPTIONID}_…`. Ensure they remain populated with valid Azure AD application credentials and subscription IDs.  
- Workflows are designed exclusively for Azure; do not reuse these artifacts in non-Azure environments.

## Acknowledgements

- Maintainers and contributors to `biliroaming-ts-server-vercel` for the original implementation.  
- OpenAI’s Codex (GPT-5-based assistant) for development support.  
- Anthropic’s Claude Code for additional inspiration and tooling.  
- Microsoft 365 Developer Program for providing the E5 subscription that powers this work.

---

**Azure-only usage reminder:** the proxy targets rely on Azure Functions hosting, Azure AD identities, and the associated subscription. Avoid running the workflows or deployment scripts on other clouds to prevent credential or infrastructure issues.
