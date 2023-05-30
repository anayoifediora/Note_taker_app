const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));
//GET request for index.html
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
//GET request for notes
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    //Send a message to the client
    res.status(200).json(`${req.method} request received to get notes`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err) 
        } else {
            const parsedNotes = JSON.parse(data);
        }
    })
    
    //Log the request to the console
    console.log(`${req.method} request received to get notes`);
})

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`));