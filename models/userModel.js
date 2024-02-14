import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

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
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date
})

// Hash password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }
  return false
}

const User = mongoose.model('User', userSchema)

export { User }
