export const validateImage = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const maxSize = 2 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Only JPG, PNG and WEBP images are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: "Image size must be less than 2MB.",
    };
  }

  return {
    valid: true,
  };
};