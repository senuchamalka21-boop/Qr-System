const Vehicle = require('../models/Vehicle');


exports.registerVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehicleByRegNo = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ RegNo: req.params.regNo });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByFirstName = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ FirstName: new RegExp(req.params.firstName, 'i') });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByLastName = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ LastName: new RegExp(req.params.lastName, 'i') });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByEmail = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ Email: req.params.email });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByStation = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ NearestStation: new RegExp(req.params.station, 'i') });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByFuelType = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ FuelType: req.params.fuelType });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getVehiclesByNIC = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ OwnerNIC: req.params.nic });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.updateVehicleByRegNo = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { RegNo: req.params.regNo },
            req.body,
            { new: true, runValidators: true }
        );
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.updateVehicleByFirstName = async (req, res) => {
    try {
        const result = await Vehicle.updateMany(
            { FirstName: req.params.firstName },
            req.body,
            { runValidators: true }
        );
        res.status(200).json({ success: true, message: `${result.modifiedCount} vehicles updated` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.deleteVehicleByRegNo = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ RegNo: req.params.regNo });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
