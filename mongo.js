// mongodb+srv://Metarail:<password>@metarail0.5iydssj.mongodb.net/?retryWrites=true&w=majority
// const uri = "mongodb+srv://Metarail:<password>@metarail0.5iydssj.mongodb.net/?retryWrites=true&w=majority";

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2]

const url =
  `mongodb+srv://Metarail:${password}@metarail0.5iydssj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log("Phonebook:");

    Person.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close();
    process.exit(1);
    })

}

if (process.argv.length === 4) {
    console.log('not enough info to determine action');
    mongoose.connection.close();
    process.exit(1);
  }

if (process.argv.length >= 5) {
//   console.log("name shoud be: ", process.argv[3]) ;
//   console.log("number shoud be: ", process.argv[4]) ;

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`Person ${result.name} number: ${result.number} was saved to database`)
    mongoose.connection.close();
    process.exit(1);
  })
}
