import Dentist from "../models/dentistModel.js";

class DentistService {
    static async createDentist (data) {
        const dentist = new Dentist(data);
        return await dentist.save();
    };

    static async getDentists () {
        return await Dentist.find();
    };

    static async updateDentist(id, data) {
        return await Dentist.findByIdAndUpdate(id, data, { new: true }); 
    };
}

export default DentistService;

