import React, { useEffect, useState } from "react";

import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalDeposit from "./modalDeposit";

export default function TabsContentDeposit(props) {
    const { client_id } = props;

    let userdata = JSON.parse(localStorage.userdata);
    const [dataClientDeposit, setDataClientDeposit] = useState([]);

    const [tableFilter, setTableFilter] = useState({
        search: "",
        page: 1,
        size: 20,
        order: "id",
        sort: "asc"
    });

    const [togglemodalDeposit, setTogglemodalDeposit] = useState({
        open: false,
        data: null
    });

    const getClientDeposit = () => {
        fetchData(
            "GET",
            "api/client_deposits?client_id=" +
                client_id +
                "&tableFilter=" +
                new URLSearchParams(tableFilter)
        ).then(res => {
            if (res.success) {
                setDataClientDeposit(res.data);
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
        getClientDeposit();
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
                                setTogglemodalDeposit({
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
                            placeholder="Search Deposit"
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
                dataSource={dataClientDeposit}
                rowKey={record => record.id}
                pagination={true}
                onChange={onChangeTable}
            >
                <Table.Column
                    title="Deposit Name"
                    dataIndex="deposit_name"
                    key="deposit_name"
                />
                <Table.Column title="Amount" dataIndex="amount" key="amount" />
                <Table.Column
                    title="Date"
                    dataIndex="date_formatted"
                    key="date_formatted"
                />
                <Table.Column title="Notes" dataIndex="notes" key="notes" />
            </Table>

            <ModalDeposit
                togglemodalDeposit={togglemodalDeposit}
                setTogglemodalDeposit={setTogglemodalDeposit}
                client_id={client_id}
                refreshClientDeposits={getClientDeposit}
            />
        </>
    );
}
