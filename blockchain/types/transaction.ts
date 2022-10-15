export type Transaction = {
    senderAddress: string,
    receiverAddress: string,
    amount: number,
    signature?: string
};