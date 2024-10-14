const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'pass@word1',  // Your MySQL password
    database: 'job_portal'
  });
  
  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
  });

  app.get('/jobs', (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  app.post('/jobs', (req, res) => {
    const { title, description, company, location, applicant_id } = req.body; // Extract applicant_id from the request body

    // SQL query to insert a new job into the jobs table
    const sql = 'INSERT INTO jobs (title, description, company, location, applicant_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, description, company, location, applicant_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error inserting job');
        }
        res.status(201).send({ id: result.insertId, title, description, company, location, applicant_id });
    });
});


app.delete('/jobs/:id', (req, res) => {
    const jobId = req.params.id; // Get the job ID from the URL parameters

    const sql = 'DELETE FROM jobs WHERE id = ?';
    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting job');
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Job not found');
        }

        res.status(200).send({ message: 'Job deleted successfully' });
    });
});

app.put('/jobs/:id', (req, res) => {
    const jobId = req.params.id; 
    const { title, description, company, location, applicant_id } = req.body; // Extract applicant_id from the request body
    const sql = 'UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, applicant_id = ? WHERE id = ?';
    db.query(sql, [title, description, company, location, applicant_id, jobId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating job');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Job not found');
        }

        res.status(200).send({ message: 'Job updated successfully' });
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
