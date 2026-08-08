import React, { useEffect, useState } from "react";
import { Button, Card, message, Popconfirm, Tag } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config.js";
import Customloader from "../../components/UI/Customloader.jsx";
import './All-Projects.css'
import {
  GlobalOutlined,
  GithubOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

const AllProjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  console.log(data);
  
  const DeleteData = async (id) => {
    setDeletingId(id);

    try {
      const deleteRef = doc(db, "projects", id);
      await deleteDoc(deleteRef);

      console.log(`Deleted successfully. ID: ${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));

      message.success("Deleted successfully");
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const HandleEdit = async (item) => {
    console.log(item);
    
  }

  const AllData = async () => {
    setLoading(true);

    try {
      const querySnapshot = await getDocs(collection(db, "projects"));

      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(projects);
    } catch (error) {
      console.log(error.message);
      message.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AllData();
  }, []);

  if (loading) {
    return <Customloader />;
  }

  return (
    <div className="allprojects-main-wrapper">

  {/* PAGE HEADER */}

  <div className="allprojects-header">

    <div className="allprojects-heading-content">

      <h1 className="allprojects-heading">
        All Projects
      </h1>

      <p className="allprojects-heading-description">
        View and manage all projects added to your portfolio.
      </p>

    </div>

    <div className="allprojects-total">
      <span>Total Projects</span>
      <strong>{data.length}</strong>
    </div>

  </div>


  {/* PROJECTS */}

  <div className="allprojects-grid">

    {data.map((item) => (

      <Card
        key={item.id}
        className="allprojects-card"
        cover={
          <div className="allprojects-image-wrapper">
            <img
              src={item.Img}
              alt="Project"
              className="allprojects-project-image"
              draggable={false}
            />
          </div>
        }
      >

        <h3 className="allprojects-project-title">
          {item.title || "Portfolio Project"}
        </h3>

        <p className="allprojects-description">
          {item.Description}
        </p>

        <div className="allprojects-date">
          <CalendarOutlined />

          {item.createdAt
            ?.toDate()
            .toLocaleDateString()}
        </div>

        <div className="allprojects-actions">
          <Button
            icon={<EditOutlined />}
            onClick={() => HandleEdit(item)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this project?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
            onConfirm={() => DeleteData(item.id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deletingId === item.id}
            >
              Delete
            </Button>
          </Popconfirm>

        </div>

      </Card>

    ))}

  </div>


  {/* EMPTY */}

  {data.length === 0 && (
    <div className="allprojects-empty">
      <AppstoreOutlined />

      <h3>No Projects Yet</h3>

      <p>
        Projects added to your portfolio will appear here.
      </p>
    </div>
  )}

</div>

  );
};

export default AllProjects;