import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";

export default function ModalDepositsForm(props) {
    const { toggleModalDepositsForm, setToggleModalDepositsForm } = props;

    const [form] = Form.useForm();
    useEffect(() => {
        if (toggleModalDepositsForm.open) {
            form.setFieldsValue({
                ...toggleModalDepositsForm.data
            });
        }
    }, [toggleModalDepositsForm.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    return (
        <Modal
            title={
                toggleModalDepositsForm.data ? "Edit Deposit" : "Add Deposit"
            }
            visible={toggleModalDepositsForm.open}
            onCancel={() =>
                setToggleModalDepositsForm({ open: false, data: null })
            }
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        onClick={() => {
                            form.resetFields();
                            setToggleModalDepositsForm({
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
                    label="Deposit  Name"
                    name="deposit_name"
                    className="mb-15"
                    required
                >
                    <Input name="deposit_name" />
                </Form.Item>
                <Form.Item
                    required
                    label="Deposit  Description"
                    name="deposit_description"
                    className="mb-15"
                >
                    <Input name="deposit_description" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
