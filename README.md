# BiliRoaming Azure Functions Migration

This directory contains the Azure Functions version of the BiliRoaming API server.

## Directory Structure

```
azure_functions/
├── AdminClean/                # Admin cache cleaning
├── AdminInit/                 # Admin database initialization  
├── AdminLog/                  # Admin logging
├── IntlAppSearchType/         # International app search
├── IntlAppSubtitle/           # International app subtitles
├── IntlOgvPlayurl/            # International OGV playurl
├── IntlOgvViewAppSeason/      # International OGV season info
├── PgcPlayerApiPlayurl/       # PGC player API playurl
├── PgcPlayerWebPlayurl/       # PGC player web playurl
├── PgcViewV2AppSeason/        # PGC app season info
├── PgcViewWebSeason/          # PGC web season info
├── PlayUrl/                   # Main PlayUrl API function
├── ServerInfo/                # Server information
├── ToolsCookies2Accesskey/    # Cookie to access key conversion
├── ToolsMyInfo/               # User info retrieval
├── Users/                     # User blacklist check (dynamic route)
├── XV2SearchType/             # App search type
├── XWebInterfaceSearchType/   # Web interface search
├── src/                       # Source code copied from main project
├── package.json               # Azure Functions dependencies
├── tsconfig.json              # TypeScript configuration
└── host.json                  # Azure Functions host configuration
```

## Total API Coverage

✅ **18 Azure Functions created** covering all API endpoints from the original Next.js project:

### Admin APIs (3)
- `/api/admin/clean` → AdminClean
- `/api/admin/init` → AdminInit  
- `/api/admin/log` → AdminLog

### Legacy APIs (11)
- `/api/legacy/intl/gateway/v2/app/search/type` → IntlAppSearchType
- `/api/legacy/intl/gateway/v2/app/subtitle` → IntlAppSubtitle
- `/api/legacy/intl/gateway/v2/ogv/playurl` → IntlOgvPlayurl
- `/api/legacy/intl/gateway/v2/ogv/view/app/season` → IntlOgvViewAppSeason
- `/api/legacy/pgc/player/api/playurl` → PgcPlayerApiPlayurl
- `/api/legacy/pgc/player/web/playurl` → PgcPlayerWebPlayurl
- `/api/legacy/pgc/view/v2/app/season` → PgcViewV2AppSeason
- `/api/legacy/pgc/view/web/season` → PgcViewWebSeason
- `/api/legacy/server_info` → ServerInfo
- `/api/legacy/x/v2/search/type` → XV2SearchType
- `/api/legacy/x/web-interface/search/type` → XWebInterfaceSearchType

### Tools APIs (2)
- `/api/tools/cookies2accesskey` → ToolsCookies2Accesskey
- `/api/tools/my_info` → ToolsMyInfo

### User APIs (1)
- `/api/users/[uid]` → Users (dynamic route)

### Additional (1)
- Custom PlayUrl function for main playurl handling

## Key Features

1. **Complete API Migration**: All 17 original API endpoints now have corresponding Azure Functions
2. **Blacklist Functionality**: Restored to use configuration switches instead of being completely disabled
3. **Dynamic Routes**: Proper handling of dynamic routes like `/users/{uid}`
4. **CORS Support**: Web functions include proper CORS headers
5. **Authentication**: Admin functions require secret authentication
6. **Caching**: Appropriate cache headers are set for different endpoints
7. **Logging**: All functions include proper logging functionality

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start the Azure Functions runtime:
   ```bash
   npm start
   ```

## Example URLs

After starting the functions, all APIs will be available at:
- `http://localhost:7071/api/[route]`

Examples:
- Main PlayUrl API: `http://localhost:7071/api/legacy/pgc/player/api/playurl`
- User API: `http://localhost:7071/api/users/123456`
- Server Info: `http://localhost:7071/api/legacy/server_info`
- Admin Clean: `http://localhost:7071/api/admin/clean?s=[secret]`

## Migration Notes

- All original functionality has been preserved
- Function structure follows Azure Functions v4 Node.js model
- Each function is isolated and can be deployed independently
- Source code in `src/` directory remains unchanged from original project
- Blacklist functionality uses the same configuration switches as the original# biliazurefunc
