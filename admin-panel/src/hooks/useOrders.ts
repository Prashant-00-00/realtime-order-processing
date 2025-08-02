import { useState, useEffect, useRef } from 'react';
import { Order } from '../types';
const API_BASE = import.meta.env.VITE_API_URL;


export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isUpdatingRef = useRef(false);

  const fetchOrders = async () => {
    if (isUpdatingRef.current) return; 

    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Order[] = await res.json();

      setOrders(prev => {
        const map = new Map(prev.map(o => [o._id, o]));
        data.forEach(o => map.set(o._id, { ...map.get(o._id), ...o }));
        return Array.from(map.values());
      });

      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: { item: string; quantity: number }) => {
    try {
      const res = await fetch(`${API_BASE}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to add order');
      await fetchOrders();
    } catch (err) {
      console.error(err);
      setError('Failed to add order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    isUpdatingRef.current = true;

    // Optimistic update
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId ? { ...order, status } : order
      )
    );

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update order status');
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
      await fetchOrders(); // rollback to server state
    } finally {
      isUpdatingRef.current = false;
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
