import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification } from "antd";

import { fetchData } from "../../../../../axios";

export default function ModalDepositsForm(props) {
    const {
        toggleModalDepositsForm,
        setToggleModalDepositsForm,
        refreshDeposits
    } = props;

    const [formLoadingDeposits, setFormLoadingDeposits] = useState(false);

    const onFinish = values => {
        // console.log("Success:", values);

        let data = {
            ...values,
            id: toggleModalDepositsForm.data?.id || ""
        };

        fetchData("POST", "api/deposits", data)
            .then(res => {
                // console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Deposit",
                        description: res.description
                    });
                    setFormLoadingDeposits(false);
                    refreshDeposits();

                    setToggleModalDepositsForm({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notification.error({
                    message: "Deposit",
                    description: err.message
                });
                setFormLoadingDeposits(false);
            });
        setFormLoadingDeposits(false);
    };

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
                        disabled={formLoadingDeposits}
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
                        onClick={() => form.submit()}
                        loading={formLoadingDeposits}
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form} onFinish={onFinish}>
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
