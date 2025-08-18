import instance from ".";

const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");

  return data;
};

export { getAllUsers };
