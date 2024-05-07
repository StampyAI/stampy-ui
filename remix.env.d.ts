/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-workers/globals" />
/// <reference types="@cloudflare/workers-types" />

// rebounded from Remix loader context to global variable in _index.tsx
declare const STAMPY_KV: KVNamespace
declare const CODA_TOKEN: string
declare const CODA_INCOMING_TOKEN: string
declare const CODA_WRITES_TOKEN: string
declare const NLP_SEARCH_ENDPOINT: string
declare const ALLOW_ORIGINS: string
declare const CHATBOT_URL: string
declare const GOOGLE_ANALYTICS_ID: string
declare const DISCORD_LOGGING_CHANNEL_ID: string
declare const DISCORD_LOGGING_TOKEN: string
