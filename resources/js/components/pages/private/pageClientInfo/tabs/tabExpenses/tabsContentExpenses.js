import React, { useEffect, useState } from "react";

import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import { fetchData } from "../../../../../../axios";
import ModalExpenses from "./modalExpenses";
export default function TabsContentExpenses(props) {
    const { client_id } = props;

    const [togglemodalExpenses, setTogglemodalExpenses] = useState({
        open: false,
        data: null
    });

    const [dataClientExpenses, setDataClientExpenses] = useState([]);
    const [
        clientExpensesTableSettings,
        setClientExpensesTableSettings
    ] = useState({
        size: 20,
        page: 1,
        search: "",
        order: "id",
        sort: "asc"
    });

    const getClientExpenses = () => {
        fetchData(
            "GET",
            "api/client_expenses?client_id=" +
                client_id +
                "&search=" +
                clientExpensesTableSettings.search +
                "&page=" +
                clientExpensesTableSettings.page +
                "&size=" +
                clientExpensesTableSettings.size +
                "&order=" +
                clientExpensesTableSettings.order +
                "&sort=" +
                clientExpensesTableSettings.sort
        ).then(res => {
            if (res.success) {
                setDataClientExpenses(res.data);
            }
        });
    };
    const columns = [
        {
            title: "Expenses Name",
            dataIndex: "expense_name",
            key: "expense_name"
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
        //                             onClick={e => setTogglemodalExpenses(record)}
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
        setClientExpensesTableSettings({
            ...clientExpensesTableSettings,
            page: page,
            size: pageSize
        });
    };
    const handleOnPageSizeChange = (page, pageSize) => {
        setClientExpensesTableSettings({
            ...clientExpensesTableSettings,
            page: page,
            size: pageSize
        });
    };

    const handleSearchExpenses = search => {
        setClientExpensesTableSettings({
            ...clientExpensesTableSettings,
            search: search
        });
    };
    useEffect(() => {
        getClientExpenses();
        return () => {};
    }, [clientExpensesTableSettings]);

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
                            onSearch={value => handleSearchExpenses(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => handleSearchExpenses(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={dataClientExpenses}
                rowKey={record => record.id}
                pagination={{
                    onChange: (page, pageSize) =>
                        handleOnPageChange(page, pageSize),
                    onShowSizeChange: (current, size) =>
                        handleOnPageSizeChange(current, size),
                    total: clientExpensesTableSettings.total
                }}
                onChange={(pagination, filters, sorter) => {
                    setClientExpensesTableSettings({
                        ...clientExpensesTableSettings,
                        order: sorter.columnKey ? sorter.columnKey : "id",
                        sort: sorter.order
                            ? sorter.order.replace("end", "")
                            : "asc"
                    });
                }}
            />

            <ModalExpenses
                togglemodalExpenses={togglemodalExpenses}
                setTogglemodalExpenses={setTogglemodalExpenses}
                client_id={client_id}
                refreshClientExpenses={getClientExpenses}
            />
        </>
    );
}
