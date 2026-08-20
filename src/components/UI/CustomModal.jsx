import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Tag } from 'antd';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { db } from '../../../firebase.config';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';


const CustomModal = ({ data , updateData}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [image, setImage] = useState(null);
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [teckhawk, setTeckhawk] = useState("");
  const [teckhawks, setTeckhawks] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imgLink, setImglink] = useState("")
  const navigate = useNavigate()
// console.log(updateData)
  // open modal fecth data and export data from input fields
  const showModal = async () => {
    try {
      const docRef = doc(db, "projects", data.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newdata = docSnap.data();
        // console.log(newdata);
        setImglink(newdata.Img)
        form.setFieldsValue({
          Description: newdata.Description || "",
          Github: newdata.Github || "",
          Description: newdata.Description || "",
          Link: newdata.Link || "",
        });
        setFeatures(newdata.Features || []);
        setTeckhawks(newdata.TechStack || []);
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update project.");
    }
  };

  // update feilds endpoint submit
  const handleOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    setConfirmLoading(true);

    try {
      const project = {
        ...values,
        Features: features,
        TechStack: teckhawks,
        Img: imgLink,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "projects", data.id), project);
      message.success("Project updated successfully.");
    
      form.resetFields();
      setFeatures([]);
      setTeckhawks([]);
      updateData()
      setOpen(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update project.");
    } finally {
      setConfirmLoading(false);
    }
  };

  // modal cencel and off modal
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  // features add funtion 
  const addFeature = () => {
    if (!feature.trim()) return;

    setFeatures((prev) => [...prev, feature.trim()]);

    setFeature("");
  };

  // remove features function 
  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // teckhawk add function 
  const addTeckhawk = () => {
    if (!teckhawk.trim()) return;

    setTeckhawks((prev) => [...prev, teckhawk.trim()]);

    setTeckhawk("");
  };
  // teckhawk remove function 
  const removeTeckhawk = (index) => {
    setTeckhawks((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
          <Button
            icon={<EditOutlined />}
            onClick={showModal}
          >
            Edit
          </Button>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
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
        </Form>
      </Modal>
    </>
  );
};
export default CustomModal;