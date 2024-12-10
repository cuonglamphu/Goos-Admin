interface Coupon {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    success: boolean;
    msg: string;
    data: Coupon[];
    error: any;
}

const getCoupons = async (): Promise<ApiResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}coupon`, {
        // headers: { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` },
    });
    return response.json();
}

// New function to create a coupon
const createCoupon = async (couponData: Coupon): Promise<ApiResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}coupon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // headers: { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` },
        },
        body: JSON.stringify(couponData),
    });
    return response.json();
}

const updateCoupon = async (couponData: Coupon): Promise<ApiResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}coupon/${couponData._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // headers: { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` },
        },
        body: JSON.stringify(couponData),
    });
    return response.json();
}

const createCouponCode = async (couponData: Coupon): Promise<ApiResponse> => {      
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}coupon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // headers: { Authorization: `Bearer ${localStorage.getItem('AccessToken')}` },
        },
        body: JSON.stringify(couponData),
    });
    return response.json();
}

export { getCoupons, createCoupon, updateCoupon, createCouponCode };
export type { Coupon, ApiResponse };
