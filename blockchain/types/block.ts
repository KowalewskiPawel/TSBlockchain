import { Transaction } from "./transaction"

export type Block = {
    hash: string | number,
    previousHash: string | number | null,
    nonce?: number,
    transactions?: Transaction[]
}