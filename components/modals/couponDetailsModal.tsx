import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";
import type { Coupon } from "@/APIs/coupon.api";
import { format } from "date-fns";

interface CouponDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onStatusChange: (couponId: string, newStatus: boolean) => void; // Update to accept boolean for isEnabled
}

const couponDetailsModal = ({ isOpen, onClose, coupon, onStatusChange }: CouponDetailsModalProps) => {
  if (!coupon) return null;
    console.log(coupon);
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      className="bg-white shadow-lg rounded-lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h2 className="text-xl font-bold">Coupon Details #{coupon.code}</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold mb-2">Coupon Information</h3>
              <p>Code: <span className="font-medium">{coupon.code}</span></p>
              <p>Type: <span className="font-medium">{coupon.type}</span></p>
              <p>Value: <span className="font-medium">${coupon.value.toFixed(2)}</span></p>
              <p>Min Purchase: <span className="font-medium">${coupon.minPurchase.toFixed(2)}</span></p>
              <p>Max Discount: <span className="font-medium">${coupon.maxDiscount.toFixed(2)}</span></p>
              <p>Start Date: <span className="font-medium">{format(new Date(coupon.startDate), 'dd/MM/yyyy')}</span></p>
              <p>End Date: <span className="font-medium">{format(new Date(coupon.endDate), 'dd/MM/yyyy')}</span></p>
              <p>Usage Count: <span className="font-medium">{coupon.usedCount}</span></p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold mb-2">Coupon Status</h3>
              <Select
                label="Is Enabled"
                className="max-w-xs"
                value={coupon.isActive ? 'true' : 'false'}
                onChange={(e) => onStatusChange(coupon._id, e.target.value == 'true')}
              >
                <SelectItem key="true" value="true">Enabled</SelectItem>
                <SelectItem key="false" value="false">Disabled</SelectItem>
              </Select>
            </div>
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

export default couponDetailsModal; 