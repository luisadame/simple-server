export const Config = {
  domain: "http://localhost",
  port: 5000,
  base() {
    return `${this.domain}${this.port}`;
  },
};
