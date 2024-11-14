import React from "react";
import styles from "./CarCard.module.css";

const CarCard = ({ car, onCarClick }) => {
  return (
    <div className={styles.carCard} onClick={() => onCarClick(car._id)}>
      <div className={styles.imagesContainer}>
        {car?.images && car.images.length > 0 ? (
          <img
            src={`https://spyne-assessment.onrender.com/${car.images[0].replace(/\\/g, "/")}`}
            alt={`Car ${car.title} image`}
            className={styles.image}
          />
        ) : (
          <p className={styles.noImages}>No images available</p>
        )}
      </div>

      <div>
        <h3 className={styles.carTitle}>{car.title}</h3>
        {/* <ul className={styles.tag}>
          {tag && tag.map((tag, i) =>{
            return <li key={i}>{tag}</li>
          })}
        </ul> */}
        <p className={styles.description}>
          <strong>Description:</strong> {car.description}
        </p>
      </div>
    </div>
  );
};

export default CarCard;
