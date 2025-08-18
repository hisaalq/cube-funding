interface MockTransactions {
  id: number;
  amount: number;
  date: string;
  type: string;
}

const mockTransactions: MockTransactions[] = [
  { id: 1, amount: 250, date: "2025-08-18", type: "deposit" },
  { id: 2, amount: 75, date: "2025-08-17", type: "withdraw" },
  { id: 3, amount: 120, date: "2025-08-16", type: "transfer" },
  { id: 4, amount: 500, date: "2025-08-15", type: "deposit" },
  { id: 5, amount: 60, date: "2025-08-14", type: "withdraw" },
  { id: 6, amount: 200, date: "2025-08-13", type: "deposit" },
  { id: 7, amount: 150, date: "2025-08-12", type: "transfer" },
  { id: 8, amount: 80, date: "2025-08-11", type: "withdraw" },
  { id: 9, amount: 300, date: "2025-08-10", type: "deposit" },
  { id: 10, amount: 50, date: "2025-08-09", type: "withdraw" },
  { id: 11, amount: 180, date: "2025-08-08", type: "transfer" },
  { id: 12, amount: 400, date: "2025-08-07", type: "deposit" },
  { id: 13, amount: 90, date: "2025-08-06", type: "withdraw" },
  { id: 14, amount: 220, date: "2025-08-05", type: "deposit" },
  { id: 15, amount: 130, date: "2025-08-04", type: "transfer" },
];

export default mockTransactions;
