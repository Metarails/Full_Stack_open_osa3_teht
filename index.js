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

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const errorHandler = (error, request, response, next) => {
    // console.error("error handler middleware: ", error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

app.get("/api/persons", (request,response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
})

app.get("/api/persons/:id", (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
        if (person) {
            return response.json(person);
        } else {
            return response.status(404).end();
        }
      })
      .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    
    const body = request.body;
    // console.log("body in post: ", body)

    if (!body.name || !body.number){
        return response.status(400).json({
            error: "missing required info, must send name and number"
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
    // const body = request.body;
    const {name , number} = request.body;

    // const person = {
    //     name: body.name,
    //     number: body.number,
    // };
    
    console.log("in put parts: ", name, number, request.params.id)

    Person.findByIdAndUpdate(
        request.params.id,
            {name, number},
            { new: true, runValidators: true, context: "query" }
        )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error));
  })

app.delete('/api/persons/:id', (request, response, next ) => {

    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error));
  })

app.get("/info", (request,response) => {
    Person.find({}).then(person => {
        console.log("info: ", person.length);
        const pplCount = person.length;
        const message = `Phonebook has info for ${pplCount} people`
        const time = Date();
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

app.use(errorHandler);