
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3001; 

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/job_portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const applicantSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resume: { type: String } 
});

const Applicant = mongoose.model('Applicant', applicantSchema);

app.post('/applicants', async (req, res) => {
    const { name, email, resume } = req.body;

    const applicant = new Applicant({ name, email, resume });

    try {
        const savedApplicant = await applicant.save();
        res.status(201).send(savedApplicant);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Error inserting applicant');
    }
});

app.get('/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.send(applicants);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching applicants');
    }
});

app.put('/applicants/:id', async (req, res) => {
    const applicantId = req.params.id;

    try {
        const updatedApplicant = await Applicant.findByIdAndUpdate(applicantId, req.body, { new: true });
        
        if (!updatedApplicant) {
            return res.status(404).send('Applicant not found');
        }

        res.send(updatedApplicant);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error updating applicant');
    }
});

app.delete('/applicants/:id', async (req, res) => {
    const applicantId = req.params.id;

    try {
        const deletedApplicant = await Applicant.findByIdAndDelete(applicantId);
        
        if (!deletedApplicant) {
            return res.status(404).send('Applicant not found');
        }

        res.send({ message: 'Applicant deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting applicant');
    }
});

app.get('/jobs', async (req, res) => {
   

    try {
        const response = await axios.get('http://localhost:3000/jobs');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching jobs from admin service:', error);
        res.status(500).send('Error fetching jobs');
    }
});

app.listen(port, () => {
    console.log(`Applicant service running on port ${port}`);
});
