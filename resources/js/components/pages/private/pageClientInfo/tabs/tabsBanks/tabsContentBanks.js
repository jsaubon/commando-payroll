import React, { useEffect, useState } from "react";

import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";

import ModalBanks from "./modalBanks";

export default function TabsContentBanks(props) {
    const { client_id } = props;

    const [togglemodalBanks, setTogglemodalBanks] = useState({
        open: false,
        data: null
    });

    const [dataClientBanks, setDataClientBanks] = useState([]);
    const [clientBankTableSettings, setClientBankTableSettings] = useState({
        size: 20,
        page: 1,
        search: "",
        order: "id",
        sort: "asc"
    });

    const getClientBank = () => {
        fetchData(
            "GET",
            "api/client_banks?client_id=" +
                client_id +
                "&search=" +
                clientBankTableSettings.search +
                "&page=" +
                clientBankTableSettings.page +
                "&size=" +
                clientBankTableSettings.size +
                "&order=" +
                clientBankTableSettings.order +
                "&sort=" +
                clientBankTableSettings.sort
        ).then(res => {
            if (res.success) {
                setDataClientBanks(res.data);
            }
        });
    };
    const columns = [
        {
            title: "Bank Name",
            dataIndex: "bank_name",
            key: "bank_name"
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
        //                             onClick={e => setTogglemodalBanks(record)}
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
        setClientBankTableSettings({
            ...clientBankTableSettings,
            page: page,
            size: pageSize
        });
    };
    const handleOnPageSizeChange = (page, pageSize) => {
        setClientBankTableSettings({
            ...clientBankTableSettings,
            page: page,
            size: pageSize
        });
    };

    const handleSearchBank = search => {
        setClientBankTableSettings({
            ...clientBankTableSettings,
            search: search
        });
    };
    useEffect(() => {
        getClientBank();
        return () => {};
    }, [clientBankTableSettings]);

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
                            onSearch={value => handleSearchBank(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => handleSearchBank(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={dataClientBanks}
                rowKey={record => record.id}
                pagination={{
                    onChange: (page, pageSize) =>
                        handleOnPageChange(page, pageSize),
                    onShowSizeChange: (current, size) =>
                        handleOnPageSizeChange(current, size),
                    total: clientBankTableSettings.total
                }}
                onChange={(pagination, filters, sorter) => {
                    setClientBankTableSettings({
                        ...clientBankTableSettings,
                        order: sorter.columnKey ? sorter.columnKey : "id",
                        sort: sorter.order
                            ? sorter.order.replace("end", "")
                            : "asc"
                    });
                }}
            />

            <ModalBanks
                togglemodalBanks={togglemodalBanks}
                setTogglemodalBanks={setTogglemodalBanks}
                client_id={client_id}
                refreshClientBanks={getClientBank}
            />
        </>
    );
}
