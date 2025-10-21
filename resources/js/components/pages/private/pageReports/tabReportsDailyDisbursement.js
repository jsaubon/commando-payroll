import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useRef } from "react";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import {
    Card,
    Col,
    DatePicker,
    Row,
    Select,
    Button,
    Divider,
    Table
} from "antd";
import { fetchData } from "../../../../axios";

export default function TabReportsDailyDisbursement() {
    const [dataDailyDisbursement, setDataDailyDisbursement] = useState(null);
    const [dataBanks, setDataBanks] = useState([]);
    const [tableFilter, setTableFilter] = useState({
        month: ""
    });

    useEffect(() => {
        fetchData("GET", `api/banks`).then(res => {
            if (res.success) setDataBanks(res.data);
        });
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(tableFilter).toString();
        fetchData("GET", `api/get_report_daily_disbursement?${urlParams}`).then(
            res => {
                if (res.success) setDataDailyDisbursement(res.data);
            }
        );
    }, [tableFilter]);

    const onChangeTable = (key, value) => {
        setTableFilter(prev => ({ ...prev, [key]: value }));
    };

    const componentRef = useRef();

    const handlePrintDailyDisbursementReport = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: true
    });

    const columnsDeposit = [
        {
            title: "Date Deposited",
            dataIndex: "date_deposited_formatted",
            key: "date_deposited_formatted",
            width: 100
        },
        {
            title: "Bank Transaction Date",
            dataIndex: "bank_transaction_date_formatted",
            key: "bank_transaction_date_formatted",
            width: 100
        },
        {
            title: "Deposit Name",
            dataIndex: "deposit_name",
            key: "deposit_name",
            width: 250
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: 50
            // render: (text, record, index) => {
            //     const deposits = record.tableData || [];
            //     const totalAmount = deposits.reduce(
            //         (sum, item) => sum + Number(item.amount || 0),
            //         0
            //     );
            //     const isLast = index === deposits.length - 1;

            //     return (
            //         <div
            //             style={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "left",
            //                 whiteSpace: "nowrap"
            //             }}
            //         >
            //             <span
            //                 style={{
            //                     width: "50%",
            //                     textAlign: "left",
            //                     paddingRight: "25px"
            //                 }}
            //             >
            //                 {Number(text || 0).toLocaleString(undefined, {
            //                     minimumFractionDigits: 2,
            //                     maximumFractionDigits: 2
            //                 })}
            //             </span>

            //             <span
            //                 style={{
            //                     width: "5pc",
            //                     textAlign: "right",
            //                     fontWeight: isLast ? "700" : "normal",
            //                     borderBottom: isLast ? "2px solid #000" : "none"
            //                 }}
            //             >
            //                 {isLast
            //                     ? Number(totalAmount || 0).toLocaleString(
            //                           undefined,
            //                           {
            //                               minimumFractionDigits: 2,
            //                               maximumFractionDigits: 2
            //                           }
            //                       )
            //                     : ""}
            //             </span>
            //         </div>
            //     );
            // }
        }
    ];

    const columnsExpense = [
        { title: "Date ", dataIndex: "date", key: "date", width: 100 },
        {
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: 100
        },
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            key: "expense_name",
            width: 250
        },
        {
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: 50
            // render: (text, record, index) => {
            //     const expenses = record.tableData || [];
            //     const totalAmount = expenses.reduce(
            //         (sum, item) => sum + Number(item.amount || 0),
            //         0
            //     );
            //     const isLast = index === expenses.length - 1;

            //     return (
            //         <div
            //             style={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "center",
            //                 whiteSpace: "nowrap"
            //             }}
            //         >
            //             <span
            //                 style={{
            //                     width: "50%",
            //                     textAlign: "left",
            //                     paddingRight: "25px"
            //                 }}
            //             >
            //                 {Number(text || 0).toLocaleString(undefined, {
            //                     minimumFractionDigits: 2,
            //                     maximumFractionDigits: 2
            //                 })}
            //             </span>

            //             <span
            //                 style={{
            //                     textAlign: "right",
            //                     width: "50%",
            //                     fontWeight: isLast ? "700" : "normal",
            //                     borderBottom: isLast ? "2px solid #000" : "none"
            //                 }}
            //             >
            //                 {isLast
            //                     ? Number(totalAmount || 0).toLocaleString(
            //                           undefined,
            //                           {
            //                               minimumFractionDigits: 2,
            //                               maximumFractionDigits: 2
            //                           }
            //                       )
            //                     : ""}
            //             </span>
            //         </div>
            //     );
            // }
        }
    ];
    const columnsOutstandingCheck = [
        { dataIndex: "date", key: "date", width: 100 },
        {
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: 100
        },
        {
            dataIndex: "expense_name",
            key: "expense_name",
            width: 250
        },
        {
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: 50
            // render: (text, record, index) => {
            //     const outstanding_checks = record.tableData || [];
            //     const totalAmount = outstanding_checks.reduce(
            //         (sum, item) => sum + Number(item.amount || 0),
            //         0
            //     );
            //     const isLast = index === outstanding_checks.length - 1;

            //     return (
            //         <div
            //             style={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "center",
            //                 whiteSpace: "nowrap"
            //             }}
            //         >
            //             <span
            //                 style={{
            //                     width: "50%",
            //                     textAlign: "left",
            //                     paddingRight: "25px"
            //                 }}
            //             >
            //                 {Number(text || 0).toLocaleString(undefined, {
            //                     minimumFractionDigits: 2,
            //                     maximumFractionDigits: 2
            //                 })}
            //             </span>

            //             <span
            //                 style={{
            //                     textAlign: "right",
            //                     width: "50%",
            //                     fontWeight: isLast ? "700" : "normal",
            //                     borderBottom: isLast ? "2px solid #000" : "none"
            //                 }}
            //             >
            //                 {isLast
            //                     ? Number(totalAmount || 0).toLocaleString(
            //                           undefined,
            //                           {
            //                               minimumFractionDigits: 2,
            //                               maximumFractionDigits: 2
            //                           }
            //                       )
            //                     : ""}
            //             </span>
            //         </div>
            //     );
            // }
        }
    ];
    const columnsPDC = [
        { dataIndex: "date", key: "date" },

        {
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: 100
        },

        {
            dataIndex: "expense_name",
            key: "expense_name",
            width: 250
        },
        {
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: 50
            // render: (text, record, index) => {
            //     const pdc = record.tableData || [];
            //     const totalAmount = pdc.reduce(
            //         (sum, item) => sum + Number(item.amount || 0),
            //         0
            //     );
            //     const isLast = index === pdc.length - 1;

            //     return (
            //         <div
            //             style={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "center",
            //                 whiteSpace: "nowrap"
            //             }}
            //         >
            //             <span
            //                 style={{
            //                     width: "50%",
            //                     textAlign: "left",
            //                     paddingRight: "25px"
            //                 }}
            //             >
            //                 {Number(text || 0).toLocaleString(undefined, {
            //                     minimumFractionDigits: 2,
            //                     maximumFractionDigits: 2
            //                 })}
            //             </span>

            //             <span
            //                 style={{
            //                     textAlign: "right",
            //                     width: "50%",
            //                     fontWeight: isLast ? "700" : "normal",
            //                     borderBottom: isLast ? "2px solid #000" : "none"
            //                 }}
            //             >
            //                 {isLast
            //                     ? Number(totalAmount || 0).toLocaleString(
            //                           undefined,
            //                           {
            //                               minimumFractionDigits: 2,
            //                               maximumFractionDigits: 2
            //                           }
            //                       )
            //                     : ""}
            //             </span>
            //         </div>
            //     );
            // }
        }
    ];

    return (
        <Card
            style={{
                backgroundColor: "white",
                border: "1px solid #000"
            }}
        >
            <Row gutter={16}>
                <Col xs={24} md={24} lg={16}>
                    <Title level={4}>Daily Disbursement</Title>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Row gutter={16}>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            className="pull-right hide-during-print"
                        >
                            <div className="ant-form-item-label">
                                <label>Bank</label>
                                <Select
                                    onChange={value => {
                                        onChangeTable("bank_id", value);
                                    }}
                                    style={{
                                        width: "200px",
                                        textAlign: "left"
                                    }}
                                    placeholder="Select Bank"
                                    allowClear
                                >
                                    <Select.Option value="">
                                        All Banks
                                    </Select.Option>
                                    {dataBanks &&
                                        dataBanks.length > 0 &&
                                        dataBanks.map(bank => (
                                            <Select.Option
                                                key={bank.id}
                                                value={bank.id}
                                            >
                                                {bank.bank_name}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </div>
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            className="pull-right hide-during-print"
                        >
                            <div className="ant-form-item-label">
                                <label>Month</label>
                                <DatePicker
                                    style={{ width: "200px" }}
                                    picker="month"
                                    onChange={dates => {
                                        onChangeTable(
                                            "month",
                                            dates.format("YYYY-MM")
                                        );
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <div id="print-table-area" ref={componentRef}>
                <div className="text-center" id="print-header">
                    <Text>
                        <Select
                            style={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: 20,
                                fontStyle: "italic",
                                border: "none"
                            }}
                            className="select-no-border"
                            defaultValue="COMMANDO SECURITY SERVICE AGENCY, INC.
                                                        (COMMANDO)"
                        >
                            <Select.Option
                                value="COMMANDO SECURITY SERVICE AGENCY, INC.
                                                            (COMMANDO)"
                            >
                                COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)
                            </Select.Option>
                            <Select.Option value="FIRST COMMANDO MANPOWER SERVICES">
                                FIRST COMMANDO MANPOWER SERVICES
                            </Select.Option>
                        </Select>

                        <br />
                        <i>
                            BUTUAN MAIN OFFICE
                            <br />
                            126 T. Calo Ext., 8600 Butuan City
                            <br />
                            Tel. No. (085) 342-8283 and (085) 341-3214
                        </i>
                    </Text>

                    <Title level={4} className="mb-0">
                        Daily Disbursement Report
                    </Title>
                </div>
                <br />

                {tableFilter.month ? (
                    <Text>
                        {dataDailyDisbursement &&
                        dataDailyDisbursement.length > 0 ? (
                            dataDailyDisbursement.map((group, index) => (
                                <div
                                    key={index}
                                    className="report-group"
                                    style={{
                                        marginBottom: 30,
                                        backgroundColor: "#f9f9f9",
                                        border: "1px solid #ccc",
                                        borderRadius: 6,
                                        padding: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#0d5b10",
                                            padding: "8px 12px",
                                            fontWeight: "bold",
                                            borderRadius: 4,
                                            marginBottom: 10,
                                            color: "#fff"
                                        }}
                                        className="report-header-print"
                                    >
                                        {group.bank_info_formatted}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <strong>
                                            Forwarded Balance : (
                                            {
                                                group.forwarded_balance_month_range
                                            }
                                            ){" "}
                                        </strong>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: 20
                                            }}
                                        >
                                            {group.forward_balance.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <strong
                                            style={{
                                                textTransform: "uppercase",
                                                fontWeight: "bold",
                                                fontSize: 16
                                            }}
                                        >
                                            Deposits
                                        </strong>
                                        <Table
                                            dataSource={group.deposits.map(
                                                (item, idx, arr) => ({
                                                    ...item,
                                                    tableData: arr
                                                })
                                            )}
                                            columns={columnsDeposit}
                                            pagination={false}
                                            bordered={false}
                                            rowKey={(record, index) => index}
                                        />
                                        {/* 
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 10,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: "90%"
                                                }}
                                            >
                                                <span>Total Deposits : </span>
                                                {group.deposits.some(
                                                    item =>
                                                        item.amount !== null &&
                                                        item.amount !==
                                                            undefined
                                                )
                                                    ? group.subtotal_deposits.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )
                                                    : ""}
                                            </span>
                                        </div> */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 10,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span>Sub-Total</span>
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    width: 220,
                                                    fontSize: 20,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {group.deposits.some(
                                                    item =>
                                                        item.amount !== null &&
                                                        item.amount !==
                                                            undefined
                                                )
                                                    ? group.subtotal_deposits.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <strong
                                            style={{
                                                textTransform: "uppercase",
                                                fontWeight: "bold",
                                                fontSize: 16
                                            }}
                                        >
                                            Expenses
                                        </strong>
                                        <Table
                                            dataSource={group.expenses.map(
                                                (item, idx, arr) => ({
                                                    ...item,
                                                    tableData: arr
                                                })
                                            )}
                                            columns={columnsExpense}
                                            pagination={false}
                                            bordered={false}
                                            rowKey={(record, index) => index}
                                        />

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 10,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span>Sub-Total</span>
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    width: 220,
                                                    fontSize: 20,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {group.expenses.some(
                                                    item =>
                                                        item.amount !== null &&
                                                        item.amount !==
                                                            undefined
                                                )
                                                    ? group.subtotal_expenses.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <strong
                                            style={{
                                                textTransform: "uppercase",
                                                fontWeight: "bold",
                                                fontSize: 16
                                            }}
                                        >
                                            Outstanding Checks
                                        </strong>
                                        <Table
                                            dataSource={group.outstanding_checks.map(
                                                (item, idx, arr) => ({
                                                    ...item,
                                                    tableData: arr
                                                })
                                            )}
                                            columns={columnsOutstandingCheck}
                                            pagination={false}
                                            bordered={false}
                                            rowKey={(record, index) => index}
                                        />

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 10,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span>Sub-Total</span>
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    width: 220,
                                                    fontSize: 20,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {/* {group.subtotal_outstandingcheck.toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2
                                                            }
                                                        )} */}
                                                {group.outstanding_checks.some(
                                                    item =>
                                                        item.amount !== null &&
                                                        item.amount !==
                                                            undefined
                                                )
                                                    ? group.subtotal_outstandingcheck.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <strong
                                            style={{
                                                textTransform: "uppercase",
                                                fontWeight: "bold",
                                                fontSize: 16
                                            }}
                                        >
                                            PDC
                                        </strong>
                                        <Table
                                            dataSource={group.pdc.map(
                                                (item, idx, arr) => ({
                                                    ...item,
                                                    tableData: arr
                                                })
                                            )}
                                            columns={columnsPDC}
                                            pagination={false}
                                            bordered={false}
                                            rowKey={(record, index) => index}
                                        />

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 10,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span>Sub-Total</span>
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    width: 220,
                                                    fontSize: 20,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {group.pdc.some(
                                                    item =>
                                                        item.amount !== null &&
                                                        item.amount !==
                                                            undefined
                                                )
                                                    ? group.subtotal_pdc.toLocaleString(
                                                          undefined,
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div
                                        className="report-total"
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            paddingRight: 10,
                                            marginTop: 5,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 18
                                            }}
                                        >
                                            Total
                                        </span>
                                        <span
                                            style={{
                                                textAlign: "right",
                                                width: 220,
                                                fontSize: 20,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {group.total_daily_disbursement.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 0",
                                    fontStyle: "italic",
                                    color: "#999"
                                }}
                            >
                                No data available.
                            </div>
                        )}
                    </Text>
                ) : (
                    <Table></Table>
                )}
            </div>

            <div className="text-right mt-10">
                <Button
                    type="primary"
                    onClick={handlePrintDailyDisbursementReport}
                >
                    Print
                </Button>
            </div>

            <style>
                {`
                            
                            
        @media print {
            @page {
                size: A4 portrait;
                margin: 10mm;
            }

    html, body {
        width: 220mm;
        height: 297mm;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        background: #ffffff !important; 
        overflow: hidden !important;
    }

    #print-table-area {
        background: #ffffff !important; 
        transform: scale(0.85);
        transform-origin: top center;
        width: 100%;
        margin: 0 auto;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .ant-card {
        background: #ffffff !important;
        box-shadow: none !important;
        border: none !important;
    }

    .hide-during-print {
        display: none !important;
    }
        

    .report-group {
        background: #ffffff !important; /* ✅ Remove gray in each report group */
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
    }

    th, td {
        font-size: 16px !important;
        padding: 4px 6px !important;
        word-wrap: break-word !important;
    }

    .report-header-print {
        background-color: #0d5b10 !important;
        color: #fff !important;
        font-weight: bold !important;
        padding: 6px 10px !important;
        border-radius: 4px !important;
        margin-bottom: 8px !important;
        text-transform: uppercase;
        font-size: 12px !important;
    }
}

        `}
            </style>
        </Card>
    );
}
