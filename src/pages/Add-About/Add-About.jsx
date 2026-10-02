import { useEffect, useState } from "react"
import ReuseForm from "../../components/UI/ReuseForm";
import "./About.css"
import { uploadImage } from "../../services/cloudinary";
import { message } from "antd";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";

const AddAbout = () => {
  const [AboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputs = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      value: "Muhammad Faizan",
    },
    {
      name: "description",
      label: "Professional Bio",
      type: "text",
      placeholder: "Write a short introduction about yourself...",
    },
    {
      name: "resume",
      label: "Resume / CV Link",
      type: "text",
      placeholder: "Paste your Google Drive resume link",
    },
    {
      name: "file",
      label: "Profile Image",
      type: "file",
    },
  ];


  const handleFormSubmit = async (data) => {
    setLoading(true)
    const { name, description, file, resume } = data;

    if (
      !name?.trim() ||
      !description?.trim() ||
      (!file && !AboutData?.imgURL) ||
      !resume?.trim()
    ) {
      message.error("All fields are required!");
      setLoading(false)
      return;
    }

    try {

      let imgURL = AboutData?.imgURL || "";
      let cloudnaryPublicId =
        AboutData?.cloudnaryPublicId || "";
      if (file instanceof File) {
        const upload = await uploadImage(file);

        if (!upload.success) {
          message.error(upload.message);
          setLoading(false)
          return;
        }

        imgURL = upload.url;
        cloudnaryPublicId = upload.publicId;
      }

      const finalData = {
        name: name || "Muhammad Faizan",

        description:
          description ||
          "a Computer Network and Telecommunications Engineering student interested in Front-End development. I focus on creating engaging digital experiences and always strive to deliver the best solutions in every project.",

        resume:
          resume ||
          "https://drive.google.com/file/d/1w28FWuVGHDkj11K2pUxD1E2Kgn1wuozL/view",

        imgURL:
          imgURL ||
          "https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg?nii=t",

        cloudnaryPublicId,

        createdAt: AboutData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "about", "main"), finalData);
      setAboutData((prev) => ({
        ...prev,
        ...finalData,
      }));
      message.success("Saved successfully!");
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
      message.error(error.message || "Something went wrong!");
    }
  };

  const getAboutData = async () => {
    const docRef = doc(db, "about", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setAboutData(docSnap.data());
    }
  };

  useEffect(() => {
    getAboutData()
  }, [])

  return (

    <div className="about-form-page">
      <div className="about-form-header">
              <div className="page-header">
        <span className="page-kicker">Portfolio</span>
        <h1>About Settings</h1>
      </div>
      </div>

      <div className="about-form-card">
        <ReuseForm
          inputs={inputs}
          onSubmit={handleFormSubmit}
          isloading={loading}
        />
      </div>
    </div>

  );
};

export default AddAbout