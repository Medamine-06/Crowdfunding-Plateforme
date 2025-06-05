const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

//  User Schema
const userSchema =  mongoose.Schema({
  cin:{type: Number,unique: true},
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } ,

}, { timestamps: true })

// Hash  passwordbefore saving
userSchema.pre('save', async function () {
    console.log('before saving', this)
    let key = await bcrypt.genSalt(14)
    this.password = await bcrypt.hash(this.password, key)
})
// Export User Model
module.exports= mongoose.model("User", userSchema)

