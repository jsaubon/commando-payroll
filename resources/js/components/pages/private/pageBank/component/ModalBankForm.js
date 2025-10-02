import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";

import { fetchData } from "../../../../../axios";

export default function ModalBankForm(props) {
    const { toggleModalBankForm, setToggleModalBankForm } = props;
    // console.log("toggleModalBankForm", toggleModalBankForm);

    const [form] = Form.useForm();

    useEffect(() => {
        if (toggleModalBankForm.open) {
            form.setFieldsValue({
                ...toggleModalBankForm.data,
                expiration_date: toggleModalBankForm.data.expiration_date
                    ? moment(toggleModalBankForm.data.expiration_date)
                    : null
            });
        }
    }, [toggleModalBankForm.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    return (
        <Modal
            title={toggleModalBankForm.data ? "Edit Bank" : "Add Bank"}
            visible={toggleModalBankForm.open}
            onCancel={() => setToggleModalBankForm({ open: false, data: null })}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        onClick={() => {
                            form.resetFields();
                            setToggleModalBankForm({
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
                    label="Bank Name"
                    name="bank_name"
                    className="mb-15"
                    required
                >
                    <Input name="bank_name" />
                </Form.Item>
                <Form.Item
                    required
                    label="Bank Branch"
                    name="bank_branch"
                    className="mb-15"
                >
                    <Input name="bank_branch" />
                </Form.Item>
                <Form.Item
                    label="Account Name"
                    name="account_name"
                    className="mb-15"
                    required
                >
                    <Input name="account_name" />
                </Form.Item>
                <Form.Item
                    label="Account Type"
                    name="account_type"
                    className="mb-15"
                    required
                >
                    <Select name="account_type" required>
                        <Select.Option value="Checking Accounts">
                            Checking Accounts
                        </Select.Option>
                        <Select.Option value="Savings Accounts">
                            Savings Accounts
                        </Select.Option>
                        <Select.Option value="Money Market Accounts">
                            Money Market Accounts
                        </Select.Option>
                        <Select.Option value="Certificates of Deposit (CDs)">
                            Certificates of Deposit (CDs)
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Account Number"
                    required
                    name="account_number"
                    className="mb-15"
                >
                    <Input name="account_number" />
                </Form.Item>
                <Form.Item
                    label="Expiration Date"
                    name="expiration_date"
                    className="mb-15"
                    required
                >
                    <DatePicker name="expiration_date" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
