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
import { getAllCategory, getCateById, createCategory, updateCategory, deleteCategory } from "@/APIs/catagory.api";
// import { AddProduct } from "./add-product";
import { CategoryForm } from "./CategoryForm";

const columns = [
    {name: 'title', uid: 'title'},
    {name: 'item count', uid: 'itemCount'},
    {name: 'created at', uid: 'createdAt'},
    {name: 'ACTIONS', uid: 'actions'},
  ];

const categories = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [categories, setCategories] = useState(null);
    const [categoryForUpdate, setCategoryForUpdate] = useState(null)
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
    const handleShowDetail = async (id: string) => {
        try {
            const data = await getCateById(id);
            if (data) {
                console.log(data)
                onOpen()
                setCategoryForUpdate(data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCreateCategory = async (formdata: any) => {
        console.log('add')
        console.log(formdata);
      try {
        const result = await createCategory(formdata)
        if (result) {
          console.log(result)
          onClose()
          fetchCategories()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const handleUpdateCategory = async (formdata: any) => {
        console.log('update')
        console.log(formdata);
        try {
          const result = await updateCategory(formdata)
          if (result) {
            console.log(result)
            onClose()
            fetchCategories()
          }
        } catch (error) {
          console.error(error)
        }
    }

    const handleDeleteCategory = async (id: string) => {
        console.log(id);
        
        try {
          const result = await deleteCategory(id)
          if (result) {
            console.log(result)
            fetchCategories()
          }
        } catch (error) {
          console.error(error)
        }
    }
  
    useEffect(() => {
        fetchCategories()
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
          <span>Category</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Categories</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search categories"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <CategoryForm isOpen={isOpen} onOpenChange={onOpenChange} categoryForUpdate={categoryForUpdate || undefined} onSubmit={categoryForUpdate ? handleUpdateCategory : handleCreateCategory}/>
          <Button onPress={() => {
            onOpen()
            setCategoryForUpdate(null)
          }} color="primary">
            Add Category
          </Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        {
          categories &&
          <TableWrapper columns={columns} categories={categories} updateAction={handleShowDetail} deleteAction={handleDeleteCategory}/>
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
    categories: {
      _id: string
      title: string,
      itemCount: string,
      createdAt: string,
    }[],
    updateAction: (id: string) => Promise<void>,
    deleteAction: (id: string) => Promise<void>
  }

const TableWrapper = ({columns, categories, updateAction, deleteAction}: TableWrapperProps) => {
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
          <TableBody items={categories}>
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {RenderCell({ category: item, columnKey: columnKey, updateAction: updateAction, deleteAction: deleteAction })}
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
    category: {
        _id: string
        title: string,
        itemCount: string,
        createdAt: string,
      };
    columnKey: string | React.Key;
    updateAction: (id: string) => Promise<void>
    deleteAction: (id: string) => Promise<void>
}
  
export const RenderCell = ({ category, columnKey, updateAction, deleteAction }: Props) => {
    // @ts-ignore
    const cellValue = category[columnKey];
    switch (columnKey) {
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
                <button onClick={() => console.log("View product", category._id)}>
                  <EyeIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="Edit product" color="secondary">
                <button onClick={() => updateAction(category._id)}>
                  <EditIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip
                content="Delete product"
                color="danger"
              >
                <button onClick={() => deleteAction(category._id)}>
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

export default categories;
