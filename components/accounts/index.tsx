"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
// import { TableWrapper } from "@/components/table/table";
import { TableWrapper } from "../../components/service/table";
import { AddUser } from "./add-user";
import { getAllUser } from "@/APIs/user.api";


export type UserProps = {
  _id: string
  name: string,
  email: string,
  createdAt: string,
}

type UserFetch = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: string
}

const columns = [
  {name: 'NAME', uid: 'name'},
  {name: 'EMAIL', uid: 'email'},
  {name: 'CREATED AT', uid: 'createdAt'},
  {name: 'ACTIONS', uid: 'actions'},
];

export const Accounts = () => {
  const [accounts, setAccounts] = useState<UserProps[] | null>(null);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getAllUser()
        if (data) {
          const formattedData = data.map((item: UserFetch) => ({name: item.firstName + " " + item.lastName, email: item.email, _id: item._id, createdAt: item.createdAt}))
          console.log(data)
          setAccounts(formattedData)
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAccount()
  },[])

  if (accounts) {
    console.log(accounts)
  }
  
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
          <span>Users</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Accounts</h3>
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
          <AddUser />
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        {
          accounts &&
          <TableWrapper columns={columns} users={accounts}/>
        }
      </div>
    </div>
  );
};