export interface Order {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  item: string;
  amount: number;
  amountDepot: number;
  price: number;
  tax: number;
  description: string;
  dateTime: number;
  total: number;
}
