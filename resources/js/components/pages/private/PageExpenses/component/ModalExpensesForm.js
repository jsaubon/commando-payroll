import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";

export default function ModalExpensesForm(props) {
    const { toggleModalExpensesForm, setToggleModalExpensesForm } = props;
    const [form] = Form.useForm();

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
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form}>
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
