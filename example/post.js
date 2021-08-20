import { getRequest } from "../src/utils.js";

// example of a post model file
function getPost(id) {
  const endpoint = `http://jsonplaceholder.typicode.com/posts/${id}`;
  return getRequest(endpoint);
}

export const Post = {
  get: getPost,
};
