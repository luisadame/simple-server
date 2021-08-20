import http from "http";
import { Config } from "./config.js";

export class Request {
  /**
   * @type {http.IncomingMessage}
   */
  request;
  base;

  /**
   * @param {http.IncomingMessage} request
   */
  constructor(request, base) {
    this.request = request;
    this.base = base;
  }

  setController(controller) {
    this.controller = controller;
  }

  url() {
    return new URL(this.request.url, Config.base());
  }

  path() {
    return this.url().pathname;
  }

  method() {
    return this.request.method?.toLowerCase();
  }

  parseRouteParameters() {
    const regex = this.controller.path;
    const matches = this.path().match(regex);
    return matches?.groups;
  }

  parseSearchParameters() {
    if (this.request.method !== "GET") return;
    const url = this.url();
    const searchParams = url.searchParams;
    const asDictionary = {};
    searchParams.forEach((value, key) => {
      // support /?param[]=asd&param[]=fgh
      if (key.includes("[]")) {
        if (Array.isArray(asDictionary[key])) {
          asDictionary[key].push(value);
        } else {
          asDictionary[key] = [value];
        }
      } else {
        asDictionary[key] = value;
      }
    });
    return asDictionary;
  }

  parseData(data) {
    if (this.request.headers["content-type"].includes("application/json")) {
      return JSON.parse(data);
    }

    if (
      this.request.headers["content-type"].includes(
        "application/x-www-form-urlencoded"
      )
    ) {
      const fields = Object.fromEntries(
        data.split("&").map((field) => field.split("="))
      );
      return fields;
    }
  }

  data() {
    return new Promise((resolve, reject) => {
      if (this.request.method === "POST") {
        let data = "";
        this.request.on("readable", () => {
          let chunk;
          while (null !== (chunk = this.request.read())) {
            data += chunk;
          }
        });
        this.request.on("error", (error) => reject(error));
        this.request.on("end", () => {
          resolve(this.parseData(data));
        });
      } else {
        resolve(this.parseSearchParameters());
      }
    });
  }

  params(param) {
    const routeParameters = this.parseRouteParameters();
    const searchParameters = this.parseSearchParameters();
    if (
      typeof routeParameters === "object" ||
      typeof routeParameters === "object"
    ) {
      const found = routeParameters[param] || searchParameters[param];
      return found;
    }
  }
}
