module.exports = {
  apps: [
    {
      name: "wedding-frontend-prod",
      script: "/root/.nvm/versions/node/v22.20.0/bin/serve",
      args: "-s dist -l 3000",
      cwd: "/root/Wedding-front-end-",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: "100M",
      error_file: "./logs/frontend-prod-err.log",
      out_file: "./logs/frontend-prod-out.log",
      log_file: "./logs/frontend-prod-combined.log",
      time: true,
    },
  ],
};
