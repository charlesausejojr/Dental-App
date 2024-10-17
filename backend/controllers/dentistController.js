import DentistService from "../services/dentistService.js";

class DentistController {
    static async createDentist (req, res) {
        try {
            const dentist = await DentistService.createDentist(req.body);
            res.status(201).json(dentist);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async getDentists (req, res) {
        try {
            const dentists = await DentistService.getDentists();
            res.json(dentists);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default DentistController;
