import http from "http";

export function getRequest(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(endpoint, (res) => {
      let error;

      if (res.statusCode !== 200) {
        error = "not successful response";
      } else if (!res.headers["content-type"].includes("application/json")) {
        error = "not json";
      }

      if (error) {
        reject(error);
        res.resume();
        return;
      }

      let rawData = "";

      res.setEncoding("utf-8");

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    });
  });
}
