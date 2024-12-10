"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { User, Tooltip, Chip } from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { getAllProduct, getProdById, createProduct, updateProduct, deleteProduct } from "@/APIs/product.api";
import { AddProduct } from "./add-product";

const columns = [
    {name: 'title', uid: 'title'},
    {name: 'old price', uid: 'oldPrice'},
    {name: 'price', uid: 'price'},
    {name: 'brand', uid: 'brand'},
    {name: 'ACTIONS', uid: 'actions'},
  ];

const products = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [products, setProducts] = useState(null);
    const [productForUpdate, setProductForUpdate] = useState(null)
    const fetchProducts = async () => {
      try {
          const data = await getAllProduct();
          if (data) {
              setProducts(data.data)
          }
      } catch (error) {
          console.error(error);
      }
  }
    const handleShowDetail = async (slug: string) => {
      try {
        const data = await getProdById(slug);
        if (data) {
          console.log(data)
          setProductForUpdate(data.data)
          onOpen()

        }
      } catch (error) {
        console.error(error)
      }
    }

    const handleCreateProduct = async (formdata: any) => {
      try {
        const result = await createProduct(formdata)
        if (result) {
          console.log(result)
          onClose()
          fetchProducts()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const handleUpdateProduct = async (formdata: any) => {
        try {
          const result = await updateProduct(formdata)
          if (result) {
            console.log(result)
            onClose()
            fetchProducts()
          }
        } catch (error) {
          console.error(error)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        console.log(id);
        
        try {
          const result = await deleteProduct(id)
          if (result) {
            console.log(result)
            fetchProducts()
          }
        } catch (error) {
          console.error(error)
        }
    }
  
    useEffect(() => {
        fetchProducts()
    }, [])


  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Product</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Products</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddProduct isOpen={isOpen} onOpenChange={onOpenChange} productForUpdate={productForUpdate ?? undefined} onSubmit={productForUpdate ? handleUpdateProduct : handleCreateProduct}/>
          <Button onPress={() => {
            onOpen()
            setProductForUpdate(null)
          }} color="primary">
            Add Product
          </Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        {
          products &&
          <TableWrapper columns={columns} products={products} updateAction={handleShowDetail} deleteAction={handleDeleteProduct}/>
        }
      </div>
    </div>
  );
};

type TableWrapperProps = {
    columns: {
      name: string,
      uid: string,
    }[],
    products: {
      _id: string
      title: string,
      oldPrice: string,
      price: string,
      brand: string,
      slug: string,
    }[],
    updateAction: (slug: string) => Promise<void>,
    deleteAction: (id: string) => Promise<void>
  }

const TableWrapper = ({columns, products, updateAction, deleteAction}: TableWrapperProps) => {
    return (
      <div className=" w-full flex flex-col gap-4">
        <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
                className="uppercase"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products}>
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {RenderCell({ product: item, columnKey: columnKey, updateAction: updateAction, deleteAction: deleteAction })}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

interface Props {
    product: {
        _id: string
        title: string,
        oldPrice: string,
        price: string,
        brand: string,
        slug: string,
    };
    columnKey: string | React.Key;
    updateAction: (slug: string) => Promise<void>
    deleteAction: (slug: string) => Promise<void>
}
  
export const RenderCell = ({ product, columnKey, updateAction, deleteAction }: Props) => {
    // @ts-ignore
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
            name={cellValue}
          >
            {product.title}
          </User>
        );
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={
              cellValue === "active"
                ? "success"
                : cellValue === "paused"
                ? "danger"
                : "warning"
            }
          >
            <span className="capitalize text-xs">{cellValue}</span>
          </Chip>
        );
  
      case "actions":
        return (
          <div className="flex items-center gap-4 ">
            <div>
              <Tooltip content="Details">
                <button onClick={() => console.log("View product", product._id)}>
                  <EyeIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="Edit product" color="secondary">
                <button onClick={() => updateAction(product.slug)}>
                  <EditIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip
                content="Delete product"
                color="danger"
              >
                <button onClick={() => deleteAction(product._id)}>
                  <DeleteIcon size={20} fill="#FF0080" />
                </button>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

export default products;
