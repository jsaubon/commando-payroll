// src/pages/reports/TabReportsDailyDisbursement.jsx
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
    const [dataClientName, setDataClientName] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [dataDailyDisbursement, setDataDailyDisbursement] = useState(null);
    const [tableFilter, setTableFilter] = useState({
        client_id: "",
        month_start: "",
        month_end: ""
    });

    useEffect(() => {
        fetchData("GET", "api/client?sort=asc").then(res => {
            if (res.success) setDataClientName(res.data);
        });
        return () => {};
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
    });

    const columnsDeposit = [
        { title: "Date", dataIndex: "date", key: "date" },
        {
            title: "Deposit Name",
            dataIndex: "client_deposit_name",
            key: "client_deposit_name",
            width: 200
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: value =>
                value
                    ? parseFloat(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                      })
                    : ""
        }
    ];

    const columnsExpense = [
        { dataIndex: "date", key: "date" },
        {
            title: "Expense",
            dataIndex: "client_expense_name",
            key: "client_expense_name",
            width: 200
        },
        {
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: value =>
                value
                    ? parseFloat(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                      })
                    : ""
        }
    ];

    return (
        <Card>
            <Title level={4}>Daily Disbursement</Title>

            <div id="print-container" ref={componentRef}>
                <div className="text-center">
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
                            placeholder="Select Company"
                            value={
                                selectedType ||
                                (dataClientName && dataClientName.length > 0
                                    ? dataClientName[0].id
                                    : null)
                            }
                            onChange={value => {
                                setSelectedType(value);
                                onChangeTable("client_id", value);
                            }}
                        >
                            {dataClientName && (
                                <>
                                    {(() => {
                                        const commando = dataClientName.find(
                                            c => c.type === "Commando"
                                        );
                                        const firstCommando = dataClientName.find(
                                            c => c.type === "First Commando"
                                        );
                                        const sameId =
                                            commando &&
                                            firstCommando &&
                                            commando.id === firstCommando.id;

                                        return (
                                            <>
                                                {commando && (
                                                    <Select.Option
                                                        value={commando.id}
                                                    >
                                                        {sameId
                                                            ? commando.type.toUpperCase()
                                                            : "COMMANDO SECURITY SERVICE AGENCY, INC. (COMMANDO)"}
                                                    </Select.Option>
                                                )}
                                                {firstCommando && (
                                                    <Select.Option
                                                        value={firstCommando.id}
                                                    >
                                                        {sameId
                                                            ? firstCommando.type.toUpperCase()
                                                            : "FIRST COMMANDO MANPOWER SERVICES"}
                                                    </Select.Option>
                                                )}
                                            </>
                                        );
                                    })()}
                                </>
                            )}
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

                    <Row gutter={16} className="mt-10 hide-during-print">
                        <Col xs={12} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>NAME OF CLIENT </label>
                                <Select
                                    className="select-br-b-only"
                                    name="client_id"
                                    style={{ width: 200 }}
                                    allowClear
                                    showSearch
                                    showArrow={false}
                                    value={tableFilter.client_id}
                                    onChange={value => {
                                        onChangeTable("client_id", value ?? "");
                                    }}
                                >
                                    {dataClientName &&
                                        dataClientName.map(
                                            (clientName, key) => (
                                                <Select.Option
                                                    value={clientName.id}
                                                    key={key}
                                                >
                                                    {clientName.name}
                                                </Select.Option>
                                            )
                                        )}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={12} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>Month Range </label>
                                <DatePicker.RangePicker
                                    picker="month"
                                    onChange={dates => {
                                        onChangeTable(
                                            "month_start",
                                            dates
                                                ? dates[0]
                                                      .startOf("month")
                                                      .format("YYYY-MM-DD")
                                                : ""
                                        );
                                        onChangeTable(
                                            "month_end",
                                            dates
                                                ? dates[1]
                                                      .endOf("month")
                                                      .format("YYYY-MM-DD")
                                                : ""
                                        );
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Title level={4} className="mb-0">
                        Daily Disbursement
                    </Title>
                </div>
                <br />

                {tableFilter.client_id &&
                tableFilter.month_start &&
                tableFilter.month_end ? (
                    <Text>
                        {dataDailyDisbursement &&
                        dataDailyDisbursement.length > 0 ? (
                            dataDailyDisbursement.map((group, index) => (
                                <div
                                    key={index}
                                    className="report-group"
                                    style={{
                                        marginBottom: 40,
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
                                        {group.client &&
                                        group.client.type === "Commando"
                                            ? "COMMANDO SECURITY SERVICE AGENCY, INC.".toUpperCase()
                                            : group.client &&
                                              group.client.type ===
                                                  "First Commando"
                                            ? "FIRST COMMANDO MANPOWER SERVICES".toUpperCase()
                                            : group.client_bank_info.toUpperCase()}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <strong>
                                            Forwarded Balance :{" "}
                                            {group.forwarded_balance_month_range
                                                ? `(${group.forwarded_balance_month_range.end_date})`
                                                : ""}
                                        </strong>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: 20
                                            }}
                                        >
                                            {group.forwarded_balance.toLocaleString(
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
                                            dataSource={group.deposits}
                                            columns={columnsDeposit}
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
                                                {group.subtotal_deposits.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <span
                                            style={{
                                                textTransform: "uppercase",
                                                fontWeight: "bold",
                                                fontSize: 16
                                            }}
                                        >
                                            Expenses
                                        </span>
                                        <Table
                                            columns={columnsExpense}
                                            dataSource={group.expenses}
                                            pagination={false}
                                            bordered={false}
                                            rowKey={(record, index) => index}
                                        />

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingRight: 10,
                                                marginTop: 5,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <span>Sub-Total </span>
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    width: 220,
                                                    fontSize: 18,
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
                                        <span>Total</span>
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
        </Card>
    );
}
