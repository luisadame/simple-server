import http from "http";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { Router } from "./router.js";
import { Config } from "./config.js";

export function serve() {
  const server = http.createServer((req, res) => {
    console.log(`Incoming request to ${req.url}`);
    const request = new Request(req);
    const response = new Response(res);
    const router = new Router(request);

    if (!router.isRequestMethodSupported()) {
      return response.notFound();
    }

    const controller = router.getRouteController();

    if (!controller) {
      return response.notFound();
    }

    request.setController(controller);

    async function executeRouteController() {
      try {
        await controller.callback(request, response);
      } catch (error) {
        console.error(error);
      }
    }

    executeRouteController();
  });

  return {
    get: Router.get,
    post: Router.post,

    /**
     * @param {number} port
     **/
    listen(port = 5000) {
      Config.port = port;
      server.listen(Config.port);

      console.log(`Listening on port ${Config.port}`);
    },
  };
}
