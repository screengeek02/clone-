const { createServer } = require("http")
const next = require("next")

process.on("uncaughtException", err => {
  console.error("UNCAUGHT", err)
})

process.on("unhandledRejection", err => {
  console.error("REJECTION", err)
})

const dev = false
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(process.env.PORT || 3000, err => {
    if (err) throw err
    console.log("Next.js running")
  })
})
