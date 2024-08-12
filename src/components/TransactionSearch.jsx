import React, { useRef, useState, useEffect } from "react";
import { Table, Select, Radio, Menu, Dropdown } from "antd";
import search from "../assets/search.svg";
import { EllipsisOutlined } from "@ant-design/icons";
// import { parse } from "papaparse";
import { toast } from "react-toastify";
import DeleteConfirmation from "./Modals/DeleteConfirmation";
import EditTransaction from "./Modals/EditTransaction";
import {
  saveTransactionsToStorage,
  getTransactionsFromStorage,
} from "../utils/storage";
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
  dispatch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [localTransactions, setLocalTransactions] = useState(
    getTransactionsFromStorage()
  );

  // eslint-disable-next-line
  const fileInput = useRef();

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const handleMenuClick = (record, { key }) => {
    if (key === "edit") {
      setTransactionToEdit(record);
      setIsEditModalVisible(true);
    } else if (key === "delete") {
      setTransactionToDelete(record);
      setIsModalVisible(true);
    }
  };

  const handleEditFinish = (updatedTransaction) => {
    const updatedTransactions = localTransactions.map((transaction) =>
      transaction.key === updatedTransaction.key
        ? { ...transaction, ...updatedTransaction }
        : transaction
    );

    setLocalTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);

    dispatch({ type: "EDIT_TRANSACTION", payload: updatedTransaction });

    toast.success("Transaction updated successfully");
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      const updatedTransactions = localTransactions.filter(
        (transaction) => transaction.key !== transactionToDelete.key
      );
      setLocalTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);

      dispatch({ type: "DELETE_TRANSACTION", payload: transactionToDelete });
      toast.success("Transaction deleted successfully");
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(info) => handleMenuClick(record, info)}>
              <Menu.Item key="edit">Edit</Menu.Item>
              <Menu.Item key="delete">Delete</Menu.Item>
            </Menu>
          }
        >
          <EllipsisOutlined style={{ cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: transaction.id || index,
    ...transaction,
  }));

  return (
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={search} alt="Image2" width="16" />
          <input
            placeholder="Search by Description"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportToCsv}>
              Export to CSV
            </button>
          </div>
        </div>

        <Table columns={columns} dataSource={dataSource} />
      </div>
      <DeleteConfirmation
        visible={isModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
      />
      {transactionToEdit && (
        <EditTransaction
          isEditModalVisible={isEditModalVisible}
          handleEditCancel={() => setIsEditModalVisible(false)}
          onEditFinish={handleEditFinish}
          transaction={transactionToEdit}
        />
      )}
    </div>
  );
};

export default TransactionSearch;
