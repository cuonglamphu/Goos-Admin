import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type UserFormData = {
  _id?: string,
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  confirmPassword?: string
}

export interface UserFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userForUpdate?: UserFormData,
  onSubmit: (formdata: any) => Promise<void>
}

const defaultValueUserForm: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: '',
  confirmPassword: ''
}

export const AddUser = ({isOpen, onOpenChange, userForUpdate, onSubmit}: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(defaultValueUserForm)

  const handleSubmit = () => {
      onSubmit(formData)
  }

  useEffect(() => {
    if (userForUpdate) {
      setFormData(userForUpdate)
    }else{
      setFormData(defaultValueUserForm)
    }
  }, [userForUpdate])
  
  return (
    <div>
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                {userForUpdate  ? 'Update User' : 'Add User'}
                </ModalHeader>
                <ModalBody>
                  <Input label="Email" variant="bordered" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                  <Input label="First Name" variant="bordered" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
                  <Input label="Last Name" variant="bordered" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>

                  <Input label="Password" type="password" variant="bordered" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                  <Input
                    label="Confirm Password"
                    type="password"
                    variant="bordered"
                    value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                  {userForUpdate  ? 'Update User' : 'Add User'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
