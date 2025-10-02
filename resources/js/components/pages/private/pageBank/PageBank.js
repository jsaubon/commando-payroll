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
    const [toggleModalBankForm, setToggleModalBankForm] = useState({
        open: false,
        data: null
    });
    const [dataBanks, setDataBanks] = useState([]);

    useEffect(() => {
        getBanks();
        return () => {};
    }, []);

    const getBanks = () => {
        fetchData("GET", "api/banks").then(res => {
            console.log("dataBanks", res.data);

            if (res.success) {
                setDataBanks(res.data);
            }
        });
    };

    const handleDeleteBank = record => {
        fetchData("DELETE", "api/banks/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Bank Successfully Deleted!"
                });
                setDataBanks(prev =>
                    prev.filter(bank => bank.id !== record.id)
                );
            }
        });
    };

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
                    dataSource={dataBanks}
                    pagination={false}
                    size="small"
                />
            </Card>

            <ModalBankForm
                toggleModalBankForm={toggleModalBankForm}
                setToggleModalBankForm={setToggleModalBankForm}
                refreshBanks={getBanks}
            />
        </div>
    );
}
