const Car = require("../models/Car");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: 'images', maxCount: 10 },
]);




// Create car
const createCar = async (req, res) => {
  const { title, description, tags, registeredCity, ownerClass, KmRunning,registeredNumber } = req.body;
  const images = req.files['images'] ? req.files['images'].map((file) => file.path) : [];
  const newCar = new Car({
    title,
    description,
    images,
    tags,
    registeredCity,
    ownerClass,
    KmRunning,
    registeredNumber,
    userId: req.user.id,
  });

  try {
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: "Error creating car", error: err });
  }
};


// Update car
const uploadForUpdate = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
}).fields([
  { name: 'newImages', maxCount: 10 },
  { name: 'existingImages', maxCount: 10 },
]);


// Controller example to handle the images
const updateCar = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags, ownerClass, registeredCity, KmRunning, model,registeredNumber } = req.body;

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Ensure only the owner can update the car
    if (car.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newImages = (req.files['newImages'] || []).map(file => file.path);
    const existingImages = (req.files['existingImages'] || []).map(file => file.path);
    const combinedImages = [...car.images, ...newImages, ...existingImages].slice(0, 10); // Total of 10 images max

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags || car.tags;
    car.ownerClass = ownerClass || car.ownerClass;
    car.registeredCity = registeredCity || car.registeredCity;
    car.KmRunning = KmRunning || car.KmRunning;
    car.registeredNumber = registeredNumber || car.registeredNumber;
    car.images = combinedImages;

    await car.save();
    res.status(200).json({ message: "Car updated successfully", car });
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ message: "Error updating car", error: err.message });
  }
};




// Get all cars for a user
const getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cars", error: err });
  }
};

// Get a particular car by ID
const getCarDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Error fetching car details", error: err });
  }
};




// Delete car
const deleteCar = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("done")
    await Car.deleteOne({ _id: id });
    console.log("done")
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting car", error: err });
  }
};

// Search cars by title, description, or tags
const searchCars = async (req, res) => {
  const { query } = req.query;
  try {
    const cars = await Car.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [query] } },
      ],
    });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Error searching cars", error: err });
  }
};

module.exports = {
  createCar,
  getUserCars,
  getCarDetail,
  updateCar,
  deleteCar,
  searchCars,
  upload,
  uploadForUpdate
};
