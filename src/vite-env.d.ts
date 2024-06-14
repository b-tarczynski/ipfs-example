/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEB3_TOKEN: string
    readonly VITE_KEY: `did:key:${string}`
    readonly VITE_PROOF: string
    readonly VITE_DID: `did:key:${string}`
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
