const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
      },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: function(v) {
                // console.log("in custom validator now and value is: ", v);
                // console.log("validating string wtih regex:", /^[0-9]{2,3}[-]{1}[0-9]+$/.test(v))
                return /^[0-9]{2,3}[-]{1}[0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
      },
    });

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)