const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank'],
        minLength: 6
    }
})


// Hashing the password before storing it in the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({username});
    const isValid = await bcrypt.compare(password, foundUser.password);
    
    return isValid ? foundUser : false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;