const express = require('express');
const authenticateToken = require('../middlewares/auth');
const {
  createCar,
  getUserCars,
  getCarDetail,
  updateCar,
  deleteCar,
  searchCars,
  upload,
  uploadForUpdate
} = require('../controllers/carController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API for managing car listings
 */

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car entry
 *     description: Allows an authenticated user to create a new car entry, including details such as title, description, car type, tags, owner class, and optional images.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the car
 *               description:
 *                 type: string
 *                 description: Description of the car
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of images for the car
 *               carType:
 *                 type: string
 *                 description: Type of car (e.g., SUV, Sedan)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the car
 *               registeredCity:
 *                 type: string
 *                 description: City where the car is registered
 *               registeredNumber:
 *                 type: integer
 *                 description: Registration number of the car
 *               ownerClass:
 *                 type: string
 *                 enum: [First, Second, Third, Fourth, Other]
 *                 description: Classification of the car's owner
 *               KmRunning:
 *                 type: integer
 *                 description: Kilometers the car has been driven
 *     responses:
 *       201:
 *         description: Car successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/cars', authenticateToken, upload, createCar);

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Retrieve a list of cars for the authenticated user
 *     description: Retrieves all cars associated with the authenticated user, including metadata like title, description, and registration details.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Car ID
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   carType:
 *                     type: string
 *                   registeredCity:
 *                     type: string
 *                   ownerClass:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/cars', authenticateToken, getUserCars);

/**
 * @swagger
 * /cars/search:
 *   get:
 *     summary: Search cars based on parameters
 *     description: Allows users to search for cars by criteria such as title, description, or car type.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Title of the car to search for
 *         schema:
 *           type: string
 *       - name: carType
 *         in: query
 *         description: Type of car to search (e.g., SUV)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cars matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   carType:
 *                     type: string
 *       400:
 *         description: Invalid search parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/cars/search', authenticateToken, searchCars);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get details of a specific car
 *     description: Retrieve detailed information of a specific car by its ID.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to retrieve
 *     responses:
 *       200:
 *         description: Car details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 carType:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 ownerClass:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */
router.get('/cars/:id', authenticateToken, getCarDetail);

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update a car by ID
 *     description: Update an existing car's details by providing its ID and updated data.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               ownerClass:
 *                 type: string
 *                 enum: [First, Second, Third, Fourth, Other]
 *     responses:
 *       200:
 *         description: Car successfully updated
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */
router.put('/cars/:id', authenticateToken, uploadForUpdate, updateCar);

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     description: Deletes a specific car by ID.
 *     tags: [Cars]
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to delete
 *     responses:
 *       200:
 *         description: Car successfully deleted
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */
router.delete('/cars/:id', authenticateToken, deleteCar);

module.exports = router;
