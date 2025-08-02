import React from 'react';
import { Order } from '../types';

interface StatusFilterProps {
  selectedStatus: Order['status'] | 'All';
  onStatusChange: (status: Order['status'] | 'All') => void;
  orderCounts: Record<Order['status'] | 'All', number>;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  selectedStatus, 
  onStatusChange, 
  orderCounts 
}) => {
  const statuses: (Order['status'] | 'All')[] = ['All', 'Awaiting', 'Preparing', 'Prepared', 'Declined'];

  const getButtonClass = (status: Order['status'] | 'All') => {
    const baseClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    const isSelected = selectedStatus === status;
    
    if (isSelected) {
      switch (status) {
        case 'All':
          return `${baseClass} bg-gray-800 text-white`;
        case 'Awaiting':
          return `${baseClass} bg-yellow-600 text-white`;
        case 'Preparing':
          return `${baseClass} bg-blue-600 text-white`;
        case 'Prepared':
          return `${baseClass} bg-green-600 text-white`;
        case 'Declined':
          return `${baseClass} bg-red-600 text-white`;
      }
    }
    
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={getButtonClass(status)}
        >
          {status} ({orderCounts[status]})
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;