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
    const userdata = JSON.parse(localStorage.userdata);
    const [dataDeposit, setDataDeposit] = useState([]);

    const [toggleModalDepositsForm, setToggleModalDepositsForm] = useState({
        data: null,
        open: false
    });

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
                    rowKey={record => record.id}
                    dataSource={dataDeposit}
                    pagination={false}
                    size="small"
                >
                    <Table.Column
                        title="Bank Name"
                        dataIndex="bank_name"
                        key="bank_name"
                    />
                    <Table.Column
                        title="Deposit Name"
                        dataIndex="deposit_name"
                        key="deposit_name"
                    />
                    <Table.Column
                        title="Deposit Description"
                        dataIndex="deposit_description"
                        key="deposit_description"
                    />
                    <Table.Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                    />
                    <Table.Column
                        title="Date Request"
                        dataIndex="date_request_formatted"
                        key="date_request_formatted"
                    />
                    <Table.Column
                        title="Date Transaction"
                        dataIndex="date_transaction_formatted"
                        key="date_transaction_formatted"
                    />
                    <Table.Column title="Notes" dataIndex="notes" key="notes" />

                    <Table.Column
                        title="Action"
                        key="action"
                        width={100}
                        align="center"
                        render={(text, record) => {
                            return (
                                <>
                                    {" "}
                                    {userdata.role != "Staff" && (
                                        <ButtonGroup>
                                            {" "}
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
                                                {" "}
                                                Edit{" "}
                                            </Button>{" "}
                                            <Button
                                                size="small"
                                                type="primary"
                                                danger
                                                icon={<DeleteOutlined />}
                                            >
                                                {" "}
                                                <Popconfirm
                                                    title="Are you sure delete this data?"
                                                    onConfirm={e =>
                                                        handleDeleteDeposit(
                                                            record
                                                        )
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    {" "}
                                                    Delete{" "}
                                                </Popconfirm>{" "}
                                            </Button>{" "}
                                        </ButtonGroup>
                                    )}{" "}
                                </>
                            );
                        }}
                    />
                </Table>
            </Card>

            <ModalDepositsForm
                toggleModalDepositsForm={toggleModalDepositsForm}
                setToggleModalDepositsForm={setToggleModalDepositsForm}
                refreshDeposits={getDeposits}
            />
        </div>
    );
}
