import { createApiApp } from "../../server/_core/index";

const app = createApiApp({ trpcRootFallback: true });

export default app;
