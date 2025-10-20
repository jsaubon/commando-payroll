import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import {
    Button,
    Card,
    Col,
    Input,
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

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: ""
    });
    const userdata = JSON.parse(localStorage.userdata);

    const [dataExpenses, setDataExpenses] = useState([]);

    const getExpenses = () => {
        fetchData(
            "GET",
            "api/expenses?" + new URLSearchParams(tableFilter)
        ).then(res => {
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
                    message: "Expenses",
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
    }, [tableFilter]);

    const onChangeTable = (key, value) => {
        setTableFilter(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div>
            <Typography.Title level={1}>Expenses</Typography.Title>
            <Col xs={24} md={6} className="px-0 mb-10">
                {userdata.role != "Staff" && (
                    <Button
                        type="primary"
                        onClick={e =>
                            setToggleModalExpensesForm({
                                open: true,
                                data: null
                            })
                        }
                    >
                        New
                    </Button>
                )}
            </Col>

            <Col xs={24} md={6} className="px-0">
                <div style={{ display: "flex" }}>
                    <Input.Search
                        allowClear
                        placeholder="Search Expenses"
                        style={{ width: "100%" }}
                        className="pull-right"
                        onChange={e => onChangeTable("search", e.target.value)}
                    />
                </div>
            </Col>

            <Card className="mt-10">
                <Table
                    rowKey={record => record.id}
                    dataSource={
                        dataExpenses && dataExpenses.data
                            ? dataExpenses.data
                            : dataExpenses
                    }
                    pagination={true}
                >
                    <Table.Column
                        title="Bank Name"
                        dataIndex="bank_name"
                        key="bank_name"
                    />
                    <Table.Column
                        title="Expenses Name"
                        dataIndex="expense_name"
                        key="expense_name"
                    />
                    <Table.Column
                        title="Expenses Description"
                        dataIndex="expense_description"
                        key="expense_description"
                    />
                    <Table.Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                    />
                    <Table.Column
                        title="Date"
                        dataIndex="date_formatted"
                        key="date_formatted"
                    />
                    <Table.Column
                        title="Out Standing Check"
                        dataIndex="out_standing_check"
                        key="out_standing_check"
                    />
                    <Table.Column title="PDC" dataIndex="pdc" key="pdc" />
                    <Table.Column title="Notes" dataIndex="notes" key="notes" />

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
