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
  interface CategoryFormData {
    _id?: string;
    imgSrc: string;
    altText: string;
    title: string;
    itemCount: string;
  }
  
  
  export interface ProductFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    categoryForUpdate?: CategoryFormData,
    onSubmit: (formdata: any) => Promise<void>
  }
  
  const defaultValueCategoryForm: CategoryFormData = {
    imgSrc: "",
    altText: "",
    title: "",
    itemCount: "",
  }

  export const CategoryForm = ({isOpen, onOpenChange, categoryForUpdate, onSubmit}: ProductFormProps) => {
      const [formData, setFormData] = useState<CategoryFormData>(defaultValueCategoryForm);
    
      const handleInputChange = (key: keyof CategoryFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
      };
    
      const handleSubmit = () => {
        console.log("Form Submitted: ", formData);
        onSubmit(formData)
      };
      
      useEffect(() => {
        if (categoryForUpdate) {
          setFormData(categoryForUpdate)
        }else{
          setFormData(defaultValueCategoryForm)
        }
      }, [categoryForUpdate])
      
    return (
      <div>
        <>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            size="3xl"
            className="max-h-full overflow-scroll"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {categoryForUpdate  ? 'Update Category' : 'Add Category'}
                  </ModalHeader>
                  <ModalBody>
                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            variant="bordered"
                            fullWidth
                        />
                        <Input
                            variant="bordered"
                            label="Image Source"
                            value={formData.imgSrc}
                            onChange={(e) => handleInputChange("imgSrc", e.target.value)}
                            fullWidth
                        />
                        <Input
                            variant="bordered"
                            label="Alt Text"
                            value={formData.altText}
                            onChange={(e) => handleInputChange("altText", e.target.value)}
                            fullWidth
                        />
                        <Input
                            variant="bordered"
                            label="Item Count"
                            value={formData.itemCount}
                            onChange={(e) => handleInputChange("itemCount", e.target.value)}
                            fullWidth
                        />
                    </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                      {categoryForUpdate  ? 'Update Product' : 'Add Product'}
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
  