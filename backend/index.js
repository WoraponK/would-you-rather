const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bp = require('body-parser');

const app = express();
const port = 8000;

app.use(cors());
app.use(bp.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wyr_db',
    port: 3306
});

// Check Database Connection
db.connect(error => {
    try {
        console.log('database connected');
    } catch (error) {
        console.error(error);
    }
});

app.get('/quote', (req, res) => {
    const qr = `SELECT * FROM quote`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Erorr get all data'
            });
        } else {
            res.send(result);
        }
    });
});

app.get('/quote/:id', (req, res) => {
    const { id } = req.params;
    const qr = `SELECT * FROM quote WHERE id = ?`;

    db.query(qr, id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error get a data'
            });
        }

        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({
                message: 'Data not found'
            });
        }
    });
});

app.put('/quote/:id/left', (req, res) => {
    const { id } = req.params;

    const qr = `
        UPDATE quote
        SET 
            left_count = left_count + 1,
            amount_count = amount_count + 1
        WHERE id = ?
    `;

    db.query(qr, id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error count left data'
            });
        } else {
            res.send({
                message: 'Left count succesfully'
            });
        }
    })
});

app.put('/quote/:id/right', (req, res) => {
    const { id } = req.params;

    const qr = `
        UPDATE quote
        SET 
            right_count = right_count + 1,
            amount_count = amount_count + 1
        WHERE id = ?
    `;

    db.query(qr, id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error count right data'
            });
        } else {
            res.send({
                message: 'Right count succesfully'
            });
        }
    })
});

app.put('/reset', (req, res) => {
    const qr = `
        UPDATE quote
        SET
            left_count = 1,
            right_count = 1,
            amount_count = 2
    `;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error reset data'
            });
        } else {
            res.send({
                message: 'Reset data succesfully'
            })
        }
    })
})

// Listen port...
app.listen(port, () => {
    console.log('Server is running on port', port);
})