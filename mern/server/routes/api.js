const express = require("express");
const router = express.Router();
const DataModel = require("../models/data");

router.get("/data", async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
