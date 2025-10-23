import { defaultRequestHeaders } from "./config";

type HeaderValue = string | number | readonly string[];

export interface ForwardOptions {
  targetBase: string;
  rewritePath?: (path: string) => string;
  enableCors?: boolean;
  corsAllowOrigin?: string;
  additionalHeaders?: Record<string, HeaderValue>;
}

const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

const buildCorsHeaders = (origin?: string) => {
  if (!origin) return { ...defaultCorsHeaders };
  return { ...defaultCorsHeaders, "Access-Control-Allow-Origin": origin };
};

const shouldIncludeBody = (method: string) =>
  method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

const normaliseHeaderValue = (value: HeaderValue | undefined) => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.join(", ");
  return value.toString();
};

export const forwardRequest = async (
  context: any,
  req: any,
  options: ForwardOptions
) => {
  const method = req.method?.toUpperCase() ?? "GET";

  const originalUrl = new URL(req.url);
  const path = options.rewritePath
    ? options.rewritePath(originalUrl.pathname)
    : originalUrl.pathname;
  const targetUrl = new URL(path + originalUrl.search, options.targetBase);

  if (method === "OPTIONS" && options.enableCors) {
    context.log(
      "ForwardRequest: handling CORS preflight for",
      targetUrl.toString()
    );
    context.res = {
      status: 204,
      headers: buildCorsHeaders(options.corsAllowOrigin),
      body: "",
    };
    return;
  }

  const fetchHeaders = new Headers();
  const incomingHeaders: Record<string, HeaderValue | undefined> =
    req.headers ?? {};

  for (const key of Object.keys(incomingHeaders)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "host" || lowerKey === "content-length") continue;
    const value = normaliseHeaderValue(incomingHeaders[key]);
    if (value) fetchHeaders.set(key, value);
  }

  for (const [key, value] of Object.entries(defaultRequestHeaders)) {
    fetchHeaders.set(key, value);
  }

  if (options.additionalHeaders) {
    for (const [key, value] of Object.entries(options.additionalHeaders)) {
      const normalised = normaliseHeaderValue(value);
      if (normalised) fetchHeaders.set(key, normalised);
    }
  }

  let body: BodyInit | undefined;
  if (shouldIncludeBody(method)) {
    body =
      (req as any).rawBody ??
      (typeof req.body === "string" ? req.body : req.body ? JSON.stringify(req.body) : undefined);
    if (!body) fetchHeaders.delete("content-type");
  }

  context.log("ForwardRequest: forwarding", method, targetUrl.toString());

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl.toString(), {
      method,
      headers: fetchHeaders,
      body,
    });
  } catch (error) {
    context.log.error("ForwardRequest: upstream request failed", error);
    context.res = {
      status: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Upstream request failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
    return;
  }

  const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
  const responseHeaders: Record<string, string> = {};
  upstreamResponse.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "content-length") return;
    responseHeaders[key] = value;
  });

  if (options.enableCors) {
    Object.assign(responseHeaders, buildCorsHeaders(options.corsAllowOrigin));
  }

  context.res = {
    status: upstreamResponse.status,
    headers: responseHeaders,
    body: responseBuffer,
    isRaw: true,
  };
};
