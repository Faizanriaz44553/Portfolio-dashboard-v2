import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  Tag,
  Avatar,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Card,
  Typography,
  Row,
  Col,
} from "antd";

import {
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../firebase.config";
import Customloader from "../../components/UI/Customloader";

import "./Comments.css";

const { Search } = Input;
const { Title, Text } = Typography;

const Comments = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Get Comments
  // ===============================

  const CommentsData = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "portfolio-comments"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(comments);
      setFilteredData(comments);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CommentsData();
  }, []);

  // ===============================
  // Search
  // ===============================

  const handleSearch = (value) => {
    const keyword = value.toLowerCase().trim();

    if (!keyword) {
      setFilteredData(data);
      return;
    }

    const result = data.filter((item) => {
      return (
        item.userName?.toLowerCase().includes(keyword) ||
        item.content?.toLowerCase().includes(keyword)
      );
    });

    setFilteredData(result);
  };

  // ===============================
  // Delete
  // ===============================

  const handleDelete = (id) => {
    console.log("Delete :", id);

    // Firebase Delete yahan add karenge
  };

  // ===============================
  // View
  // ===============================

  const handleView = (record) => {
    console.log(record);

    // Modal next part me banayenge
  };

  // ===============================
  // Columns
  // ===============================

  const columns = [
    {
      title: "#",
      width: 70,
      align: "center",
      render: (_, record, index) => index + 1,
    },

    {
      title: "User",

      render: (_, record) => (
        <Space size={12}>
          <Avatar
            size={45}
            src={record.profileImage}
            icon={!record.profileImage && <UserOutlined />}
          >
            {!record.profileImage &&
              record.userName?.charAt(0).toUpperCase()}
          </Avatar>

          <div className="comments-user-info">
            <Text strong className="comments-user-name">
              {record.userName}
            </Text>

            <Text className="comments-user-date">
              {record.createdAt?.toDate().toLocaleString()}
            </Text>
          </div>
        </Space>
      ),
    },

    {
      title: "Comment",

      render: (_, record) => (
        <Text className="comments-message">
          {record.content}
        </Text>
      ),
    },

    {
      title: "Status",

      align: "center",

      render: () => (
        <Tag color="green">
          Active
        </Tag>
      ),
    },

    {
      title: "Actions",

      align: "center",

      render: (_, record) => (
        <Space>

          <Tooltip title="View Comment">
            <Button
              type="text"
              className="comments-view-btn"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Comment?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Delete">

              <Button
                danger
                type="text"
                className="comments-delete-btn"
                icon={<DeleteOutlined />}
              />

            </Tooltip>

          </Popconfirm>

        </Space>
      ),
    },
  ];
    return (
    <div className="comments-main-wrapper">

      {/* ================= HEADER ================= */}

      <div className="comments-header">

        <div className="comments-header-left">
          <Title
            level={2}
            className="comments-page-title"
          >
            <MessageOutlined className="comments-title-icon" />
            All Comments
          </Title>

          <Text className="comments-page-subtitle">
            Manage all portfolio comments from one place.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          type="primary"
          size="large"
          onClick={CommentsData}
          loading={loading}
          className="comments-refresh-btn"
        >
          Refresh
        </Button>

      </div>

      {/* ================= STATS ================= */}

      <Row
        gutter={[20, 20]}
        className="comments-stats-row"
      >

        <Col xs={24} md={8}>

          <Card className="comments-stats-card">

            <Text className="comments-stats-title">
              Total Comments
            </Text>

            <Title
              level={2}
              className="comments-stats-value"
            >
              {filteredData.length}
            </Title>

          </Card>

        </Col>

        <Col xs={24} md={8}>

          <Card className="comments-stats-card">

            <Text className="comments-stats-title">
              Latest User
            </Text>

            <Title
              level={4}
              className="comments-stats-value"
            >
              {filteredData[0]?.userName || "--"}
            </Title>

          </Card>

        </Col>

        <Col xs={24} md={8}>

          <Card className="comments-stats-card">

            <Text className="comments-stats-title">
              Latest Comment
            </Text>

            <Title
              level={5}
              className="comments-stats-value"
            >
              {filteredData[0]?.createdAt
                ?.toDate()
                .toLocaleDateString() || "--"}
            </Title>

          </Card>

        </Col>

      </Row>

      {/* ================= SEARCH ================= */}

      <Card className="comments-search-card">

        <Search
          placeholder="Search by username or comment..."
          enterButton={
            <>
              <SearchOutlined />
              Search
            </>
          }
          size="large"
          allowClear
          loading={loading}
          onSearch={handleSearch}
        />

      </Card>

      {/* ================= TABLE ================= */}

      <Card className="comments-table-card">

        {
          loading ?

            <Customloader />

            :

            <Table

              rowKey="id"

              columns={columns}

              dataSource={filteredData}

              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                position: ["bottomCenter"],
              }}

              scroll={{
                x: 900,
              }}

            />
        }

      </Card>

    </div>
  );
};

export default Comments;