import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/carCreate.module.css";

const CarCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    registeredCity: "",
    ownerClass: "",
    KmRunning: "",
    registeredNumber:""
  });
  const [images, setImages] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = () => {
    if (
      currentTag.trim() !== "" &&
      !formData.tags.includes(currentTag.trim())
    ) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("registeredCity", formData.registeredCity);
      formDataToSend.append("ownerClass", formData.ownerClass);
      formDataToSend.append("KmRunning", formData.KmRunning);
      formDataToSend.append("registeredNumber", formData.registeredNumber);

      

      formData.tags.forEach((tag) => {
        formDataToSend.append("tags", tag);
      });

      for (let i = 0; i < images.length; i++) {
        formDataToSend.append("images", images[i]);
      }

      await api.post("/cars", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/cars");
    } catch (err) {
      console.error("Failed to create car:", err);
    }
  };

  return (
    <div className={styles.createContainer}>
      <h2 className={styles.title}>Create Car</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Car Title"
          onChange={handleChange}
          className={styles.input}
          required
        />
        <textarea
          name="description"
          placeholder="Car Description"
          onChange={handleChange}
          className={styles.textarea}
          required
        ></textarea>

        <div className={styles.tagInputContainer}>
          <input
            type="text"
            value={currentTag}
            onChange={handleTagChange}
            placeholder="Enter a tag"
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className={styles.addTagButton}
          >
            Add Tag
          </button>
          <div className={styles.tagsList}>
            {formData.tags.map((tag, index) => (
              <div key={index} className={styles.tagItem}>
                {tag}
                <p
                  className={styles.removeTag}
                  onClick={() => handleTagRemove(tag)}
                >
                  X
                </p>
              </div>
            ))}
          </div>
        </div>

        <input
          type="text"
          name="registeredCity"
          value={formData.registeredCity}
          onChange={handleChange}
          placeholder="Registered City"
          className={styles.input}
          required
        />
        <input
          type="text"
          name="registeredNumber"
          value={formData.registeredNumber}
          onChange={handleChange}
          placeholder="Registered Year"
          className={styles.input}
          required
        />
        

        <select
          name="ownerClass"
          value={formData.ownerClass}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Owner Class</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Fourth">Fourth</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="KmRunning"
          value={formData.KmRunning}
          onChange={handleChange}
          placeholder="Kilometers Running"
          className={styles.input}
          required
        />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CarCreate;
