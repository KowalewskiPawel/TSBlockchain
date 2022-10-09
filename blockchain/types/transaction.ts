export type Transaction = {
    buyerAddress: string | null,
    sellerAddress: string | null,
    price?: number,
    itemSold?: string,
    itemBought?: string,
    signature?: string
}