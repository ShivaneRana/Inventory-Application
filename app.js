const express = require("express")
const dotenv = require("dotenv")
const path = require("node:path")
const indexRouter = require("./routers/indexRouter.js")

dotenv.config({ quiet: true, debug: false })
const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.statusCode || 500).send(err.message)
})

const PORT = process.env.PORT
app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`http://localhost:${PORT}`)
})
