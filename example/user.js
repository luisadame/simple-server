let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Berta" },
  { id: 3, name: "Ada" },
];

export const User = {
  async all() {
    return users;
  },
  async get(id) {
    return users.find((user) => user.id === id);
  },
  async create(user) {
    const insertedUser = {
      id: users.length + 1,
      name: user.name,
    };
    users.push(insertedUser);
    return insertedUser;
  },
};
