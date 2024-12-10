'use client';

import { useEffect, useState, useMemo } from 'react';
import { getOrders, updateOrderStatus } from '@/APIs/orders.api';
import type { Order } from '@/APIs/orders.api';
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import Link from "next/link";
import { format, isToday, isYesterday, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import OrderDetailsModal from '@/components/modals/orderDetailModals';

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const ordersPerPage = 20;
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                console.log(response)
                if (response.success) {
                    console.log(response.data)
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        const now = new Date();

        if (filter === 'today') {
            filtered = orders.filter(order => isToday(new Date(order.createdAt)));
        } else if (filter === 'yesterday') {
            filtered = orders.filter(order => isYesterday(new Date(order.createdAt)));
        } else if (filter === 'thisWeek') {
            filtered = orders.filter(order => isWithinInterval(new Date(order.createdAt), { start: startOfWeek(now), end: now }));
        } else if (filter === 'thisMonth') {
            filtered = orders.filter(order => isWithinInterval(new Date(order.createdAt), { start: startOfMonth(now), end: now }));
        }
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders, filter]);

    const handleSearch = () => {
        if (searchTerm) {
            return filteredOrders.filter(order => 
                order.orderNumber.includes(searchTerm) || 
                `${order.userId?.firstName} ${order.userId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filteredOrders;
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Order Number', 'Date', 'Customer', 'Total', 'Status', 'Payment'],
            ...filteredOrders.map(order => [
                order.orderNumber,
                format(new Date(order.createdAt), 'dd/MM/yyyy'),
                `${order.userId?.firstName} ${order.userId?.lastName}`,
                order.total.toFixed(2),
                order.status,
                order.paymentStatus
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ordersPerPage;
        return handleSearch().slice(startIndex, startIndex + ordersPerPage);
    }, [currentPage, searchTerm, filteredOrders]);

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            confirmed: 'bg-cyan-500',
            pending: 'bg-yellow-500',
            processing: 'bg-blue-500',
            shipped: 'bg-purple-500',
            delivered: 'bg-green-500',
            cancelled: 'bg-red-500',
        };
        return colors[status];
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (orderNumber: string, newStatus: string) => {
        try {
            const response = await updateOrderStatus(orderNumber, newStatus);
            if (response.success) {
                setOrders(orders.map(order => 
                    order.orderNumber === orderNumber ? { ...order, status: newStatus as Order['status'] } : order
                ));
            }
            console.log(`Updating order ${orderNumber} status to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            {/* Breadcrumb */}
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon />
                    <Link href="/">
                        <span>Home</span>
                    </Link>
                    <span> / </span>
                </li>
                <li className="flex gap-2">
                    <span>Orders</span>
                </li>
            </ul>

            {/* Header */}
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="p-2" onClick={exportToCSV}>
                        <ExportIcon />
                    </button>
                </div>
            </div>

            {/* Filter Options */}
            <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                    <select 
                        className="px-4 py-2 rounded-lg border border-default-200 bg-default-50 text-default-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="w-full overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left">Order Number</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">Loading...</td>
                            </tr>
                        ) : (
                            paginatedOrders.map((order) => (
                                <tr key={order._id} className="border-b">
                                    <td className="px-4 py-3">#{order.orderNumber}</td>
                                    <td className="px-4 py-3">
                                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            `${order.userId?.firstName} ${order.userId?.lastName}`
                                        }
                                    </td>
                                    <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                            order.paymentStatus === 'completed'
                                                ? 'bg-green-500'
                                                : order.paymentStatus === 'failed'
                                                ? 'bg-red-500'
                                                : 'bg-yellow-500'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => handleViewOrderDetails(order)}
                                            className="px-3 py-1 text-primary-500 hover:text-primary-700 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                
                <span className="px-4 py-2 rounded-lg bg-default-100 text-default-900">
                    Page {currentPage} / {Math.ceil(filteredOrders.length / ordersPerPage)}
                </span>
                
                <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={paginatedOrders.length < ordersPerPage}
                    className="px-4 py-2 rounded-lg bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>

            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default OrdersPage;