import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    notification,
    Popconfirm,
    Table,
    Typography
} from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { fetchData } from "../../../../axios";
import ModalBankForm from "./component/ModalBankForm";

export default function PageBank() {
    const userdata = JSON.parse(localStorage.userdata);
    const [dataBanks, setDataBanks] = useState([]);

    const [toggleModalBankForm, setToggleModalBankForm] = useState({
        open: false,
        data: null
    });

    const getBanks = () => {
        fetchData("GET", "api/banks").then(res => {
            if (res.success) {
                setDataBanks(res.data);
            }
        });
    };

    const handleDeleteBank = record => {
        fetchData("DELETE", "api/banks/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Bank",
                    description: res.message
                });
                setDataBanks(prev =>
                    prev.filter(bank => bank.id !== record.id)
                );
            }
        });
    };

    useEffect(() => {
        getBanks();
        return () => {};
    }, []);

    return (
        <div>
            <Typography.Title level={1}>Banks</Typography.Title>

            {userdata.role != "Staff" && (
                <Button
                    type="primary"
                    onClick={e =>
                        setToggleModalBankForm({ open: true, data: null })
                    }
                >
                    New
                </Button>
            )}

            <Card className="mt-10">
                <Table
                    dataSource={dataBanks}
                    rowKey={record => record.id}
                    pagination={false}
                    size="small"
                >
                    <Table.Column
                        title="Bank Name"
                        dataIndex="bank_name"
                        key="bank_name"
                    />
                    <Table.Column
                        title="Bank Branch"
                        dataIndex="bank_branch"
                        key="bank_branch"
                    />
                    <Table.Column
                        title="Account Name"
                        dataIndex="account_name"
                        key="account_name"
                    />
                    <Table.Column
                        title="Account Type"
                        dataIndex="account_type"
                        key="account_type"
                    />
                    <Table.Column
                        title="Account Number"
                        dataIndex="account_number"
                        key="account_number"
                    />
                    <Table.Column
                        title="Expiration Date"
                        dataIndex="expiration_date"
                        key="expiration_date"
                    />

                    <Table.Column
                        title="Action"
                        key="action"
                        align="center"
                        width={100}
                        render={(text, record) => {
                            return (
                                <>
                                    {userdata.role != "Staff" && (
                                        <ButtonGroup>
                                            <Button
                                                size="small"
                                                type="primary"
                                                icon={<EditOutlined />}
                                                onClick={e =>
                                                    setToggleModalBankForm({
                                                        open: true,
                                                        data: record
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="small"
                                                type="primary"
                                                danger
                                                icon={<DeleteOutlined />}
                                            >
                                                <Popconfirm
                                                    title="Are you sure delete this data?"
                                                    onConfirm={e =>
                                                        handleDeleteBank(record)
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    Delete
                                                </Popconfirm>
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </>
                            );
                        }}
                    />
                </Table>
            </Card>

            <ModalBankForm
                toggleModalBankForm={toggleModalBankForm}
                setToggleModalBankForm={setToggleModalBankForm}
                refreshBanks={getBanks}
            />
        </div>
    );
}
