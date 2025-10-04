export default {
  apps: [
    {
      name: "wedding-frontend",
      script: "npm",
      args: "run dev -- --host 0.0.0.0",
      cwd: "/root/Wedding-front-end-",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: "500M",
      error_file: "./logs/frontend-err.log",
      out_file: "./logs/frontend-out.log",
      log_file: "./logs/frontend-combined.log",
      time: true,
    },
  ],
};
