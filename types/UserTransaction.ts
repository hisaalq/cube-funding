export interface UserTransaction {
    _id: string;
    amount: number;
    type:  "deposit" | "withdraw" | "transfer";
    createdAt: string; 
}
