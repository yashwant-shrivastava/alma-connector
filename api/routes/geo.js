const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const Geo = require('../models/geo');

// router to get loggedin user profile
router.get("/", [
    check('name', 'Invalid Name').not().isEmpty(),
    check('geoType', 'GeoType is required').not().isEmpty()
],async function(req, res) {

    const {
        name,
        geoType
    } = req.query;

    try {
        let geo = await Geo.findOne({name: name, geoType: geoType});
        if (!geo) {
            res.status(200).json({'status': false, 'message': 'Geo not found'});
        }
        res.status(200).json({'status': true, 'geo': geo});
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// router to create a new profile
router.post('/create', [
    check('name', 'Invalid Name').not().isEmpty(),
    check('geoType', 'Type is required').not().isEmpty(),
    check('pincode', 'pincode is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({'status': false, 'message': errors.array()});
    }

    try {
        const {name, geoType, pincode} = req.body;
        const geo = await Geo.findOne({name: name, geoType: geoType});
        if (geo) {
            res.status(200).json({'status': false, 'message': 'Geo Already Exists'});
        }

        let newGeo = new Geo({
            name,
            geoType,
            pincode
        });
        let saveStatus = await newGeo.save();

        if (saveStatus) {
            res.status(200).json({'status': true, 'geo': newGeo });
        }

        res.status(200).json({'status': false, 'message': 'Unable to create new geo'});
    } catch (err) {
        res.status(500).json({'status': false, 'message': err.message});
    }
});

module.exports = router;
