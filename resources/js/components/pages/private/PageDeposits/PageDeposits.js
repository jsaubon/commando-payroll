import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import { Button, Card, Popconfirm, Table, Typography } from "antd";
import ModalDepositsForm from "./component/ModalDepositsForm";

export default function PageDeposits() {
    const [toggleModalDepositsForm, setToggleModalDepositsForm] = useState({
        data: null,
        open: false
    });

    const dataSource = [
        {
            key: "1",
            deposit_name: "Client Payment",
            deposit_description: "Deposit from client payment"
        }
    ];
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
                                    // onConfirm={e =>
                                    //     handleDeleteUser(record)
                                    // }
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
            <Typography.Title level={1}>Deposits</Typography.Title>

            <Button
                type="primary"
                onClick={e =>
                    setToggleModalDepositsForm({ open: true, data: null })
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

            <ModalDepositsForm
                toggleModalDepositsForm={toggleModalDepositsForm}
                setToggleModalDepositsForm={setToggleModalDepositsForm}
            />
        </div>
    );
}
