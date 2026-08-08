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
  Modal,
  message,
} from "antd";

import {
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import {
  collection,
  deleteDoc,
  doc,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilter , setmodalFilter] = useState()

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

  const handleDelete = async(id) => {
    console.log("Delete :", id);
     try {
            const deleteRef = doc(db, "portfolio-comments", id);
            await deleteDoc(deleteRef);
      
            console.log(`Deleted successfully. ID: ${id}`);
       setData((prev) => prev.filter((item) => item.id !== id));
       message.success("Comment deleted successfully.");
       CommentsData()
     } catch (error) {
               console.error(error);
      message.error("Failed to add project.");
     }
  };

  // ===============================
  // View
  // ===============================


    const showModal = (record) => {
      setIsModalOpen(true);
      console.log(record);
      setmodalFilter(record)
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
              onClick={() => showModal(record)}
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
          data.length === 0 ?

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
<Modal
  title="Comment Details"
  open={isModalOpen}
  onCancel={handleCancel}
  footer={null}
  centered
  width={500}
  className="comments-view-modal"
>
  <div className="comments-modal-content">

    {/* User */}
    <div className="comments-modal-user">

      <Avatar
        size={52}
        src={modalFilter?.profileImage || undefined}
        icon={
          !modalFilter?.profileImage && <UserOutlined />
        }
      >
        {!modalFilter?.profileImage &&
          modalFilter?.userName?.charAt(0).toUpperCase()}
      </Avatar>

      <div className="comments-modal-user-info">

        <h3>
          {modalFilter?.userName}
        </h3>

        <span>
          <ClockCircleOutlined />
          {modalFilter?.createdAt
            ?.toDate()
            .toLocaleString()}
        </span>

      </div>

    </div>

    {/* Comment */}
    <div className="comments-modal-comment">

      <p>
        {modalFilter?.content}
      </p>

    </div>

  </div>
</Modal>
    </div>
  );
};

export default Comments;