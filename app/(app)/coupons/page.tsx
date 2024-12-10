'use client';

import { getCoupons, createCoupon, updateCoupon } from '@/APIs/coupon.api';
import { useEffect, useState } from 'react';
import { Coupon } from '@/APIs/coupon.api';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import CouponDetailsModal from '@/components/modals/couponDetailsModal';
const CouponsPage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({ code: '', type: '', value: 0, minPurchase: 0, maxDiscount: 0, startDate: '', endDate: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchCoupons = async () => {
            const data = await getCoupons();
            setCoupons(data.data as Coupon[]); // Assuming the response structure
            setLoading(false);
        };
        fetchCoupons();
    }, []);

    const handleCreateCoupon = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessages({});

        const newErrors: { [key: string]: string } = {};

        // Validate coupon data
        if (!newCoupon.type) {
            newErrors.type = 'Type must be selected';
        }
        if (newCoupon.value <= 0) {
            newErrors.value = 'Value must be greater than 0';
        }
        if (newCoupon.minPurchase < 0) {
            newErrors.minPurchase = 'Min Purchase cannot be negative';
        }
        if (newCoupon.maxDiscount < 0) {
            newErrors.maxDiscount = 'Max Discount cannot be negative';
        }
        if (new Date(newCoupon.startDate) >= new Date(newCoupon.endDate)) {
            newErrors.date = 'Start Date must be before End Date';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrorMessages(newErrors);
            return;
        }

        try {
            const response = await createCoupon(newCoupon as Coupon);
            if (response.success) {
                setCoupons([...coupons]); // Add the new coupon to the list
                setNewCoupon({ code: '', type: '', value: 0, minPurchase: 0, maxDiscount: 0, startDate: '', endDate: '' }); // Reset form
                setErrorMessages({});
                // reload the page
                window.location.reload();
            } else {
                setErrorMessages({ server: response.msg });
            }
        } catch (error) {
            setErrorMessages({ server: 'Error creating coupon: ' + error });
        }
    };

    const handleViewCouponDetails = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsDetailsModalOpen(true);
    };

    const handleStatusChange = async (couponId: string, newStatus: Boolean  ) => {
        const updatedCoupon = { ...coupons.find(coupon => coupon._id === couponId), isActive: newStatus };
        console.log(newStatus);
        console.log("updatedCoupon", updatedCoupon);
        const response = await updateCoupon(updatedCoupon as Coupon);
        console.log(response);
        if (response.success) {
            setCoupons(coupons.map(coupon => (coupon._id === couponId ? updatedCoupon : coupon)) as Coupon[]);
        } else {
            console.error(response.msg);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Coupon Management</h1>
            <div className="w-full overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Value</th>
                            <th className="px-4 py-3 text-left">Min Purchase</th>
                            <th className="px-4 py-3 text-left">Max Discount</th>
                            <th className="px-4 py-3 text-left">Start Date</th>
                            <th className="px-4 py-3 text-left">End Date</th>
                            <th className="px-4 py-3 text-left">Usage Count</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon._id} className={`border-b ${coupon.isActive ? 'border-green-500' : 'bg-red-500'}`}>
                                <td className="px-4 py-3">{coupon.code}</td>
                                <td className="px-4 py-3">{coupon.type}</td>
                                <td className="px-4 py-3">{coupon.value}</td>
                                <td className="px-4 py-3">{coupon.minPurchase}</td>
                                <td className="px-4 py-3">{coupon.maxDiscount}</td>
                                <td className="px-4 py-3">{new Date(coupon.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{new Date(coupon.endDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{coupon.usedCount}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleViewCouponDetails(coupon)} className="text-primary-500 hover:text-primary-700 transition-colors">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className="text-xl font-semibold mb-4 mt-8">Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
                {/* Xóa trường nhập liệu cho mã coupon */}
                {/* <Input
                    label="Code"
                    placeholder="Enter coupon code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    required
                /> */}
                {/* {errorMessages.code && <p className="text-red-500">{errorMessages.code}</p>} */}
                
                <Select
                    label="Type"
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    required
                >
                    <SelectItem key="" value="">Select Type</SelectItem>
                    <SelectItem key="percentage" value="percentage">Percentage</SelectItem>
                    <SelectItem key="fixed" value="fixed">Fixed</SelectItem>
                </Select>
                {errorMessages.type && <p className="text-red-500">{errorMessages.type}</p>}
                
                <Input
                    label="Value"
                    type="number"
                    placeholder="Enter value"
                    value={newCoupon.value as unknown as string}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })}
                    required
                />
                {errorMessages.value && <p className="text-red-500">{errorMessages.value}</p>}
                
                <Input
                    label="Min Purchase"
                    type="number"
                    placeholder="Enter minimum purchase"
                    value={newCoupon.minPurchase as unknown as string}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: parseFloat(e.target.value) })}
                    required
                />
                {errorMessages.minPurchase && <p className="text-red-500">{errorMessages.minPurchase}</p>}
                
                <Input
                    label="Max Discount"
                    type="number"
                    placeholder="Enter maximum discount"
                    value={newCoupon.maxDiscount as unknown as string}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: parseFloat(e.target.value) })}
                    required
                />
                {errorMessages.maxDiscount && <p className="text-red-500">{errorMessages.maxDiscount}</p>}
                
                <Input
                    label="Start Date"
                    type="date"
                    value={newCoupon.startDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                    required
                />
                <Input
                    label="End Date"
                    type="date"
                    value={newCoupon.endDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                    required
                />
                {errorMessages.date && <p className="text-red-500">{errorMessages.date}</p>}
                
                <Button type="submit" color="primary">Create Coupon</Button>
            </form>

            <CouponDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                coupon={selectedCoupon}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}

export default CouponsPage;