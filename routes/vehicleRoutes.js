const express = require('express');
const router = express.Router();
const {
    registerVehicle,
    getAllVehicles,
    getVehicleByRegNo,
    getVehiclesByFirstName,
    getVehiclesByLastName,
    getVehiclesByEmail,
    getVehiclesByStation,
    getVehiclesByFuelType,
    getVehiclesByNIC,
    updateVehicleByRegNo,
    updateVehicleByFirstName,
    deleteVehicleByRegNo
} = require('../controllers/vehicleController');


router.post('/', registerVehicle);
router.get('/', getAllVehicles);
router.get('/reg/:regNo', getVehicleByRegNo);
router.get('/firstname/:firstName', getVehiclesByFirstName);
router.get('/lastname/:lastName', getVehiclesByLastName);
router.get('/email/:email', getVehiclesByEmail);
router.get('/station/:station', getVehiclesByStation);
router.get('/fuel/:fuelType', getVehiclesByFuelType);
router.get('/nic/:nic', getVehiclesByNIC);
router.put('/reg/:regNo', updateVehicleByRegNo);
router.put('/firstname/:firstName', updateVehicleByFirstName);
router.delete('/reg/:regNo', deleteVehicleByRegNo);

module.exports = router;
