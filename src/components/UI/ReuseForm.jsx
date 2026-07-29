import React, { useState } from 'react';

const ReuseForm = ({ inputs, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState(() => {
    const defaultValues = {};
    inputs.forEach(input => {
      defaultValues[input.name] = initialValues[input.name] || '';
    });
    return defaultValues;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input) => (
        <div key={input.name} style={{ marginBottom: '10px' }}>
          <label>{input.label}</label><br />
          <input
            type={input.type || 'text'}
            name={input.name}
            value={formData[input.name]}
            placeholder={input.placeholder || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReuseForm