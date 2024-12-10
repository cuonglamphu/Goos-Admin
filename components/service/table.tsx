import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useState } from "react";
import { RenderCell } from "./render-cell";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

type TableWrapperProps = {
  columns: {
    name: string,
    uid: string,
  }[],
  users: {
    _id: string
    name: string,
    email: string,
    createdAt: string,
  }[],
  updateAction: (id: string) => Promise<void>,
  deleteAction: (id: string) => Promise<void>,
}

export const TableWrapper = ({columns, users, updateAction, deleteAction}: TableWrapperProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [idDelete, setIdDelete] = useState<string>('')
  const handleOpenModal = (id: string) => {
    setIdDelete(id)
    onOpen()
  }
  const handleDelete = () => {
    deleteAction(idDelete)
    onClose()
  }
  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ user: item, columnKey: columnKey, deleteAction: handleOpenModal, updateAction: updateAction })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmModal isOpen={isOpen} onOpenChange={onOpenChange} onSubmit={handleDelete}/>
    </div>
  );
};

export interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void
}

export function ConfirmModal({isOpen, onOpenChange, onSubmit}: ConfirmModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Do you want to delete this ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}