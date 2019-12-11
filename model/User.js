const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    username: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    userType: {
        type: String,
        default: 'user'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    contact: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function (next) {
    var user = this

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema)