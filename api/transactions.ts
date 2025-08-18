import instance from ".";

const getAllTransactions = async () => {
  const { data } = await instance.get("/mini-project/api/transactions/my");

  return data;
};

export { getAllTransactions };
