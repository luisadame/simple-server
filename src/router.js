import { Request } from "./request.js";
import { Response } from "./response.js";

export class Router {
  request;
  static routes = {
    get: [],
    post: [],
  };

  /**
   * @param {Request} request
   */
  constructor(request) {
    this.request = request;
  }

  isRequestMethodSupported() {
    return this.request.method() in Router.routes;
  }

  getRouteController() {
    return Router.routes[this.request.method()].find((route) =>
      route.path.test(this.request.path())
    );
  }

  /**
   *
   * @param {String} method
   */
  static isMethodSupported(method) {
    return method in Router.routes;
  }

  /**
   * @param {'get'|'post'} method
   * @param {RegExp} path
   * @param {(request: Request, response: Response) => void} callback
   */
  static addRoute(method, path, callback) {
    if (!Router.isMethodSupported(method)) {
      console.error(`Method not supported`);
      return;
    }
    Router.routes[method].push({ path, callback });
  }

  /**
   * @param {RegExp} path
   * @param {(request: Request, response: Response) => void} callback
   **/
  static get(path, callback) {
    Router.addRoute("get", path, callback);
  }

  /**
   * @param {RegExp} path
   * @param {(request: Request, response: Response) => void} callback
   **/
  static post(path, callback) {
    Router.addRoute("post", path, callback);
  }
}
