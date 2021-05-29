const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const Institute = require('../models/institute');

// router to get loggedin user profile
router.get("/", [
    check('name', 'Invalid Name').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
],async function(req, res) {

    const {
        name,
        city
    } = req.query;

    try {
        let institute = await Institute.findOne({name: name, 'address.city': city});
        if (!institute) {
            res.status(200).json({'status': false, 'message': 'Geo not found'});
        }
        res.status(200).json({'status': true, 'institute': institute});
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


// router to create a new profile
router.post('/create', [
    check('name', 'Invalid Name').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('address.address1', 'Primary address is required').not().isEmpty(),
    check('address.city', 'City is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({'status': false, 'message': errors.array()});
    }

    try {
        const {name, address, estd} = req.body;
        const institute = await Institute.findOne({name: name, 'address.city': address.city});
        if (institute) {
            return res.status(200).json({'status': false, 'message': 'Institute Already Exists'});
        }

        const newInstitute = {
            name: name,
            address: {
                address1: address.address1,
                city: address.city
            }
        }

        if (address.address2) {
            newInstitute.address.address2 = address.address2;
        }

        if (address.address3) {
            newInstitute.address.address3 = address.address3;
        }

        if (estd) {
            newInstitute.estd = estd;
        }

        let newInstituteObject = new Institute(newInstitute);
        let saveStatus = await newInstituteObject.save();

        if (saveStatus) {
            return res.status(200).json({'status': true, 'newInstitute': newInstituteObject });
        }

        return res.status(200).json({'status': false, 'message': 'Unable to create new institue'});
    } catch (err) {
        return res.status(500).json({'status': false, 'message': err.message});
    }
});

module.exports = router;
