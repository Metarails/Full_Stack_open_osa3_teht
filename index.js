const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
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

let persons = [
    {
        id: 1,
        name: "Arto",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan",
        number: "12-43-2341234"
    },
    {
        id: 4,
        name: "Mary",
        number: "39-23-6423122"
    },
    {
        id: 5,
        name: "test",
        number: "11111"
    }
]


app.get("/api/persons", (request,response) => {
    response.json(persons);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.post("/api/persons", (request, response) => {
    
    const body = request.body;

    if (!body.name || !body.number){
        return response.status(400).json({
            error: "missing required info, must send name and number"
        });
    }
    
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "this person already exists in phone book"
        });
    }

    const person = {
        id: Math.floor(Math.random() * 99999999),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person);
    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
  })

app.get("/info", (request,response) => {
    const pplCount = persons.length;
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

const PORT = 3001 
app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`);
})