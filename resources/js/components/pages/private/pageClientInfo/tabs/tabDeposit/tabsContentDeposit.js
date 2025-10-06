import React, { useEffect, useState } from "react";

import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalDeposit from "./modalDeposit";

export default function TabsContentDeposit(props) {
    const { client_id } = props;

    const [togglemodalDeposit, setTogglemodalDeposit] = useState({
        open: false,
        data: null
    });

    const [dataClientDeposit, setDataClientDeposit] = useState([]);
    const [
        clientDepositTableSettings,
        setClientDepositTableSettings
    ] = useState({
        size: 20,
        page: 1,
        search: "",
        order: "id",
        sort: "asc"
    });

    const getClientDeposit = () => {
        fetchData(
            "GET",
            "api/client_deposits?client_id=" +
                client_id +
                "&search=" +
                clientDepositTableSettings.search +
                "&page=" +
                clientDepositTableSettings.page +
                "&size=" +
                clientDepositTableSettings.size +
                "&order=" +
                clientDepositTableSettings.order +
                "&sort=" +
                clientDepositTableSettings.sort
        ).then(res => {
            if (res.success) {
                setDataClientDeposit(res.data);
            }
        });
    };
    const columns = [
        {
            title: "Deposit Name",
            dataIndex: "deposit_name",
            key: "deposit_name"
        },

        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Date",
            dataIndex: "date_formatted",
            key: "date_formatted"
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes"
        }

        // {
        //     title: "Action",
        //     key: "action",
        //     width: "20%",
        //     render: (text, record) => {
        //         return (
        //             <Space size="middle" key={record.id}>
        //                 {userdata.role != "Staff" && (
        //                     <ButtonGroup>
        //                         <Button
        //                             size="small"
        //                             type="primary"
        //                             icon={<EditOutlined />}
        //                             onClick={e => setTogglemodalDeposit(record)}
        //                         >
        //                             Edit
        //                         </Button>

        //                         <Popconfirm
        //                             title="Are you sure to delete this data?"
        //                             okText="Yes"
        //                             cancelText="No"
        //                         >
        //                             <Button
        //                                 size="small"
        //                                 type="primary"
        //                                 danger
        //                                 icon={<DeleteOutlined />}
        //                             >
        //                                 Delete
        //                             </Button>
        //                         </Popconfirm>
        //                     </ButtonGroup>
        //                 )}
        //             </Space>
        //         );
        //     }
        // }
    ];
    let userdata = JSON.parse(localStorage.userdata);

    const handleOnPageChange = (page, pageSize) => {
        setClientDepositTableSettings({
            ...clientDepositTableSettings,
            page: page,
            size: pageSize
        });
    };
    const handleOnPageSizeChange = (page, pageSize) => {
        setClientDepositTableSettings({
            ...clientDepositTableSettings,
            page: page,
            size: pageSize
        });
    };

    const handleSearchDeposit = search => {
        setClientDepositTableSettings({
            ...clientDepositTableSettings,
            search: search
        });
    };
    useEffect(() => {
        getClientDeposit();
        return () => {};
    }, [clientDepositTableSettings]);

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
                            onSearch={value => handleSearchDeposit(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => handleSearchDeposit(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={dataClientDeposit}
                rowKey={record => record.id}
                pagination={{
                    onChange: (page, pageSize) =>
                        handleOnPageChange(page, pageSize),
                    onShowSizeChange: (current, size) =>
                        handleOnPageSizeChange(current, size),
                    total: clientDepositTableSettings.total
                }}
                onChange={(pagination, filters, sorter) => {
                    setClientDepositTableSettings({
                        ...clientDepositTableSettings,
                        order: sorter.columnKey ? sorter.columnKey : "id",
                        sort: sorter.order
                            ? sorter.order.replace("end", "")
                            : "asc"
                    });
                }}
            />

            <ModalDeposit
                togglemodalDeposit={togglemodalDeposit}
                setTogglemodalDeposit={setTogglemodalDeposit}
                client_id={client_id}
                refreshClientDeposits={getClientDeposit}
            />
        </>
    );
}
