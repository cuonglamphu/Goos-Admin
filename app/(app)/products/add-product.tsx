import { getAllCategory } from "@/APIs/catagory.api";
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
  import React, { ChangeEvent, useEffect, useState } from "react";
  import Select from "@/components/Select"

  export interface Colour {
    name: string;
    colorClass: string;
    imgSrc: string;
    oldPrice: number;
    price: number;
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
    productForUpdate: ProductFormData | null,
    onSubmit: (formdata: any) => Promise<void>
  }
  
  type Category = {
    _id: string
    title: string,
    itemCount: string,
    createdAt: string,
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
      const [formData, setFormData] = useState<ProductFormData>(defaultValueProductForm);
      const [categories, setCategories] = useState<Category[] | null>(null);
      const fetchCategories = async () => {
          try {
              const data = await getAllCategory();
              if (data) {
                  setCategories(data.data)
              }
          } catch (error) {
              console.error(error);
          }
      }
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
            ...formData.colours ,
            { name: "", colorClass: "", imgSrc: "", oldPrice: 0, price: 0 },
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
      
      useEffect(() => {
        fetchCategories()
      }, [])
      
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
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                variant="bordered"
                fullWidth
              />
              <Input
                label="Old Price"
                type="number"
                value={productForUpdate ? formData.oldPrice.toString() : undefined}
                onChange={(e) =>
                  handleInputChange("oldPrice", e.target.value && parseFloat(e.target.value))
                }
                variant="bordered"
                fullWidth
              />
              <Input  
                label="Price"
                type="number"
                value={productForUpdate ? formData.price.toString() : undefined}
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
              <Select options={categories} label={'Category'} onSelect={handleInputChange}/>
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("isAvailable", e.target.checked)}
                >
                    Available
                </Checkbox>
                <Checkbox
                    isSelected={formData.soldOut}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("soldOut", e.target.checked)}
                >
                    Sold Out
                </Checkbox>
                <Checkbox
                    isSelected={formData.preOrder}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("preOrder", e.target.checked)}
                >
                    Pre-Order
                </Checkbox>
                <Checkbox
                    isSelected={formData.isLookBookProduct}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("isLookBookProduct", e.target.checked)}
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
                      value={productForUpdate ? colour.oldPrice.toString() : undefined}
                      onChange={(e) =>
                        handleColourChange(index, "oldPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      variant="bordered"
                      fullWidth
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={productForUpdate ? colour.price.toString() : undefined}
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
  