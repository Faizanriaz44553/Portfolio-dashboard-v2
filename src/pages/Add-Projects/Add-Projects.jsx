import React, { useState } from "react";
import { Button, Form, Input, Upload, Tag } from "antd";
import "./Add-project.css";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { validateImage } from "../../utils/validateImage";
import { uploadImage } from "../../services/cloudinary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { message } from "antd";
import { db } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";

const AddProjects = () => {
  const [image, setImage] = useState(null);
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [teckhawk, setTeckhawk] = useState("");
  const [teckhawks, setTeckhawks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const addFeature = () => {
    if (!feature.trim()) return;

    setFeatures((prev) => [...prev, feature.trim()]);

    setFeature("");
  };
  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };
  const addTeckhawk = () => {
    if (!teckhawk.trim()) return;

    setTeckhawks((prev) => [...prev, teckhawk.trim()]);

    setTeckhawk("");
  };
  const removeTeckhawk = (index) => {
    setTeckhawks((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await uploadImage(image);

      if (!result.success) {
        message.error(result.message);
        return;
      }

      const project = {
        ...values,
        Features: features,
        TechStack: teckhawks,
        Img: result.url,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "projects"), project);

      message.success("Project added successfully.");

      console.log(project);

      form.resetFields();

      setFeature("");
      setFeatures([]);
      setTeckhawk("");
      setTeckhawks([]);
      setImage(null);
      navigate("/all-projects")
    } catch (error) {
      console.error(error);
      message.error("Failed to add project.");
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className="projects-page-shell">
      <div className="main-wrapper-add-project">
        <div className="page-header">
          <span className="page-kicker">Portfolio</span>
          <h1>Add Projects</h1>
        </div>

        <Form
          form={form}
          name="basic"
           layout="vertical"
  className="projects-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: "Add description" }]}
          >
            <TextArea rows={4} className="project-textarea" />
          </Form.Item>

          <Form.Item label="Feature" className="tag-field">
            <div className="array-input">
              <Input
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="Add Feature"
                className="tag-input"
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addFeature}
                className="tag-add-button"
              >
                Add
              </Button>
            </div>

            <div className="array-tags">
              {features.map((item, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => removeFeature(index)}
                  color="blue"
                  className="project-tag"
                >
                  {item}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            label="Github"
            name="Github"
            rules={[{ required: true, message: "Add github link" }]}
          >
            <Input className="project-input" />
          </Form.Item>

          <Form.Item
            label="Deploy url"
            name="Link"
            rules={[{ required: true, message: "Add deploy url" }]}
          >
            <Input className="project-input" />
          </Form.Item>

          <Form.Item label="Teckhawk" className="tag-field">
            <div className="array-input tech-input-group">
              <Input
                value={teckhawk}
                onChange={(e) => setTeckhawk(e.target.value)}
                placeholder="Add Tech Stack"
                className="tag-input"
              />

              <Button
                icon={<PlusOutlined />}
                onClick={addTeckhawk}
                className="tag-add-button secondary-btn"
              >
                Add
              </Button>
            </div>

            <div className="array-tags tech-tags">
              {teckhawks.map((item, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => removeTeckhawk(index)}
                  className="project-tag"
                >
                  {item}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="upload">
                      <div className="upload-section">
            <div className="upload-card">
              <Upload
                listType="picture-card"
                maxCount={1}
                className="project-upload"
                beforeUpload={(file) => {
                  const result = validateImage(file);

                  if (!result.valid) {
                    message.error(result.message);
                    return Upload.LIST_IGNORE;
                  }

                  setImage(file);

                  return false;
                }}
              >
                <div className="upload-content">
                  <PlusOutlined />
                  <div className="upload-label">Upload</div>
                </div>
              </Upload>
            </div>
          </div>
</Form.Item>

          <Form.Item >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            className="submit-btn"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddProjects;
