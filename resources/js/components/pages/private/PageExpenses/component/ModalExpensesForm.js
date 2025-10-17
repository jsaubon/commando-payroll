import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
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

export default function ModalExpensesForm(props) {
    const {
        toggleModalExpensesForm,
        setToggleModalExpensesForm,
        refreshExpenses
    } = props;
    const [form] = Form.useForm();
    const [formLoadingExpenses, setFormLoadingExpenses] = useState(false);

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
            id: toggleModalExpensesForm.data?.id || "",
            date: values.date ? moment(values.date).format("YYYY-MM-DD") : null,
            out_standing_check: values.out_standing_check ? 1 : 0,
            pdc: values.pdc ? 1 : 0
        };

        fetchData("POST", "api/expenses", data)
            .then(res => {
                // console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Expenses",
                        description: res.message
                    });
                    refreshExpenses();
                    setToggleModalExpensesForm({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notificationErrors(err);
            });
        setFormLoadingExpenses(true);
    };

    useEffect(() => {
        if (toggleModalExpensesForm.open) {
            form.setFieldsValue({
                ...toggleModalExpensesForm.data,
                date: toggleModalExpensesForm.data?.date
                    ? moment(toggleModalExpensesForm.data.date)
                    : null,
                out_standing_check:
                    toggleModalExpensesForm.data?.out_standing_check == 1,

                pdc: toggleModalExpensesForm.data?.pdc == 1
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
                toggleModalExpensesForm.data ? "Edit Expenses" : "Add Expenses"
            }
            visible={toggleModalExpensesForm.open}
            onCancel={() => {
                setToggleModalExpensesForm({ open: false, data: null });
                form.resetFields();
            }}
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
                    label="Expenses Name"
                    name="expense_name"
                    className="mb-15"
                    required
                    rules={[validateRules.required()]}
                >
                    <Input
                        name="expense_name"
                        placeholder="Expense Name"
                        label="Expense Name"
                    />
                </Form.Item>
                <Form.Item
                    required
                    label="Expenses Description"
                    name="expense_description"
                    className="mb-15"
                    rules={[validateRules.required()]}
                >
                    <Input
                        name="expense_description"
                        placeholder="Expense Description"
                        label="Expense Description"
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
                    label="Date"
                    name="date"
                    rules={[validateRules.required()]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    name="out_standing_check"
                    label="Out Standing Check"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>

                <Form.Item name="pdc" label="PDC" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="Notes" name="notes">
                    <Input.TextArea placeholder="Notes"></Input.TextArea>
                </Form.Item>
            </Form>
        </Modal>
    );
}
