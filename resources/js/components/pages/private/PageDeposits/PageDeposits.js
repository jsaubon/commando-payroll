import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import {
    Button,
    Card,
    notification,
    Popconfirm,
    Table,
    Typography
} from "antd";

import { fetchData } from "../../../../axios";
import ModalDepositsForm from "./component/ModalDepositsForm";

export default function PageDeposits() {
    const [toggleModalDepositsForm, setToggleModalDepositsForm] = useState({
        data: null,
        open: false
    });
    const userdata = JSON.parse(localStorage.userdata);

    const [dataDeposit, setDataDeposit] = useState([]);

    const getDeposits = () => {
        fetchData("GET", "api/deposits").then(res => {
            if (res.success) {
                setDataDeposit(res.data);
            }
        });
    };

    const handleDeleteDeposit = record => {
        fetchData("DELETE", "api/deposits/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Deposit",
                    description: res.message
                });
                setDataDeposit(prev =>
                    prev.filter(deposit => deposit.id !== record.id)
                );
            }
        });
    };

    useEffect(() => {
        getDeposits();
        return () => {};
    }, []);

    const columns = [
        {
            title: "Deposit  Name",
            dataIndex: "deposit_name",
            key: "deposit_name"
        },
        {
            title: "Deposit Description",
            dataIndex: "deposit_description",
            key: "deposit_description"
        },

        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record) => {
                return (
                    <>
                        {userdata.role != "Staff" && (
                            <ButtonGroup>
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={e =>
                                        setToggleModalDepositsForm({
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
                                            handleDeleteDeposit(record)
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
            }
        }
    ];

    return (
        <div>
            <Typography.Title level={1}>Deposits</Typography.Title>

            {userdata.role != "Staff" && (
                <Button
                    type="primary"
                    onClick={e =>
                        setToggleModalDepositsForm({ open: true, data: null })
                    }
                >
                    New
                </Button>
            )}

            <Card className="mt-10">
                <Table
                    columns={columns}
                    dataSource={dataDeposit}
                    pagination={false}
                    size="small"
                />
            </Card>

            <ModalDepositsForm
                toggleModalDepositsForm={toggleModalDepositsForm}
                setToggleModalDepositsForm={setToggleModalDepositsForm}
                refreshDeposits={getDeposits}
            />
        </div>
    );
}
