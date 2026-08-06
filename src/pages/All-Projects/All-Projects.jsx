import React, { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config.js";
import Customloader from "../../components/UI/Customloader.jsx";
import './All-Projects.css'

const { Meta } = Card;

const AllProjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  console.log();
  
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
    <div
     className="allprojects-main-wrapper"
    >
      {data.map((item) => (
        <Card
          key={item.id}
          hoverable
          variant="borderless"
          className="allprojects-main-wrapper-card"
          cover={
            <img
              draggable={false}
              alt={item.Description}
              src={item.Img}
            />
          }
        >
          <Meta title={item.Description} />

          <br />

          <a
            href={item.Link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy Link
          </a>

          <br />

          <a
            href={item.Github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <br />
          <br />

          <Button
            type="primary"
            danger
            onClick={() => DeleteData(item.id)}
            loading={deletingId === item.id}
            disabled={deletingId === item.id}
            className="submit-btn"
          >
            {deletingId === item.id ? "Deleting..." : "Delete"}
          </Button>
        </Card>
      ))}

      {data.length === 0 && (
        <h3>No projects found.</h3>
      )}
    </div>
  );
};

export default AllProjects;