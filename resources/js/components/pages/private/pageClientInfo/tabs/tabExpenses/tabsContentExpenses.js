import React, { useEffect, useState } from "react";
import { Button, Col, Input, notification, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalExpenses from "./modalExpenses";
export default function TabsContentExpenses(props) {
    const { client_id } = props;

    let userdata = JSON.parse(localStorage.userdata);
    const [dataClientExpenses, setDataClientExpenses] = useState([]);

    const [tableFilter, setTableFilter] = useState({
        search: "",
        page: 1,
        size: 20,
        order: "id",
        sort: "asc"
    });

    const [togglemodalClientExpenses, setTogglemodalClientExpenses] = useState({
        open: false,
        data: null
    });

    const getClientExpenses = () => {
        fetchData(
            "GET",
            "api/client_expenses?client_id=" +
                client_id +
                "&" +
                new URLSearchParams(tableFilter)
        ).then(res => {
            if (res.success) {
                setDataClientExpenses(res.data);
            }
        });
    };

    const handleDeleteClientExpenses = record => {
        fetchData("DELETE", "api/client_expenses/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: res.message,
                    description: res.message
                });
                setDataClientExpenses(prev =>
                    prev.filter(clientExpense => clientExpense.id !== record.id)
                );
            }
        });
    };

    const onChangeTable = (key, value) => {
        setTableFilter({
            ...tableFilter,
            [key]: value
        });
    };

    useEffect(() => {
        getClientExpenses();
        return () => {};
    }, [tableFilter]);

    return (
        <>
            <Row className="mb-10">
                <Col xs={24} md={18} className="px-0">
                    {userdata.role != "Staff" && (
                        <Button
                            type="primary"
                            onClick={e =>
                                setTogglemodalClientExpenses({
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
                            onChange={e =>
                                onChangeTable("search", e.target.value)
                            }
                        />
                    </div>
                </Col>
            </Row>
            <Table
                dataSource={dataClientExpenses}
                rowKey={record => record.id}
                pagination={true}
                onChange={onChangeTable}
            >
                <Table.Column
                    title="Expenses Name"
                    dataIndex="expense_name"
                    key="expense_name"
                />
                <Table.Column title="Amount" dataIndex="amount" key="amount" />
                <Table.Column
                    title="Date"
                    dataIndex="date_formatted"
                    key="date_formatted"
                />
                <Table.Column title="Notes" dataIndex="notes" key="notes" />

                {/* <Table.Column
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
                                                setTogglemodalClientDeposit({
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
                                                    handleDeleteClientExpenses(
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
                /> */}
            </Table>

            <ModalExpenses
                togglemodalClientExpenses={togglemodalClientExpenses}
                setTogglemodalClientExpenses={setTogglemodalClientExpenses}
                client_id={client_id}
                refreshClientExpenses={getClientExpenses}
            />
        </>
    );
}
