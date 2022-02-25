const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerSchema = new mongoose.Schema({
    firstName: {
        type:String,
        require: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    tokens:[{
        token : {
            type: String,
            required: true
        }
    }]
})

registerSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token;
    } catch  (e) {
        console.log(e)
    }
}

registerSchema.pre("save", async function(next) {
    console.log(`this is password befor hashing : ${this.password}`) 
    next()
})

registerSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        //one way comunication
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`hashing is under progress`) 
    }

    next()
})

registerSchema.pre("save", async function(next) {
    console.log(`this is password befor hashing : ${this.password}`) 

    this.confirmPassword = undefined;
    next()
})

const Register = mongoose.model("Register", registerSchema)


module.exports = Register;