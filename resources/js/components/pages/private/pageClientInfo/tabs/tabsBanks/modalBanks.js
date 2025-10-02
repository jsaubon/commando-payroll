import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Col, Select, Input } from "antd";
import { fetchData } from "../../../../../../axios";

export default function ModalBanks(props) {
    const { togglemodalBanks, setTogglemodalBanks } = props;
    const [form] = Form.useForm();
    const [dataBankName, setDataBankName] = useState(null);
    // console.log(dataBankName);

    useEffect(() => {
        fetchData("GET", "api/client?sort=asc").then(res => {
            console.log(res);
            if (res.success) {
                setDataBankName(res.data);
            }
        });
        return () => {};
    }, []);
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
            onCancel={() => setTogglemodalBanks({ open: false, data: null })}
            footer={[
                <>
                    <Button
                        type="default"
                        shape="square"
                        size="medium"
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
                    >
                        Save
                    </Button>
                </>
            ]}
        >
            <Form {...layout} form={form}>
                <Col xs={24} md={8} lg={24}>
                    <Form.Item
                        label="Bank Name"
                        name="bank_name"
                        rules={[
                            {
                                required: true,
                                message: "Please Select Bank"
                            }
                        ]}
                    >
                        <Select placeholder="Select Banks">
                            {dataBankName?.data?.map(bank => (
                                <Select.Option
                                    key={bank.id}
                                    value={bank.bank_name}
                                >
                                    {bank.bank_name}
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
