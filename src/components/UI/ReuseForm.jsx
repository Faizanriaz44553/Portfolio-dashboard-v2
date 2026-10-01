import React, { useState } from "react";
import { Button, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ReuseForm = ({isloading, inputs, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState(() => {
    const defaultValues = {};

    inputs.forEach((input) => {
      defaultValues[input.name] = initialValues[input.name] ?? "";
    });

    return defaultValues;
  });

  const handleChange = (e, input) => {
    // File field
    if (input.type === "file") {
      const file = e.file;

      setFormData((prev) => ({
        ...prev,
        [input.name]: file,
      }));

      return;
    }

    // Normal fields
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
console.log(isloading);

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input) => (
        <div
          key={input.name}
          style={{ marginBottom: "16px" }}
        >
          <label>{input.label}</label>
          <br />

          {input.type === "file" ? (
            <div className="upload-section">
              <div className="upload-card">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={(info) => handleChange(info, input)}
                >
                  <div className="upload-content">
                    <PlusOutlined />
                    <div className="upload-label">{input.label}</div>
                  </div>
                </Upload>
              </div>
            </div>
          ) : (
            <Input
              type={input.type || "text"}
              name={input.name}
              value={formData[input.name]}
              placeholder={input.placeholder || ""}
              onChange={(e) => handleChange(e, input)}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="about-submit-btn"
        disabled={isloading}
      >
        {isloading? "saving..." : "Save About"}
      </button>
    </form>
  );
};

export default ReuseForm;