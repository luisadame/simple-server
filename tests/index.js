import http from "http";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { getRequest } from "../src/utils.js";

test("all users", async () => {
  const data = await getRequest("http://localhost:5000/users");
  assert.equal(data, [
    { id: 1, name: "John" },
    { id: 2, name: "Berta" },
    { id: 3, name: "Ada" },
  ]);
});

test("single user", async () => {
  const data = await getRequest("http://localhost:5000/users/1");
  assert.equal(data, { id: 1, name: "John" });
});

test("create user", async () => {
  const postData = JSON.stringify({
    name: "Luis",
  });

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options);
  req.write(postData);
  req.end();

  const users = await getRequest("http://localhost:5000/users");
  assert.equal(users.pop(), { id: 4, name: "Luis" });
});

test("can fetch a post", async () => {
  const data = await getRequest("http://localhost:5000/posts/1");
  assert.ok(data);
});

test.run();
