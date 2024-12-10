import {
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
  } from "@nextui-org/react";
  import React, { useEffect, useState } from "react";
  export interface Colour {
    name: string;
    colorClass: string;
    imgSrc: string;
    oldPrice?: number;
    price?: number;
  }
  
  export interface ProductFormData {
    categoryId: string;
    title: string;
    oldPrice: number;
    price: number;
    colours: Colour[];
    imgSrc: string;
    imgHoverSrc: string;
    altText: string;
    size: string[];
    filterCategories: string[];
    brand: string;
    isAvailable: boolean;
    description: string;
    soldOut: boolean;
    preOrder: boolean;
    isLookBookProduct: boolean;
  }
  
  export interface ProductFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    productForUpdate?: ProductFormData,
    onSubmit: (formdata: any) => Promise<void>
  }
  
  const defaultValueProductForm: ProductFormData = {
    categoryId: "",
    title: "",
    oldPrice: 0,
    price: 0,
    colours: [
      { name: "", colorClass: "", imgSrc: "", oldPrice: 0, price: 0 },
    ],
    imgSrc: "",
    imgHoverSrc: "",
    altText: "",
    size: [],
    filterCategories: [],
    brand: "",
    isAvailable: true,
    description: "",
    soldOut: false,
    preOrder: false,
    isLookBookProduct: false,
  }

  export const AddProduct = ({isOpen, onOpenChange, productForUpdate, onSubmit}: ProductFormProps) => {
      const [formData, setFormData] = useState<ProductFormData>({
        categoryId: "",
        title: "",
        oldPrice: undefined,
        price: 0,
        colours: [
          { name: "", colorClass: "", imgSrc: "", oldPrice: undefined, price: undefined },
        ],
        imgSrc: "",
        imgHoverSrc: "",
        altText: "",
        size: [],
        filterCategories: [],
        brand: "",
        isAvailable: true,
        description: "",
        soldOut: false,
        preOrder: false,
        isLookBookProduct: false,
      });
    
      const handleInputChange = (
        field: keyof ProductFormData,
        value: string | boolean | string[] | number | undefined
      ) => {
        setFormData({ ...formData, [field]: value });
      };
    
      const handleColourChange = (
        index: number,
        field: keyof Colour,
        value: string | number | undefined
      ) => {
        const updatedColours = [...formData.colours];
        updatedColours[index] = { ...updatedColours[index], [field]: value };
        setFormData({ ...formData, colours: updatedColours });
      };
    
      const handleAddColour = () => {
        setFormData({
          ...formData,
          colours: [
            ...formData.colours,
            { name: "", colorClass: "", imgSrc: "", oldPrice: undefined, price: undefined },
          ],
        });
      };
      
      const handleSubmit = async () => {
        // Here you can handle form submission, e.g., send data to your API
        onSubmit(formData)
      };
      
      useEffect(() => {
        if (productForUpdate) {
          setFormData(productForUpdate)
        }else{
          setFormData(defaultValueProductForm)
        }
      }, [productForUpdate])
      
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
                    {productForUpdate  ? 'Update Product' : 'Add Product'}
                  </ModalHeader>
                  <ModalBody>
                  <Input
                label="Category ID"
                value={formData.categoryId}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Old Price"
                type="number"
                value={formData.price !== 0 ? formData.price.toString() : undefined}
                onChange={(e) =>
                  handleInputChange("oldPrice", e.target.value && parseFloat(e.target.value))
                }
                variant="bordered"
                fullWidth
              />
              <Input
                label="Price"
                type="number"
                value={formData.price !== 0 ? formData.price.toString() : undefined}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                variant="bordered"
                fullWidth
                required
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Image Source"
                value={formData.imgSrc}
                onChange={(e) => handleInputChange("imgSrc", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Image Hover Source"
                value={formData.imgHoverSrc}
                onChange={(e) => handleInputChange("imgHoverSrc", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Alt Text"
                value={formData.altText}
                onChange={(e) => handleInputChange("altText", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <CheckboxGroup
                label="Sizes"
                value={formData.size}
                orientation="horizontal"
                onChange={(value: string[]) => handleInputChange("size", value)}
              >
                <Checkbox value="S">S</Checkbox>
                <Checkbox value="M">M</Checkbox>
                <Checkbox value="L">L</Checkbox>
                <Checkbox value="XL">XL</Checkbox>
                <Checkbox value="2XL">2XL</Checkbox>
              </CheckboxGroup>
              <CheckboxGroup
                label="Filter Categories"
                value={formData.filterCategories}
                orientation="horizontal"
                onChange={(value: string[]) => handleInputChange("filterCategories", value)}
              >
                <Checkbox value="Best seller">Best seller</Checkbox>
                <Checkbox value="On Sale">On Sale</Checkbox>
              </CheckboxGroup>
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <div className="flex gap-3">

                <Checkbox
                    isSelected={formData.isAvailable}
                    onChange={(checked: boolean) => handleInputChange("isAvailable", checked)}
                >
                    Available
                </Checkbox>
                <Checkbox
                    isSelected={formData.soldOut}
                    onChange={(checked: boolean) => handleInputChange("soldOut", checked)}
                >
                    Sold Out
                </Checkbox>
                <Checkbox
                    isSelected={formData.preOrder}
                    onChange={(checked: boolean) => handleInputChange("preOrder", checked)}
                >
                    Pre-Order
                </Checkbox>
                <Checkbox
                    isSelected={formData.isLookBookProduct}
                    onChange={(checked: boolean) => handleInputChange("isLookBookProduct", checked)}
                >
                    Lookbook Product
                </Checkbox>
              </div>
              <div>
                <h3>Colours</h3>
                {formData.colours.map((colour, index) => (
                  <div key={index} className="mb-2 grid grid-cols-2 grid-flow-row gap-3">
                    <Input
                      label="Colour Name"
                      value={colour.name}
                      onChange={(e) => handleColourChange(index, "name", e.target.value)}
                      variant="bordered"
                      fullWidth
                    />
                    <Input
                      label="Colour Class"
                      value={colour.colorClass}
                      onChange={(e) => handleColourChange(index, "colorClass", e.target.value)}
                      variant="bordered"
                      fullWidth
                    />
                    <Input
                      label="Image Source"
                      value={colour.imgSrc}
                      onChange={(e) => handleColourChange(index, "imgSrc", e.target.value)}
                      variant="bordered"
                      fullWidth
                    />
                    <Input
                      label="Old Price"
                      type="number"
                      value={colour.oldPrice ?? ""}
                      onChange={(e) =>
                        handleColourChange(index, "oldPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      variant="bordered"
                      fullWidth
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={colour.price ?? ""}
                      onChange={(e) =>
                        handleColourChange(index, "price", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      variant="bordered"
                      fullWidth
                    />
                  </div>
                ))}
                <Button onPress={handleAddColour} variant="ghost">
                  Add Colour
                </Button>
              </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                      {productForUpdate  ? 'Update Product' : 'Add Product'}
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
  