// example of a simple-server usage
import { serve } from "../src/index.js";
import { Post } from "./post.js";
import { User } from "./user.js";

const app = serve();

app.get(/^\/$/, (req, res) => {
  res.send("Hello world!");
});

app.get(/^\/posts\/(?<id>[0-9])$/, async (req, res) => {
  const id = req.params("id");
  const myPost = await Post.get(id);
  res.json(myPost);
});

app.get(/^\/users$/, async (_, res) => {
  res.json(await User.all());
});

app.get(/^\/users\/(?<id>[0-9])$/, async (req, res) => {
  const id = Number(req.params("id"));
  res.json(await User.get(id));
});

app.post(/^\/users$/, async (req, res) => {
  const data = await req.data();
  const user = await User.create({ name: data.name });
  res.json(user);
});

app.listen(5000);
