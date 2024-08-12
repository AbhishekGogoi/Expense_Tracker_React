import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import moment from "moment";

const EditTransaction = ({
  isEditModalVisible,
  handleEditCancel,
  onEditFinish,
  transaction,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        description: transaction.description,
        amount: transaction.amount,
        date: moment(transaction.date),
        tag: transaction.tag,
      });
    }
  }, [transaction, form]);

  const incomeTags = [
    { label: "Salary", value: "salary" },
    { label: "Freelance", value: "freelance" },
    { label: "Investment", value: "investment" },
  ];

  const expenseTags = [
    { label: "Rent", value: "rent" },
    { label: "Groceries", value: "groceries" },
    { label: "Personal", value: "personal" },
  ];

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Edit Transaction"
      open={isEditModalVisible}
      onCancel={handleEditCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const formattedDate = values.date
            ? values.date.format("YYYY-MM-DD")
            : transaction.date;

          onEditFinish({
            ...transaction,
            ...values,
            amount: parseFloat(values.amount),
            date: formattedDate,
          });
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the description of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the transaction amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the transaction date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            {transaction?.type === "income"
              ? incomeTags.map((tag) => (
                  <Select.Option key={tag.value} value={tag.value}>
                    {tag.label}
                  </Select.Option>
                ))
              : expenseTags.map((tag) => (
                  <Select.Option key={tag.value} value={tag.value}>
                    {tag.label}
                  </Select.Option>
                ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransaction;
