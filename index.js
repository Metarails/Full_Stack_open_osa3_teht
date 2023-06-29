const express = require("express");
const app = express();

app.use(express.json())

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
    },
    {
        id: 6,
        name: "test2",
        number: "222222"
    }
]


app.get("/api/persons", (req,res) => {
    res.json(persons);
})

const PORT = 3001 
app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`);
})