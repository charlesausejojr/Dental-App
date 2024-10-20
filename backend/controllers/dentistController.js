import DentistService from "../services/dentistService.js";

class DentistController {
    static async createDentist (req, res) {
        try {
            const dentist = await DentistService.createDentist(req.body);
            res.status(201).json(dentist);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async getDentists (req, res) {
        try {
            const dentists = await DentistService.getDentists();
            res.json(dentists);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async updateDentist(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const updatedDentist = await DentistService.updateDentist(id, updateData);
            console.log(updatedDentist);
            if (!updatedDentist) {
                return res.status(404).json({ message: 'Dentist not found' });
            }
            res.json(updatedDentist);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };
}

export default DentistController;
