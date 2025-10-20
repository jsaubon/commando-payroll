import React, { useEffect, useState } from "react";

import { Button, Col, Input, notification, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalBanks from "./modalBanks";
import ButtonGroup from "antd/lib/button/button-group";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function TabsContentBanks(props) {
    const { client_id } = props;

    let userdata = JSON.parse(localStorage.userdata);
    const [dataClientBanks, setDataClientBanks] = useState([]);

    const [togglemodalClientBanks, setTogglemodalClientBanks] = useState({
        open: false,
        data: null
    });

    const [tableFilter, setTableFilter] = useState({
        search: "",
        page: 1,
        size: 20,
        order: "id",
        sort: "asc"
    });

    const getClientBank = () => {
        fetchData(
            "GET",
            "api/client_banks?client_id=" +
                client_id +
                "&" +
                new URLSearchParams(tableFilter)
        ).then(res => {
            if (res.success) {
                setDataClientBanks(res.data);
            }
        });
    };

    const onChangeTable = (key, value) => {
        setTableFilter({
            ...tableFilter,
            [key]: value
        });
    };

    const handleDeleteClientBanks = record => {
        fetchData("DELETE", "api/client_banks/" + record.id).then(res => {
            if (res.success) {
                notification.success({
                    message: "Bank",
                    description: res.message
                });
                setDataClientBanks(prev =>
                    prev.filter(clientBank => clientBank.id !== record.id)
                );
            }
        });
    };
    useEffect(() => {
        getClientBank();
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
                                setTogglemodalClientBanks({
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
                            placeholder="Search Bank"
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
                dataSource={dataClientBanks}
                rowKey={record => record.id}
                pagination={true}
                onChange={onChangeTable}
            >
                <Table.Column
                    title="Bank Name"
                    key="bank_name"
                    dataIndex="bank_name"
                />
                <Table.Column title="Notes" key="notes" dataIndex="notes" />

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
                                                setTogglemodalClientBanks({
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
                                                    handleDeleteClientBanks(
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

            <ModalBanks
                togglemodalClientBanks={togglemodalClientBanks}
                setTogglemodalClientBanks={setTogglemodalClientBanks}
                client_id={client_id}
                refreshClientBanks={getClientBank}
            />
        </>
    );
}
