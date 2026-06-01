import { createApiApp } from "../../dist/index.js";

const app = createApiApp({ trpcRootFallback: true });

export default app;
