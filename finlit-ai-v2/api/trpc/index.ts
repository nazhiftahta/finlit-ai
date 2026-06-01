import { createApiApp } from "../../server/_core/index.ts";

const app = createApiApp({ trpcRootFallback: true });

export default app;
