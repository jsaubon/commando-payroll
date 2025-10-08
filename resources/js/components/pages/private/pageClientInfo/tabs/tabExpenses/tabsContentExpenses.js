import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Table } from "antd";

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

    const [togglemodalExpenses, setTogglemodalExpenses] = useState({
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
                                setTogglemodalExpenses({
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
            </Table>

            <ModalExpenses
                togglemodalExpenses={togglemodalExpenses}
                setTogglemodalExpenses={setTogglemodalExpenses}
                client_id={client_id}
                refreshClientExpenses={getClientExpenses}
            />
        </>
    );
}
