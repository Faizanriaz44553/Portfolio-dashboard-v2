import { Empty, message, Modal, Skeleton, Upload } from "antd";
import { validateImage } from "../../utils/validateImage";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./Add-Certificate.css"
import { uploadImage } from "../../services/cloudinary";
import { db } from "../../../firebase.config";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
// db key ===> certificates

const AddCertificate = () => {
  const [image, setImage] = useState(null)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [certificate, setCertificate] = useState([])
  // console.log(certificate);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const result = await uploadImage(image);
      if (!result.success) {
        message.error(result.message);
        return;
      }
      await addDoc(collection(db, "certificates"), {
        ...result,
        createdAt: serverTimestamp(),
      });
      message.success("Project added successfully.");
      setImage(null)
      setOpen(false);
      setConfirmLoading(false);
      setFileList([]);
      CertificateData()
    } catch (error) {
      console.error(error);
      message.error("Failed to add project.");
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const CertificateData = async () => {
    setConfirmLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "certificates"));
      //  console.log(querySnapshot);

      const certificates = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(certificates);
      setConfirmLoading(false);
      setCertificate(certificates);

    } catch (error) {
      console.log(error.message);
      message.error("Failed to load certificates");
    }
  };


  const DeleteData = async (id) => {
    setConfirmLoading(true)
    try {
      const deleteRef = doc(db, "certificates", id);
      await deleteDoc(deleteRef);
      // console.log(`Deleted successfully. ID: ${id}`);

      
      setCertificate((prev) =>
        prev.filter((item) => item.id !== id)
      );

      message.success("Deleted successfully");
      CertificateData()
      setConfirmLoading(false)
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };


  useEffect(() => {
    CertificateData();
  }, []);
  return (
    <div>
      <div className="c-upload-main-wrapper">
        <div className="c-upload-sec1-wrap">
          <h1>Certificate Image</h1>
          <p>
            Upload a JPG, PNG, or WEBP image with a maximum file size of 2MB.
          </p>
        </div>
        <div className="c-upload-sec2-wrap">
          <button onClick={showModal}>
            Upload Certificate
          </button>
          <Modal
            title="Certificate Add"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              className="project-upload"
              fileList={fileList}
              beforeUpload={(file) => {
                const result = validateImage(file);
                if (!result.valid) {
                  message.error(result.message);
                  return Upload.LIST_IGNORE;
                }
                setImage(file);
                setFileList([
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                  },
                ]);
                return false;
              }}
              onRemove={() => {
                setImage(null);
                setFileList([]);
              }}
            >
              <div className="upload-content">
                <PlusOutlined />
                <div className="upload-label">
                  Upload
                </div>
              </div>
            </Upload>
          </Modal>

        </div>
      </div>

      {/* certificate lists */}
      {
        confirmLoading ? <Skeleton /> : certificate.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data Found"/> :
          certificate?.map((item, index) => {
            return (
              <div className="certificate-list" key={index}>
                <div className="certificate-item">
                  <div className="certificate-image-wrapper">
                    <img
                      src={item?.url}
                      alt="Certificate"
                      className="certificate-image"
                    />
                  </div>
                  <div className="certificate-date">
                    <span>Uploaded</span>
                    <p>{item?.createdAt?.toDate()?.toLocaleDateString()}</p>
                  </div>
                  <button className="certificate-delete-btn" onClick={() => DeleteData(item?.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })
      }
    </div>
  )

}

export default AddCertificate;