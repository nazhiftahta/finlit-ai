import { createApiApp } from "../dist/api.js";

const app = createApiApp({ trpcRootFallback: true });

export default app;
