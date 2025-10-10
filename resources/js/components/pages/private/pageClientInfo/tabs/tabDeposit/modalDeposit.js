import React, { useEffect, useState } from "react";
import {
    Button,
    Modal,
    Form,
    Col,
    Select,
    Input,
    notification,
    DatePicker
} from "antd";

import { fetchData } from "../../../../../../axios";
import moment from "moment";
import validateRules from "../../../../../validateRules";
import { notificationErrors } from "../../../../../notificationErrors";

export default function ModalDeposit(props) {
    const {
        togglemodalDeposit,
        setTogglemodalDeposit,
        client_id,
        refreshClientDeposits
    } = props;

    const [form] = Form.useForm();
    const [dataDeposit, setDataDeposit] = useState(null);
    const [formLoadingClientDeposit, setFormLoadingClientDeposit] = useState(
        false
    );
    // console.log(dataDeposit);

    useEffect(() => {
        fetchData("GET", "api/deposits?sort=asc").then(res => {
            if (res.success) {
                setDataDeposit(res.data);
            }
        });
        return () => {};
    }, []);

    const onFinish = values => {
        let data = {
            ...values,
            id: togglemodalDeposit.data ? togglemodalDeposit.data.id : null,
            client_id: client_id,
            date: values.date ? moment(values.date).format("YYYY-MM-DD") : ""
        };

        fetchData("POST", "api/client_deposits", data)
            .then(res => {
                if (res.success) {
                    notification.success({
                        message: "Deposit",
                        description: res.message
                    });

                    refreshClientDeposits();
                    setTogglemodalDeposit({ open: false, data: null });
                    form.resetFields();
                    setFormLoadingClientDeposit(false);
                }
            })
            .catch(err => {
                notificationErrors(err);
            });
        setFormLoadingClientDeposit(true);
    };

    useEffect(() => {
        if (togglemodalDeposit.open) {
            form.setFieldsValue({
                ...togglemodalDeposit.data,
                date: togglemodalDeposit.data?.date
                    ? moment(togglemodalDeposit.data.date)
                    : null
            });
        }
    }, [togglemodalDeposit.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    return (
        <Modal
            title={togglemodalDeposit.data ? "Edit Deposit" : "Add Deposit"}
            visible={togglemodalDeposit.open}
            onCancel={() => {
                setTogglemodalDeposit({ open: false, data: null });
                form.resetFields();
            }}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        disabled={formLoadingClientDeposit}
                        onClick={() => {
                            form.resetFields();
                            setTogglemodalDeposit({
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
                        loading={formLoadingClientDeposit}
                        onClick={() => form.submit()}
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        label="Deposit Name"
                        name="deposit_id"
                        rules={[
                            {
                                required: true,
                                message: "Please Select Deposit Name"
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            name="deposit_id"
                            required
                            label="Select Deposit Name"
                            placeholder="Select Deposit Name"
                        >
                            {dataDeposit &&
                                dataDeposit.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.deposit_name}
                                    </Select.Option>
                                ))}
                        </Select>
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
                        label="Date"
                        name="date"
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
