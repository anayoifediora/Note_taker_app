const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid-random');
const PORT = process.env.PORT || 3001;

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
    console.info(`${req.method} request received to get notes`);

    fs.readFile('db/db.json', 'utf8', (error, data) => {
      if (error) {
        console.error('Error reading db.json:', error);
        res.status(500).send('Internal Server Error');
      } else {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      }
    });
  });

app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add notes`);
    
    //Destructuring the request items
    const {title, text} = req.body;
    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        //Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                //Convert string to JSON object
                const parsedNotes = JSON.parse(data);
                
                //Add a new note
                parsedNotes.push(newNote);

                //Write updated notes back to the file
                fs.writeFile(
                    './db/db.json', 
                    JSON.stringify(parsedNotes, null, 3),
                    (writeErr) => 
                        writeErr? console.error(writeErr) : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});


app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`));