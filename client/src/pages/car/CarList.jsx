import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/CarList.module.css";
import CarCard from "../../components/CarCard";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }
        const response = await api.get("/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(response.data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };

    fetchCars();
  }, [navigate]);

  const handleCarClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter cars based on the search term
  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCarClick = () => {
    navigate("create"); // Navigate to the add car form
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Cars</h2>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by car title or description"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Add Car Button */}
      <div className={styles.addCarContainer}>
        <button className={styles.addCarButton} onClick={handleAddCarClick}>
          Add New Car
        </button>
      </div>

      {filteredCars.length === 0 ? (
        <p>No cars available matching your search criteria.</p>
      ) : (
        <ul className={styles.carList}>
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} onCarClick={handleCarClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarList;
