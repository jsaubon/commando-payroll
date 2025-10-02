import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import { Button, Card, Popconfirm, Table, Typography } from "antd";

import ModalExpensesForm from "./component/ModalExpensesForm";

export default function PageExpenses() {
    const [toggleModalExpensesForm, setToggleModalExpensesForm] = useState({
        open: false,
        data: null
    });

    const dataSource = [
        {
            key: "1",
            expense_name: "Office Supplies",
            expense_description: "Expenses for office supplies"
        }
    ];
    const columns = [
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            key: "expense_name"
        },
        {
            title: "Expense Description",
            dataIndex: "expense_description",
            key: "expense_description"
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
            <Typography.Title level={1}>Expenses</Typography.Title>

            <Button
                type="primary"
                onClick={e =>
                    setToggleModalExpensesForm({ open: true, data: null })
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

            <ModalExpensesForm
                toggleModalExpensesForm={toggleModalExpensesForm}
                setToggleModalExpensesForm={setToggleModalExpensesForm}
            />
        </div>
    );
}
