export interface Order {
  _id: string;
  item: string;
  quantity: number;
  status: 'Awaiting' | 'Preparing' | 'Prepared' | 'Declined';
  timestamp: string;
}