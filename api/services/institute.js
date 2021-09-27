const InstituteModal = require("./../models/institute");
const Logger = require('./../utils/logger');

class Institute {
    constructor(instituteId) {
        this.instituteId = instituteId;
        this.logger = new Logger(__filename);
    }

    async static getInstituteFromName(name, city) {
        try {
            const institute = await InstituteModal.findOne({name: name, 'address.city': city});
            if (!institute) {
                return {'status': false, 'message': 'Institute not found'};
            }

            return {
                'status': true,
                'result': institute
            };
        } catch (err) {
            let logger = new Logger(__filename)
            logger.error(`Unable to get institute from name: ${name} and city: ${city}`);
            return {
                'status': false,
                'message': "Unable to get institute"
            };
        }
    }

    async static createNewInstitute(name, address, estd) {
        const institute = await InstituteModal.findOne({name: name, 'address.city': address.city});
        if (institute) {
            return {'status': false, 'message': 'Institute Already Exists'};
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
    }
}