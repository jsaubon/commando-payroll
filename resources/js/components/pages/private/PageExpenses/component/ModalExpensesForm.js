import React, { useEffect } from "react";
import { Button, Form, Input, Modal, notification } from "antd";

import { fetchData } from "../../../../../axios";

export default function ModalExpensesForm(props) {
    const {
        toggleModalExpensesForm,
        setToggleModalExpensesForm,
        refreshExpenses
    } = props;
    const [form] = Form.useForm();
    const [formLoadingExpenses, setFormLoadingExpenses] = React.useState(false);

    const onFinish = values => {
        // console.log("Success:", values);

        let data = {
            ...values,
            id: toggleModalExpensesForm.data?.id || ""
        };

        fetchData("POST", "api/expenses", data)
            .then(res => {
                // console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Expense",
                        description: res.message
                    });
                    setFormLoadingExpenses(false);
                    refreshExpenses();

                    setToggleModalExpensesForm({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notification.error({
                    message: "Expense",
                    description: err.message
                });
                setFormLoadingExpenses(false);
            });
        setFormLoadingExpenses(false);
    };

    useEffect(() => {
        if (toggleModalExpensesForm.open) {
            form.setFieldsValue({
                ...toggleModalExpensesForm.data
            });
        }
    }, [toggleModalExpensesForm.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    return (
        <Modal
            title={
                toggleModalExpensesForm.data ? "Edit Expense" : "Add Expense"
            }
            afterClose={() => form.resetFields()}
            visible={toggleModalExpensesForm.open}
            onCancel={() =>
                setToggleModalExpensesForm({ open: false, data: null })
            }
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        disabled={formLoadingExpenses}
                        onClick={() => {
                            form.resetFields();
                            setToggleModalExpensesForm({
                                open: false,
                                data: null
                            });
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        key="submit"
                        type="primary"
                        shape="square"
                        size="medium"
                        onClick={() => form.submit()}
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Form.Item
                    label="Expense Name"
                    name="expense_name"
                    className="mb-15"
                    required
                >
                    <Input name="expense_name" />
                </Form.Item>
                <Form.Item
                    required
                    label="Expense Description"
                    name="expense_description"
                    className="mb-15"
                >
                    <Input name="expense_description" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
