const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
    .connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{2}-\d{6,}/.test(v) || /\d{3}-\d{5,}/.test(v)
            },
            message: (props) => `${props.value} is not a valid phone number`,
        },
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedbject) => {
        returnedbject.id = returnedbject._id.toString()
        delete returnedbject._id
        delete returnedbject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
