# Truid Project Structure

```
Truid/
├── package.json
├── package-lock.json
├── tsconfig.json
├── config.json
├── .env
├── .DS_Store
│
├── src/
│   ├── main.ts
│   ├── main-mvp.ts
│   ├── app.ts
│   │
│   ├── core/
│   │   ├── config.ts
│   │   └── types.ts
│   │
│   ├── environments/
│   │   ├── mvp.ts
│   │   └── production.ts
│   │
│   └── features/
│       ├── input/
│       │   └── prompt.ts
│       │
│       ├── markdown/
│       │   └── renderer.ts
│       │
│       ├── stream/
│       │   └── processor.ts
│       │
│       └── logo/
│           └── index.ts
│
├── dist/
│   ├── main.js
│   ├── main.d.ts
│   ├── main.js.map
│   ├── main-mvp.js
│   ├── main-mvp.d.ts
│   ├── main-mvp.js.map
│   ├── app.js
│   ├── app.d.ts
│   ├── app.js.map
│   │
│   ├── core/
│   │   ├── config.js
│   │   ├── config.d.ts
│   │   ├── config.js.map
│   │   ├── types.js
│   │   ├── types.d.ts
│   │   └── types.js.map
│   │
│   ├── environments/
│   │   ├── mvp.js
│   │   ├── mvp.d.ts
│   │   ├── mvp.js.map
│   │   ├── production.js
│   │   ├── production.d.ts
│   │   └── production.js.map
│   │
│   └── features/
│       ├── input/
│       │   ├── prompt.js
│       │   ├── prompt.d.ts
│       │   └── prompt.js.map
│       │
│       ├── markdown/
│       │   ├── renderer.js
│       │   ├── renderer.d.ts
│       │   └── renderer.js.map
│       │
│       ├── stream/
│       │   ├── processor.js
│       │   ├── processor.d.ts
│       │   └── processor.js.map
│       │
│       └── logo/
│           ├── index.js
│           ├── index.d.ts
│           └── index.js.map
│
└── node_modules/
    ├── @anthropic-ai/
    ├── @types/
    ├── chalk/
    ├── dotenv/
    ├── marked/
    ├── marked-terminal/
    ├── typescript/
    ├── zod/
    └── ...
```
