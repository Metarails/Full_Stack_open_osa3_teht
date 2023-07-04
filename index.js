require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
// app.use(morgan("tiny"));
// :method :url :status :res[content-length] - :response-time ms

morgan.token("body", (req, res) => {
    // console.log("request in morgan token: ", req.method, req.body)
    if (req.method === "POST" ){
        return JSON.stringify(req.body);
    }
    return " "
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/api/persons", (request,response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
})

app.get("/api/persons/:id", (request, response) => {
    
    Person.findById(request.params.id).then(person => {
        console.log("Person found?: ", person)
        if (person) {
            return response.json(person);
        } else {
            return response.status(404).end();
        }
      })
})

app.post("/api/persons", (request, response) => {
    
    const body = request.body;
    console.log("body in post: ", body)

    if (!body.name || !body.number){
        return response.status(400).json({
            error: "missing required info, must send name and number"
        });
    }
    
    // if (persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: "this person already exists in phone book"
    //     });
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
  })

app.get("/info", (request,response) => {
    Person.find({}).then(person => {
        console.log("info: ", person.length);
        const pplCount = person.length;
        const message = `Phonebook has info for ${pplCount} people`
        const time = Date();
        // console.log("time: ", time)
        response.send(
            `
            <p>${message}</p>
            <p>${time}</p>
            `
        );
    })
    
})

const PORT = process.env.PORT || 3001 ;
app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`);
})