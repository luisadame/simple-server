import http from "http";

export class Response {
  response;

  /**
   * @param {http.ServerResponse} response
   */
  constructor(response) {
    this.response = response;
  }

  /**
   *
   * @param {*} data
   */
  send(data, statusCode = 200) {
    if (!data) {
      this.response.statusCode = 204;
      this.response.end();
    } else {
      this.response.statusCode = statusCode;
      this.response.write(data);
      this.response.end();
    }
  }

  /**
   * @param {Object} payload
   */
  json(payload) {
    this.response.setHeader("Content-Type", "application/json");
    const asJson = JSON.stringify(payload);
    this.send(asJson);
  }

  notFound() {
    this.send("Not found", 404);
  }
}
