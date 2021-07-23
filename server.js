// Declare dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const uuid = require('./helpers/uuid');

//Port and express 
const PORT = process.env.PORT || 3001
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

//GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
 
// GET route to get the notes html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})  

//GET note data
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add new note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => 
                writeErr ? console.error(err) : console.info('Successfully added note!'));
        }
    });

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting feedback');
    }
})

// Delete function should work the same way as POST just need to filter out the selected note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const uid = req.params.id;
            const parsedNotes = JSON.parse(data);

            let updatedNotes = parsedNotes.filter(notes => notes.id != uid);

            fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (writeErr) =>
                writeErr ? console.error(err) : console.info('Successfully deleted note!'));
        }
    });
        const response = {
            status: 'success',
        };
        res.json(response);
})

//Wildcard GET 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  
// PORT listener
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});