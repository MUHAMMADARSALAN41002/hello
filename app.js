require('dotenv').config()
const express = require("express")
const app = express();

const path = require("path")
const port = 8000;
const Registers = require("./src/models/register")
require("./src/models/db")
const bcrypt = require("bcrypt")


const staticDirectory = path.join(__dirname, "./public")
const viewsDirectory = path.join(__dirname, "./template/views")

app.use(express.static(staticDirectory))
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs");
app.set("views", viewsDirectory);

console.log(process.env.DATABASE)

app.get("/signup", (req, res) => {
    res.render('signup')
})

app.get("/", (req, res) => {
    res.render('login')
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        if (password === confirmPassword) {
            // const hashingpassword = await bcrypt.hash(password, 10);
            console.log(req.body)
            const registerEmployer = new Registers({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: password,
                confirmPassword: confirmPassword,
                address: req.body.address,
                gender: req.body.gender,
                phoneNumber: req.body.phoneNumber
            })

            const token = await registerEmployer.generateAuthToken();

            const documnet = await registerEmployer.save();
            res.status(201).redirect('/home')
        } else {
            res.status(400).send(`<script>alert("password donot match")</script>`)
        }
    } catch (e) {
        const error = e.message;
        res.status(400).send(error)
    }


})

app.get("/home", (req, res) => {
    res.render('home')
})

app.post("/signin", async (req, res) => {

    try {
        let email = req.body.email;
        let password = req.body.password;
    
        const user = await Registers.findOne({email});

        const ismatch =  await bcrypt.compare(password, user.password) 

        if(ismatch) {
            const token = await user.generateAuthToken();
            console.log("token is :  " + token)
            res.status(201).redirect("/home")
        } else {
            res.send("invalid email or password")
        }

    } catch (e) {
        res.status(400).send("invalid email or password")
    }
})


app.listen(port, () => {
    console.log(`listen at the port ${port}`)
})