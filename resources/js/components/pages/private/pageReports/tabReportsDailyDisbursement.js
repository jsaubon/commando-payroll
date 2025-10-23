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
        content: () => componentRef.current
        // removeAfterPrint: true
    });

    const columnsDeposit = [
        {
            title: "Date Deposited",
            dataIndex: "date_deposited_formatted",
            key: "date_deposited_formatted",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Bank Transaction Date",
            dataIndex: "bank_transaction_date_formatted",
            key: "bank_transaction_date_formatted",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Deposit Name",
            dataIndex: "deposit_name",
            key: "deposit_name",
            width: "35%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: "15%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>
                    {Number(text || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            )
        }
    ];

    const columnsExpense = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Bank Transaction Date",
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            key: "expense_name",
            width: "35%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: "15%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>
                    {Number(text || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            )
        }
    ];

    const columnsOutstandingCheck = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Bank Transaction Date",
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            key: "expense_name",
            width: "35%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: "15%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>
                    {Number(text || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            )
        }
    ];

    const columnsPDC = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Bank Transaction Date",
            dataIndex: "bank_transaction_date",
            key: "bank_transaction_date",
            width: "25%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            key: "expense_name",
            width: "35%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>{text}</div>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: "15%",
            render: text => (
                <div style={{ fontSize: "10px", lineHeight: "1" }}>
                    {Number(text || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            )
        }
    ];

    return (
        <Card style={{ backgroundColor: "white" }}>
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
                                <label>Banks</label>
                                <Select
                                    onChange={value => {
                                        onChangeTable("bank_id", value);
                                    }}
                                    style={{
                                        width: "200px",
                                        textAlign: "left"
                                    }}
                                    placeholder="Select Banks"
                                    label="Select Banks"
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
                                <label>Months</label>
                                <DatePicker
                                    style={{ width: "200px" }}
                                    label="Select Months"
                                    placeholder="Select Months"
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

            <div>
                <div className="text-center" id="print-header">
                    <Text>
                        <Select
                            style={{
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
                        <div
                            style={{
                                fontSize: "10px",
                                fontStyle: "italic"
                            }}
                        >
                            BUTUAN MAIN OFFICE
                            <br />
                            126 T. Calo Ext., 8600 Butuan City
                            <br />
                            Tel. No. (085) 342-8283 and (085) 341-3214
                        </div>
                        <Title level={4}>Daily DisbursementReport</Title>
                    </Text>
                </div>

                <div id="print-table-area" ref={componentRef}>
                    {tableFilter.month ? (
                        <div>
                            {dataDailyDisbursement &&
                            dataDailyDisbursement.length > 0 ? (
                                dataDailyDisbursement.map((group, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="bank-section"
                                            style={{
                                                marginBottom: "6px",
                                                backgroundColor: "#ffffff",
                                                // border: "1px solid #ddd",
                                                // borderRadius: "2px",
                                                padding: "4px"
                                            }}
                                        >
                                            <div
                                                className="text-center"
                                                style={{
                                                    marginBottom: "10px",
                                                    paddingBottom: "5px"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        marginBottom: "2px"
                                                    }}
                                                >
                                                    COMMANDO SECURITY SERVICE
                                                    AGENCY, INC. (COMMANDO)
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "10px",
                                                        fontStyle: "italic"
                                                    }}
                                                >
                                                    BUTUAN MAIN OFFICE
                                                    <br />
                                                    126 T. Calo Ext., 8600
                                                    Butuan City
                                                    <br />
                                                    Tel. No. (085) 342-8283 and
                                                    (085) 341-3214
                                                    <br />
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    Daily Disbursement Report
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    backgroundColor: "#0d5b10",
                                                    padding: "3px 5px",
                                                    fontWeight: "bold",
                                                    borderRadius: "1px",
                                                    marginBottom: "4px",
                                                    color: "#fff",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                {group.bank_info_formatted}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "6px",
                                                    fontSize: "12px",
                                                    padding: "3px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "1px"
                                                }}
                                            >
                                                <strong
                                                    style={{ color: "#000" }}
                                                >
                                                    Forwarded Balance (
                                                    {
                                                        group.forwarded_balance_month_range
                                                    }
                                                    )
                                                </strong>
                                                <strong
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#000"
                                                    }}
                                                >
                                                    {group.forward_balance.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}
                                                </strong>
                                            </div>

                                            <div
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <strong
                                                    style={{
                                                        fontSize: "12px",
                                                        textTransform:
                                                            "uppercase",
                                                        display: "block",
                                                        marginBottom: "2px",
                                                        color: "#000"
                                                    }}
                                                >
                                                    Deposits
                                                </strong>
                                                <Table
                                                    className="fixed-width-table"
                                                    dataSource={
                                                        group.deposits &&
                                                        group.deposits.length >
                                                            0
                                                            ? group.deposits
                                                            : []
                                                    }
                                                    columns={columnsDeposit}
                                                    pagination={false}
                                                    rowKey={(record, index) =>
                                                        index
                                                    }
                                                    size="small"
                                                    style={{
                                                        marginBottom: "2px"
                                                    }}
                                                    locale={{
                                                        emptyText: "No data"
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        padding: "2px 4px",
                                                        fontWeight: "bold",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            "#f1f3f4",
                                                        borderRadius: "1px"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        Sub-Total
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        {group.deposits &&
                                                        group.deposits.length >
                                                            0
                                                            ? group.subtotal_deposits.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      minimumFractionDigits: 2
                                                                  }
                                                              )
                                                            : "0.00"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expenses Section */}
                                            <div
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <strong
                                                    style={{
                                                        fontSize: "12px",
                                                        textTransform:
                                                            "uppercase",
                                                        display: "block",
                                                        marginBottom: "2px",
                                                        color: "#000"
                                                    }}
                                                >
                                                    Expenses
                                                </strong>
                                                <Table
                                                    className="fixed-width-table"
                                                    dataSource={
                                                        group.expenses &&
                                                        group.expenses.length >
                                                            0
                                                            ? group.expenses
                                                            : []
                                                    }
                                                    columns={columnsExpense}
                                                    pagination={false}
                                                    rowKey={(record, index) =>
                                                        index
                                                    }
                                                    size="small"
                                                    style={{
                                                        marginBottom: "2px"
                                                    }}
                                                    locale={{
                                                        emptyText: "No data"
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        padding: "2px 4px",
                                                        fontWeight: "bold",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            "#f1f3f4",
                                                        borderRadius: "1px"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        Sub-Total
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        {group.expenses &&
                                                        group.expenses.length >
                                                            0
                                                            ? group.subtotal_expenses.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      minimumFractionDigits: 2
                                                                  }
                                                              )
                                                            : "0.00"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Outstanding Checks Section */}
                                            <div
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <strong
                                                    style={{
                                                        fontSize: "12px",
                                                        textTransform:
                                                            "uppercase",
                                                        display: "block",
                                                        marginBottom: "2px",
                                                        color: "#000"
                                                    }}
                                                >
                                                    Outstanding Checks
                                                </strong>
                                                <Table
                                                    dataSource={
                                                        group.outstanding_checks &&
                                                        group.outstanding_checks
                                                            .length > 0
                                                            ? group.outstanding_checks
                                                            : []
                                                    }
                                                    columns={
                                                        columnsOutstandingCheck
                                                    }
                                                    pagination={false}
                                                    rowKey={(record, index) =>
                                                        index
                                                    }
                                                    size="small"
                                                    style={{
                                                        marginBottom: "2px"
                                                    }}
                                                    locale={{
                                                        emptyText: "No data"
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        padding: "2px 4px",
                                                        fontWeight: "bold",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            "#f1f3f4",
                                                        borderRadius: "1px"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        Sub-Total
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        {group.outstanding_checks &&
                                                        group.outstanding_checks
                                                            .length > 0
                                                            ? group.subtotal_outstandingcheck.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      minimumFractionDigits: 2
                                                                  }
                                                              )
                                                            : "0.00"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* PDC Section */}
                                            <div
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <strong
                                                    style={{
                                                        fontSize: "12px",
                                                        textTransform:
                                                            "uppercase",
                                                        display: "block",
                                                        marginBottom: "2px",
                                                        color: "#000"
                                                    }}
                                                >
                                                    PDC
                                                </strong>
                                                <Table
                                                    dataSource={
                                                        group.pdc &&
                                                        group.pdc.length > 0
                                                            ? group.pdc
                                                            : []
                                                    }
                                                    columns={columnsPDC}
                                                    pagination={false}
                                                    rowKey={(record, index) =>
                                                        index
                                                    }
                                                    size="small"
                                                    style={{
                                                        marginBottom: "2px"
                                                    }}
                                                    locale={{
                                                        emptyText: "No data"
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        padding: "2px 4px",
                                                        fontWeight: "bold",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            "#f1f3f4",
                                                        borderRadius: "1px"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        Sub-Total
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#000"
                                                        }}
                                                    >
                                                        {group.pdc &&
                                                        group.pdc.length > 0
                                                            ? group.subtotal_pdc.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      minimumFractionDigits: 2
                                                                  }
                                                              )
                                                            : "0.00"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Total Section */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    padding: "3px 5px",
                                                    fontWeight: "bold",
                                                    fontSize: "14px",
                                                    backgroundColor: "#e8f5e8",
                                                    borderRadius: "1px",
                                                    border: "1px solid #0d5b10",
                                                    marginTop: "4px"
                                                }}
                                            >
                                                <span style={{ color: "#000" }}>
                                                    TOTAL
                                                </span>
                                                <span style={{ color: "#000" }}>
                                                    {group.total_daily_disbursement.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "15px 0",
                                        fontStyle: "italic",
                                        color: "#666",
                                        fontSize: "8px"
                                    }}
                                >
                                    No data available.
                                </div>
                            )}
                        </div>
                    ) : (
                        <Table></Table>
                    )}
                </div>
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
            margin: 8mm;
        }

        html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-size: 6px !important;
            line-height: 1 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-family: Arial, sans-serif !important;
        }

        #print-table-area {
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: white !important;
            position: static !important;
            min-height: auto !important;
            height: auto !important;
            page-break-after: auto !important;

        }

        .ant-card, .ant-card-body {
            all: unset !important;
            display: block !important;
            background: white !important;
            width: 100% !important;
        }

        .hide-during-print {
            display: none !important;
        }

        // #print-header {
        //     margin-bottom: 2px !important;
        //     padding-bottom: 2px !important;
        //     text-align: center !important;
            
        // }

        .page-header {
            margin-bottom: 4px !important;
            padding-bottom: 2px !important;
            border-bottom: 1px solid #0d5b10 !important;
            text-align: center !important;

        }

        .bank-section {
            margin-bottom: 4px !important;
            border: 1px solid #ccc !important;
            padding: 3px !important;
            background: white !important;
            width: 100% !important;
            page-break-inside: auto !important; 
            break-inside: auto !important;
        }

        .bank-section:not(:first-child) {
            page-break-before: always !important;
        }


        .ant-table-thead > tr > th {
            padding: 1px 2px !important;
            font-size: 12px !important;
            background: #fafafa !important;
            font-weight:  600 !important;
            border-bottom: 1px solid #ddd !important;
            height: 8px !important;
            line-height: 1 !important;
            // color: #000 !important;
        }
            

        .ant-table-tbody > tr > td {
            padding: 1px 2px !important;
            font-size: 6px !important;
            border-bottom: 1px solid #eee !important;
            height: 7px !important;
            line-height: 1 !important;
            // color: #000 !important;
        }

        .ant-table-tbody > tr {
            height: 8px !important;
            page-break-inside: avoid !important; 
            break-inside: avoid !important;

        }

        .ant-table-thead > tr > th {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
            .fixed-width-table {
  table-layout: fixed;
}

       .fixed-width-table table {
            table-layout: fixed !important;
            width: 100% !important;
            }

            .fixed-width-table .ant-table-thead > tr > th,
            .fixed-width-table .ant-table-tbody > tr > td {
                width: auto !important;
                text-align: left;
                white-space: nowrap;
                }
            .col-date {
            width: 50px !important;
            }

            .col-bank-date {
            width: 50px !important;
            }

            .col-name {
            width: 70px !important;
            }

            .col-amount {
            width: 40px !important;
            }
        .ant-table-thead > tr > th .ant-table-cell {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-size: 15px !important;
        }

        .ant-table-placeholder {
            font-size: 5px !important;
            padding: 3px !important;
            color: #666 !important;
        }

        .bank-section > div {
            margin-bottom: 3px !important;
            font-size: 12px !important;
        }

        strong, span, div {
            // color: #000 !important;
        }

        .ant-table-wrapper {
            page-break-inside: auto !important;
        }

        .ant-table-tbody > tr {
            height: 8px !important;
        }
        .ant-table-tbody > t {
            height: 8px !important;
        }


        .ant-table-thead > tr {
            height: 8px !important;
    }

    @media screen {
        .bank-section {
            margin-bottom: 10px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .page-header {
            display: none;
        }
    }
    `}
            </style>
        </Card>
    );
}
