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
import { notificationErrors } from "../../../../notificationErrors";
import validateRules from "../../../../validateRules";
import moment from "moment";

export default function ModalDepositsForm(props) {
    const {
        toggleModalDepositsForm,
        setToggleModalDepositsForm,
        refreshDeposits
    } = props;

    const [formLoadingDeposits, setFormLoadingDeposits] = useState(false);
    const [dataBanks, setDataBanks] = useState(null);
    useEffect(() => {
        fetchData("GET", "api/banks?sort=asc").then(res => {
            if (res.success) {
                setDataBanks(res.data);
            }
        });
        return () => {};
    }, []);

    const onFinish = values => {
        // console.log("Success:", values);

        let data = {
            ...values,
            id: toggleModalDepositsForm.data?.id || "",
            date_request: values.date_request
                ? moment(values.date_request).format("YYYY-MM-DD")
                : "",
            date_transaction: values.date_transaction
                ? moment(values.date_transaction).format("YYYY-MM-DD")
                : ""
        };

        fetchData("POST", "api/deposits", data)
            .then(res => {
                if (res.success) {
                    notification.success({
                        message: "Deposit",
                        description: res.message
                    });
                    refreshDeposits();
                    setToggleModalDepositsForm({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notificationErrors(err);
            });
    };

    const [form] = Form.useForm();
    useEffect(() => {
        if (toggleModalDepositsForm.open) {
            form.setFieldsValue({
                ...toggleModalDepositsForm.data,

                date_request: toggleModalDepositsForm.data?.date_request
                    ? moment(toggleModalDepositsForm.data.date_request)
                    : null,
                date_transaction: toggleModalDepositsForm.data?.date_transaction
                    ? moment(toggleModalDepositsForm.data.date_transaction)
                    : null
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
            onCancel={() => {
                setToggleModalDepositsForm({ open: false, data: null });
                form.resetFields();
            }}
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
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        label="Bank"
                        name="bank_id"
                        showSearch
                        rules={[
                            {
                                required: true,
                                message: "Please Select Bank"
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            name="bank_id"
                            required
                            label="Select Bank"
                            placeholder="Select Bank"
                            showSearch
                        >
                            {dataBanks &&
                                dataBanks.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.bank_name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Deposit Name"
                        name="deposit_name"
                        className="mb-15"
                        required
                        rules={[validateRules.required()]}
                    >
                        <Input
                            name="deposit_name"
                            placeholder="Select Deposit Name"
                        />
                    </Form.Item>
                    <Form.Item
                        required
                        label="Deposit Description"
                        name="deposit_description"
                        className="mb-15"
                        rules={[validateRules.required()]}
                    >
                        <Input
                            name="deposit_description"
                            placeholder="Deposit Description"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[validateRules.required()]}
                    >
                        <Input
                            placeholder="Amount"
                            type="numeric"
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
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="Date Request"
                        name="date_request"
                        rules={[validateRules.required()]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Date Transaction"
                        name="date_transaction"
                        rules={[validateRules.required()]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Notes" name="notes">
                        <Input.TextArea placeholder="Notes"></Input.TextArea>
                    </Form.Item>
                </Col>
            </Form>
        </Modal>
    );
}
