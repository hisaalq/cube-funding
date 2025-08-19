import instance from ".";
import { getToken } from "./storage";


{/*deposit */}
export const depositMoney = async (amount: number) => {
  const token = await getToken();
  const res = await instance.put("/mini-project/api/transactions/deposit", { amount }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
{/*withdraw */}
export const withdrawMoney = async (amount: number) => {
  const token = await getToken();
  const res = await instance.put("/mini-project/api/transactions/withdraw", { amount }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
{/*Transfer */}
export const transferMoney = async (amount: number) => {
  const token = await getToken();
  const res = await instance.put("/mini-project/api/transactions/transfer/<username>", { amount }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
{/*get all transactions */}
export const getAllTransactions = async () => {
  const data = await instance.get("/mini-project/api/transactions/my");
  return data;
};
