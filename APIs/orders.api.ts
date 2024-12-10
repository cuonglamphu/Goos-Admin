interface OrderItem {
  product: Product;
  quantity: number;
  color: {
    name: string;
  };
  size: string;
  price: number;
}

interface Order {
  _id: string;
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
    _id: string;
  }
  items: OrderItem[];
  subtotal: number;
  coupon?: {
    code: string;
    discount: number;
  };
  total: number;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderNotes?: string;
  orderNumber: string;
  trackingNumber?: string;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  estimatedDeliveryDate?: Date;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  msg: string;
  data: Order[];
  error: any;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  imgSrc: string;
  imgHoverSrc?: string;
  brand: string;
  categoryId: string;
  colours: Array<{ name: string; colorClass: string }>;
  size: string[];
  isAvailable: boolean;
  soldOut: boolean;
  preOrder: boolean;
  isLookBookProduct: boolean;
  filterCategories: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  altText?: string;
}

const getOrders = async (): Promise<ApiResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}order`, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
        },
    });
    const data = await response.json();
    return data;
}

const updateOrderStatus = async (orderNumber: string, status: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}order/${orderNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    return response.json();
}


export { getOrders, updateOrderStatus };
export type { Order, ApiResponse, Product, OrderItem };