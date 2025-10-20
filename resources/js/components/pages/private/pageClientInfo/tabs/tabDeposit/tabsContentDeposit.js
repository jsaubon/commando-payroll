import React, { useEffect, useState } from "react";

import { Button, Col, Input, notification, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalDeposit from "./modalDeposit";
import ButtonGroup from "antd/lib/button/button-group";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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

    const [togglemodalClientDeposit, setTogglemodalClientDeposit] = useState({
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

    const handleDeleteClientDeposit = record => {
        fetchData("DELETE", "api/client_deposits/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: res.message,
                    description: res.message
                });
                setDataClientDeposit(prev =>
                    prev.filter(clientDeposit => clientDeposit.id !== record.id)
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
                                setTogglemodalClientDeposit({
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
                                                    handleDeleteClientDeposit(
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

            <ModalDeposit
                togglemodalClientDeposit={togglemodalClientDeposit}
                setTogglemodalClientDeposit={setTogglemodalClientDeposit}
                client_id={client_id}
                refreshClientDeposits={getClientDeposit}
            />
        </>
    );
}
