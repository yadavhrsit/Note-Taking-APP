const express = require("express");
const mongoose = require("mongoose");
const cors =  require("cors");
// importing routers
const notesRouter = require("./routes/notes.routes");
const usersRouter = require("./routes/users.routes");
require("dotenv").config();

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const MongURL = process.env.MONGO_URL;
mongoose.connect(MongURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection Error:", error);
  });

app.use("/notes", notesRouter);
app.use("/user", usersRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
 
});

console.log(`Server running at http://localhost:${PORT}`);


module.exports=app;
