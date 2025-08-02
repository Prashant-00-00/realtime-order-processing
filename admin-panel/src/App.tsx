import { useState, useMemo } from 'react';
import { useOrders } from './hooks/useOrders';
import OrderCard from './components/OrderCard';
import OrderForm from './components/OrderForm';
import StatusFilter from './components/StatusFilter';
import { Order } from './types';

function App() {
  const { orders, loading, error, addOrder, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'All'>('All');

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'All') return orders;
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  const orderCounts = useMemo(() => {
    const counts = { All: orders.length, Awaiting: 0, Preparing: 0, Prepared: 0, Declined: 0 };
    orders.forEach(order => {
      counts[order.status]++;
    });
    return counts;
  }, [orders]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Admin Panel</h1>
        <OrderForm onSubmit={addOrder} />
        <div className="mt-6">
          <StatusFilter 
            selectedStatus={selectedStatus} 
            onStatusChange={setSelectedStatus} 
            orderCounts={orderCounts} 
          />
        </div>

        <div className="grid gap-6 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} onStatusChange={updateOrderStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
