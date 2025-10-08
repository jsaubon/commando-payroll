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
import ModalExpensesForm from "./component/ModalExpensesForm";

export default function PageExpenses() {
    const [toggleModalExpensesForm, setToggleModalExpensesForm] = useState({
        open: false,
        data: null
    });
    const userdata = JSON.parse(localStorage.userdata);

    const [dataExpenses, setDataExpenses] = useState([]);

    const getExpenses = () => {
        fetchData("GET", "api/expenses").then(res => {
            // console.log("dataExpenses", res.data);

            if (res.success) {
                setDataExpenses(res.data);
            }
        });
    };

    const handleDeleteExpense = record => {
        fetchData("DELETE", "api/expenses/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Expense",
                    description: res.message
                });
                setDataExpenses(prev =>
                    prev.filter(expense => expense.id !== record.id)
                );
            }
        });
    };

    useEffect(() => {
        getExpenses();
        return () => {};
    }, []);

    return (
        <div>
            <Typography.Title level={1}>Expenses</Typography.Title>

            {userdata.role != "Staff" && (
                <Button
                    type="primary"
                    onClick={e =>
                        setToggleModalExpensesForm({ open: true, data: null })
                    }
                >
                    New
                </Button>
            )}

            <Card className="mt-10">
                <Table
                    rowKey={record => record.id}
                    dataSource={dataExpenses}
                    pagination={false}
                >
                    <Table.Column
                        title="Expense Name"
                        dataIndex="expense_name"
                        key="expense_name"
                    />
                    <Table.Column
                        title="Expense Description"
                        dataIndex="expense_description"
                        key="expense_description"
                    />
                    <Table.Column
                        title="Action"
                        key="action"
                        width={100}
                        align="center"
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
                                                    setToggleModalExpensesForm({
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
                                                        handleDeleteExpense(
                                                            record
                                                        )
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

            <ModalExpensesForm
                toggleModalExpensesForm={toggleModalExpensesForm}
                setToggleModalExpensesForm={setToggleModalExpensesForm}
                refreshExpenses={getExpenses}
            />
        </div>
    );
}
