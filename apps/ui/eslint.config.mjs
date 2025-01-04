import config from "eslint-config/eslint.config.mjs";

export default [...config, { ignores: ["next-env.d.ts", ".next"] }];
