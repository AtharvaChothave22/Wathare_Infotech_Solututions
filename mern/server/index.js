const express = require("express");
const db = require("./config/databse");
const apiRoutes = require("./routes/api");
const cors = require("cors");

const app = express(); 

db.connect();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
