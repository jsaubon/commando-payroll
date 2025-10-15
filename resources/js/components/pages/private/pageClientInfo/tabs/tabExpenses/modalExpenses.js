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

export default function ModalExpenses(props) {
    const {
        togglemodalExpenses,
        setTogglemodalExpenses,
        client_id,
        refreshClientExpenses
    } = props;

    const [form] = Form.useForm();
    const [dataExpensesName, setDataExpensesName] = useState(null);
    const [formLoadingClientExpenses, setFormLoadingClientExpenses] = useState(
        false
    );

    useEffect(() => {
        fetchData("GET", "api/expenses?sort=asc").then(res => {
            console.log(res);
            if (res.success) {
                setDataExpensesName(res.data);
            }
        });
        return () => {};
    }, []);

    const onFinish = values => {
        console.log("Success:", values);

        let data = {
            ...values,
            id: togglemodalExpenses.data?.id || "",
            client_id: client_id,
            date: values.date ? moment(values.date).format("YYYY-MM-DD") : ""
        };

        fetchData("POST", "api/client_expenses", data)
            .then(res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Expenses",
                        description: res.message
                    });
                    refreshClientExpenses();

                    setTogglemodalExpenses({ open: false, data: null });
                    form.resetFields();
                }
            })

            .catch(err => {
                notificationErrors(err);
            });
    };

    useEffect(() => {
        if (togglemodalExpenses.open) {
            form.setFieldsValue({
                ...togglemodalExpenses.data,
                date: togglemodalExpenses.data?.date
                    ? moment(togglemodalExpenses.data.date, "YYYY-MM-DD")
                    : null
            });
        }
    }, [togglemodalExpenses.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    return (
        <Modal
            title={togglemodalExpenses.data ? "Edit Expenses" : "Add Expenses"}
            visible={togglemodalExpenses.open}
            onCancel={() => {
                setTogglemodalExpenses({ open: false, data: null });
                form.resetFields();
            }}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        disabled={formLoadingClientExpenses}
                        onClick={() => {
                            form.resetFields();
                            setTogglemodalExpenses({
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
                        loading={formLoadingClientExpenses}
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
                        label="Expenses Name"
                        name="expenses_id"
                        rules={[
                            {
                                required: true,
                                message: "Please Select Expenses Name"
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            name="expenses_id"
                            required
                            label="Select Expenses Name"
                            placeholder="Select Expenses Name"
                            showSearch
                        >
                            {dataExpensesName &&
                                dataExpensesName.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.expense_name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        required
                        rules={[validateRules.required()]}
                        type="number"
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
                        required
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
