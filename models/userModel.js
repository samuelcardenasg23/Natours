import mongoose from 'mongoose'
import validator, { isEmail } from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must input your name']
    // trim: true,
    // maxlength: [50, 'Your name must have less or equal tha 40 characters'],
    // minlength: [5, 'Your name must have more or equal than 5 characters'],
    // validate: {
    //   validator: function (val) {
    //     return validator.isAlpha(val.replace(/ /g, ''))
    //   },
    //   message: 'Your name must only contain characters'
    // }
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid Email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8
  }
})

const User = mongoose.model('User', userSchema)

export { User }
