import React from 'react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Awaiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prepared':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{order.item}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-2">Quantity: {order.quantity}</p>
      <p className="text-xs text-gray-500">ID: {order._id}</p>

      {order.status === 'Awaiting' && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onStatusChange(order._id, 'Preparing')}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusChange(order._id, 'Declined')}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      )}

      {order.status === 'Preparing' && (
        <div className="mt-3">
          <button
            onClick={() => onStatusChange(order._id, 'Prepared')}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Mark as Prepared
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
