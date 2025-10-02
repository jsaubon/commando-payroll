import React, { useEffect, useState } from "react";
import { Button, Card, Popconfirm, Table, Typography } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { fetchData } from "../../../../axios";
import ModalBankForm from "./component/ModalBankForm";

export default function PageBank() {
    const [toggleModalBankForm, setToggleModalBankForm] = useState({
        open: false,
        data: null
    });

    useEffect(() => {
        getUsers();
        return () => {};
    }, []);

    const getUsers = () => {
        fetchData("GET", "api/banks").then(res => {
            console.log(res);
        });
    };

    const handleDeleteBank = record => {
        fetchData("DELETE", "api/banks/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Bank Successfully Deleted!"
                });
                getUsers();
            }
        });
    };

    const [clientInfo, setClientInfo] = useState();

    const getClientInfo = () => {
        fetchData("GET", "api/client/" + client_id).then(res => {
            // console.log(res);
            if (res.success) {
                setClientInfo(res.data);
            }
        });
    };

    const dataSource = [
        {
            key: "1",
            bank_name: "Bank of America",
            bank_branch: "Los Angeles",
            account_name: "John Doe",
            account_type: "Checking Accounts",
            account_number: "123456789",

            expiration_date: "12/12/2025"
        }
    ];
    const columns = [
        {
            title: "Bank Name",
            dataIndex: "bank_name",
            key: "bank_name"
        },
        {
            title: "Bank Branch",
            dataIndex: "bank_branch",
            key: "bank_branch"
        },
        {
            title: "Account Name",
            dataIndex: "account_name",
            key: "account_name"
        },
        {
            title: "Account Type",
            dataIndex: "account_type",
            key: "account_type"
        },
        {
            title: "Account Number",
            dataIndex: "account_number",
            key: "account_number"
        },
        {
            title: "Expiration Date",
            dataIndex: "expiration_date",
            key: "expiration_date"
        },

        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record) => {
                return (
                    <>
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
                                    onConfirm={e => handleDeleteBank(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    Delete
                                </Popconfirm>
                            </Button>
                        </ButtonGroup>
                    </>
                );
            }
        }
    ];
    return (
        <div>
            <Typography.Title level={1}>Banks</Typography.Title>

            <Button
                type="primary"
                onClick={e =>
                    setToggleModalBankForm({ open: true, data: null })
                }
            >
                New
            </Button>

            <Card className="mt-10">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    size="small"
                />
            </Card>

            <ModalBankForm
                toggleModalBankForm={toggleModalBankForm}
                setToggleModalBankForm={setToggleModalBankForm}
            />
        </div>
    );
}
