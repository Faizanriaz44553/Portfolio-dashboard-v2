import { Button, Form, Input, Tag, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import Customloader from "../../components/UI/Customloader.jsx";

const AddHeader = () => {
  const [form] = Form.useForm();

  const [subtitle, setSubtitle] = useState("");
  const [features, setFeatures] = useState([]);

  const [teckhawk, setTeckhawk] = useState("");
  const [teckhawks, setTeckhawks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ==========================
  // Load Header Data
  // ==========================

  useEffect(() => {
    loadHeader();
  }, []);

  const loadHeader = async () => {
    try {
      setPageLoading(true);

      const docRef = doc(db, "header", "main");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        form.setFieldsValue({
          title1: data.title1 || "",
          title2: data.title2 || "",
          Description: data.Description || "",
        });

        setFeatures(data.Features || []);
        setTeckhawks(data.TechStack || []);
      }
    } catch (error) {
      console.error(error);
      message.error("Unable to load header.");
    } finally {
      setPageLoading(false);
    }
  };

  // ==========================
  // Subtitle
  // ==========================

  const addSubtitle = () => {
    if (!subtitle.trim()) return;

    setFeatures((prev) => [...prev, subtitle.trim()]);
    setSubtitle("");
  };

  const removeSubtitle = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================
  // Tech Stack
  // ==========================

  const addTeckhawk = () => {
    if (!teckhawk.trim()) return;

    setTeckhawks((prev) => [...prev, teckhawk.trim()]);
    setTeckhawk("");
  };

  const removeTeckhawk = (index) => {
    setTeckhawks((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================
  // Submit
  // ==========================

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const project = {
        title1: values.title1 || "",
        title2: values.title2 || "",
        Description: values.Description || "",
        Features: features,
        TechStack: teckhawks,
      };

      await setDoc(doc(db, "header", "main"), project);

      message.success("Header updated successfully.");
    } catch (error) {
      console.error(error);
      message.error("Failed to update header.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

 
  return (
    <div>
      <div className="page-header">
        <span className="page-kicker">Portfolio</span>
        <h1>Header Settings</h1>
      </div>
      {pageLoading ? <Customloader /> :
      <Form
        form={form}
        layout="vertical"
        className="projects-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* Title One */}

        <Form.Item
          label="Title One"
          name="title1"
          rules={[
            {
              required: true,
              message: "Please enter title one.",
            },
          ]}
        >
          <Input
            className="project-input"
            placeholder="e.g. Frontend"
          />
        </Form.Item>

        {/* Title Two */}

        <Form.Item
          label="Title Two"
          name="title2"
          rules={[
            {
              required: true,
              message: "Please enter title two.",
            },
          ]}
        >
          <Input
            className="project-input"
            placeholder="e.g. Developer"
          />
        </Form.Item>

        {/* Description */}

        <Form.Item
          label="Description"
          name="Description"
          rules={[
            {
              required: true,
              message: "Please enter description.",
            },
          ]}
        >
          <TextArea
            rows={4}
            className="project-textarea"
            placeholder="Add description..."
          />
        </Form.Item>

        {/* Subtitle */}

        <Form.Item label="Subtitle">
          <div className="array-input">
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Network & Telecom Student"
              className="tag-input"
              onPressEnter={(e) => {
                e.preventDefault();
                addSubtitle();
              }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addSubtitle}
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
                onClose={() => removeSubtitle(index)}
                color="blue"
                className="project-tag"
              >
                {item}
              </Tag>
            ))}
          </div>
        </Form.Item>

        {/* Tech Stack */}

        <Form.Item label="Tech Stack">
          <div className="array-input">
            <Input
              value={teckhawk}
              onChange={(e) => setTeckhawk(e.target.value)}
              placeholder="e.g. React.js"
              className="tag-input"
              onPressEnter={(e) => {
                e.preventDefault();
                addTeckhawk();
              }}
            />

            <Button
              onClick={addTeckhawk}
              icon={<PlusOutlined />}
              className="tag-add-button secondary-btn"
            >
              Add
            </Button>
          </div>

          <div className="array-tags">
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

        <Form.Item style={{ marginTop: 30 }}>
          <Button
            htmlType="submit"
            type="primary"
            className="submit-btn"
            loading={loading}
            disabled={loading}
            block
          >
            {loading ? "Saving..." : "Save Header"}
          </Button>
        </Form.Item>
      </Form>}

    </div>
  );
}

export default AddHeader