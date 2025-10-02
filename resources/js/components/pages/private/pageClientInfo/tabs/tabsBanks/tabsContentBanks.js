import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import { Button, Col, Input, Popconfirm, Row, Table } from "antd";

import ModalBanks from "./modalBanks";

export default function TabsContentBanks(props) {
    const { client_id } = props;
    // console.log("client_id TabsContentBanks  ", client_id);

    const [togglemodalBanks, setTogglemodalBanks] = useState({
        open: false,
        data: null
    });

    const columns = [
        {
            title: "Bank Name",
            dataIndex: "bank_name",
            key: "bank_name"
        },
        {
            title: "Notes",
            dataIndex: "Notes",
            key: "Notes"
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
                        // placeholder="Search Employee"
                        // onSearch={value => handleSearchEmployee(value)}
                        // style={{ width: "100%" }}
                        // className="pull-right"
                        // onChange={e => handleSearchEmployee(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Table columns={columns} />

            <ModalBanks
                togglemodalBanks={togglemodalBanks}
                setTogglemodalBanks={setTogglemodalBanks}
            />
        </>
    );
}
