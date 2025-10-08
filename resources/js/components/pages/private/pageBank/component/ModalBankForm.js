import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    notification,
    Select
} from "antd";

import { fetchData } from "../../../../../axios";
import moment from "moment";
import validateRules from "../../../../validateRules";
import { notificationErrors } from "../../../../notificationErrors";

export default function ModalBankForm(props) {
    const { toggleModalBankForm, setToggleModalBankForm, refreshBanks } = props;
    // console.log("toggleModalBankForm", toggleModalBankForm);

    const [form] = Form.useForm();
    const [formLoadingBank, setFormLoadingBank] = useState(false);

    const onFinish = values => {
        let data = {
            ...values,
            id: toggleModalBankForm.data?.id || "",
            expiration_date: values.expiration_date
                ? moment(values.expiration_date).format("YYYY-MM-DD")
                : ""
        };

        fetchData("POST", "api/banks", data)
            .then(res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Bank",
                        description: res.message
                    });
                    setFormLoadingBank(false);
                    refreshBanks();

                    setToggleModalBankForm({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notificationErrors(err);
                // err,
            });
        setFormLoadingBank(false);
    };

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
            onCancel={() => {
                setToggleModalBankForm({
                    open: false,
                    data: null
                });
                form.resetFields();
            }}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        onClick={() => {
                            setToggleModalBankForm({
                                open: false,
                                data: null
                            });
                            form.resetFields();
                        }}
                        key={1}
                        disabled={formLoadingBank}
                    >
                        Close
                    </Button>
                    <Button
                        key="submit"
                        onClick={() => form.submit()}
                        type="primary"
                        shape="square"
                        size="medium"
                        loading={formLoadingBank}
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        label="Bank Name"
                        name="bank_name"
                        className="mb-15"
                        required
                        rules={[validateRules.required()]}
                    >
                        <Input name="bank_name" />
                    </Form.Item>
                    <Form.Item
                        required
                        label="Bank Branch"
                        name="bank_branch"
                        className="mb-15"
                        rules={[validateRules.required()]}
                    >
                        <Input name="bank_branch" />
                    </Form.Item>
                    <Form.Item
                        label="Account Name"
                        name="account_name"
                        className="mb-15"
                        required
                        rules={[validateRules.required()]}
                    >
                        <Input name="account_name" />
                    </Form.Item>
                    <Form.Item
                        label="Account Type"
                        name="account_type"
                        className="mb-15"
                        rules={[validateRules.required()]}
                        required
                    >
                        <Select
                            name="account_type"
                            required
                            allowClear
                            rules={[validateRules.required()]}
                        >
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
                        rules={[validateRules.required()]}
                    >
                        <Input
                            name="account_number"
                            onKeyDown={event => {
                                const allowedKeys = /[0-9.-]/;
                                const controlKeys = ["Backspace", "Delete"];
                                if (
                                    !allowedKeys.test(event.key) &&
                                    !controlKeys.includes(event.key)
                                ) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Expiration Date"
                        name="expiration_date"
                        className="mb-15"
                        required
                        rules={[validateRules.required()]}
                    >
                        <DatePicker
                            name="expiration_date"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>
            </Form>
        </Modal>
    );
}
