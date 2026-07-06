const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    RegNo: {
        type: String,
        required: [true, 'Registration Number is required'],
        unique: true,
        trim: true
    },
    FirstName: {
        type: String,
        required: [true, 'First Name is required'],
        trim: true
    },
    LastName: {
        type: String,
        required: [true, 'Last Name is required'],
        trim: true
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    NearestStation: {
        type: String,
        required: [true, 'Nearest Fuel Station is required'],
        trim: true
    },
    FuelType: {
        type: String,
        required: [true, 'Fuel Type is required'],
        enum: ['Petrol', 'Diesel'],
        trim: true
    },
    OwnerNIC: {
        type: String,
        required: [true, 'Owner NIC is required'],
        trim: true
    },
    VehicleModel: {
        type: String,
        required: [true, 'Vehicle Model is required'],
        trim: true
    },
    QRCode: {
        type: String,
        required: [true, 'QR Code is required'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
