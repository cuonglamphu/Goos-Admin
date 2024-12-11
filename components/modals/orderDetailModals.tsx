import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";
import type { Order } from "@/APIs/orders.api";
import { format } from "date-fns";
import type { OrderItem } from "@/APIs/orders.api";
interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const OrderDetailsModal = ({ isOpen, onClose, order, onStatusChange }: OrderDetailsModalProps) => {
  if (!order) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Order Details #{order.orderNumber}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>Name: {order.userId?.firstName} {order.userId?.lastName}</p>
              <p>Order Date: {order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</p>
              <p>Total Amount: ${order.total ? order.total?.toFixed(2) : 'N/A'}</p>
              <p>Payment Status: <span className="font-bold text-green-500">{order.paymentStatus}</span></p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Status</h3>
              <Select
                label="Status"
                defaultSelectedKeys={[order.status? order.status : 'N/A' as Order['status']]}
                className="max-w-xs"
                onChange={(e) => onStatusChange(order.orderNumber, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Products</h3>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: OrderItem) => (
                  <tr key={item.product._id} className="border-b">
                    <td className="py-2">{item.product.title}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">${item.product.price.toFixed(2)}</td>
                    <td className="py-2">${(item.quantity * item.product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;