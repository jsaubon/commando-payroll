import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Col, Select, Input, notification } from "antd";

import { fetchData } from "../../../../../../axios";
import { notificationErrors } from "../../../../../notificationErrors";

export default function ModalBanks(props) {
    const {
        togglemodalBanks,
        setTogglemodalBanks,
        client_id,
        refreshClientBanks
    } = props;

    const [form] = Form.useForm();
    const [dataBankName, setDataBankName] = useState(null);
    // console.log(dataBankName);

    useEffect(() => {
        fetchData("GET", "api/banks?sort=asc").then(res => {
            console.log(res);
            if (res.success) {
                setDataBankName(res.data);
            }
        });
        return () => {};
    }, []);

    const [formLoadingClientBank, setFormLoadingClientBank] = useState(false);

    const onFinish = values => {
        console.log("Success:", values);

        let data = {
            ...values,
            id: togglemodalBanks.data?.id || "",
            client_id: client_id
        };

        fetchData("POST", "api/client_banks", data)
            .then(res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Bank",
                        description: res.message
                    });
                    refreshClientBanks();

                    setTogglemodalBanks({ open: false, data: null });
                    form.resetFields();
                }
            })
            .catch(err => {
                notificationErrors(err);
            });
        setFormLoadingClientBank(true);
    };

    useEffect(() => {
        if (togglemodalBanks.open) {
            form.setFieldsValue({
                ...togglemodalBanks.data
            });
        }
    }, [togglemodalBanks.data]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    return (
        <Modal
            title={togglemodalBanks.data ? "Edit Bank" : "Add Bank"}
            visible={togglemodalBanks.open}
            onCancel={() => {
                setTogglemodalBanks({ open: false, data: null });
                form.resetFields();
            }}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
                        disabled={formLoadingClientBank}
                        onClick={() => {
                            form.resetFields();
                            setTogglemodalBanks({
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
                        loading={formLoadingClientBank}
                        onClick={() => form.submit()}
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        label="Bank Name"
                        name="bank_id"
                        rules={[
                            {
                                required: true,
                                message: "Please Select Bank Name"
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            name="bank_id"
                            required
                            label="Select Bank Name"
                            placeholder="Select Bank Name"
                        >
                            {dataBankName &&
                                dataBankName.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.bank_name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Notes" name="notes">
                        <Input.TextArea placeholder="Notes"></Input.TextArea>
                    </Form.Item>
                </Col>
            </Form>
        </Modal>
    );
}
