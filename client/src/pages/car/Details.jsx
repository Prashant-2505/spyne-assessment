import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "../../../src/styles/CarDetails.module.css";

const CarDetails = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedCar, setUpdatedCar] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }
        const response = await api.get(`/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedCar = response.data;
        setCar(fetchedCar);
        setUpdatedCar({
          title: fetchedCar.title,
          description: fetchedCar.description,
          tags: fetchedCar.tags,
        });
        setExistingImages(fetchedCar.images || []);
      } catch (err) {
        setError("Failed to fetch car details. Please try again later.");
        console.error("Failed to fetch car details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId, navigate]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCar((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setUpdatedCar((prevState) => ({
      ...prevState,
      tags: tagsArray,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevNewImages) => [...prevNewImages, ...files]);
    setPreviewImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleImageRemove = (index, isExistingImage) => {
    if (isExistingImage) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Add the car details
      formData.append("title", updatedCar.title);
      formData.append("description", updatedCar.description);
      updatedCar.tags.forEach((tag) => formData.append("tags[]", tag));

      // Append new images for upload
      newImages.forEach((image) => formData.append("newImages", image));

      // Include the existing image paths so the server knows which ones to retain
      existingImages.forEach((image) =>
        formData.append("existingImages[]", image)
      );

      // Make the API call to update
      const response = await api.put(`/cars/${carId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the state with the server's response
      setCar(response.data);
      setIsModalOpen(false);
      setExistingImages(response.data.images); // Updated existing images from server
      setNewImages([]); // Clear new images since they are now uploaded
      window.location.reload();
    } catch (err) {
      console.error("Error updating car:", err);
      setError("Failed to update car details. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/cars");
    } catch (err) {
      console.error("Error deleting car:", err);
      setError("Failed to delete the car. Please try again.");
    }
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  console.log(car)
  return (
    <div className={styles.container}>
      <div className={styles.imageCarousel}>
        {(existingImages && existingImages.length > 0) ||
        previewImages.length > 0 ? (
          <div className={styles.imageWrapper}>
            <img
              src={`https://spyne-assessment.onrender.com/${(
                (existingImages && existingImages[currentImage]) ||
                previewImages[currentImage]
              ).replace(/\\/g, "/")}`}
              alt={`Car ${car.title} image`}
              className={styles.mainImage}
            />
            <div className={styles.thumbnailContainer}>
              {existingImages &&
                [...existingImages, ...previewImages].map((image, index) => (
                  <img
                    key={index}
                    src={`https://spyne-assessment.onrender.com/${image.replace(/\\/g, "/")}`}
                    alt={`Car ${car.title} thumbnail ${index + 1}`}
                    className={styles.thumbnail}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
            </div>
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className={styles.carInfo}>
        <h2>{car.title}</h2>
        <p>
          <strong>Description:</strong> {car.description}
        </p>
        <ul className={styles.car_tags}>
          {car?.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p>
          <span>Owner class:</span> {car?.ownerClass}
        </p>
        <p>
          <span>Registered city:</span> {car?.registeredCity}
        </p>
        <p>
          <span>Km running:</span> {car?.KmRunning} km
        </p>
        <p>
          <span>Model:</span> {car?.registeredNumber}
        </p>

        <div className={styles.buttons}>
          <button onClick={handleEditClick} className={styles.editButton}>
            Edit
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Car Details</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={updatedCar.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={updatedCar.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="images">Images</label>
                <div className={styles.imagesContainer}>
                  {existingImages.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img
                        src={`https://spyne-assessment.onrender.com/${image.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={`Car ${car.title} existing image ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <span
                        className={styles.removeImage}
                        onClick={() => handleImageRemove(index, true)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                  {previewImages.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img
                        src={image}
                        alt={`New car image ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <span
                        className={styles.removeImage}
                        onClick={() => handleImageRemove(index, false)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="tags">Tags </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={updatedCar.tags.join(", ")}
                  onChange={handleTagsChange}
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Save Changes
              </button>
              <button onClick={()=>setIsModalOpen(false)} className={styles.closeButton}>
               Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
