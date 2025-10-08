import React, { useEffect, useState } from "react";

import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalBanks from "./modalBanks";

export default function TabsContentBanks(props) {
    const { client_id } = props;

    let userdata = JSON.parse(localStorage.userdata);
    const [dataClientBanks, setDataClientBanks] = useState([]);

    const [togglemodalBanks, setTogglemodalBanks] = useState({
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
                                setTogglemodalBanks({ open: true, data: null })
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
            </Table>

            <ModalBanks
                togglemodalBanks={togglemodalBanks}
                setTogglemodalBanks={setTogglemodalBanks}
                client_id={client_id}
                refreshClientBanks={getClientBank}
            />
        </>
    );
}
