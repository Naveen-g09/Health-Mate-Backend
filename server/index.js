const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Post = require("../models/Post.js");
const Docter = require("../models/coordinates.js");

const geolib = require("geolib");

const app = express();
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cors());

// get all Doctors
app.get("/getAllDoctors", (req, res) => {
  try {
    Docter.find({})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(408).json({ error });
      });
  } catch (error) {
    res.json({ error });
  }
});

const d = (listdata, l1, l2, radius) => {
  let newarray = [];

  const givenCoords = { latitude: l1, longitude: l2 };

  for (let i = 0; i < listdata.length; i++) {
    const otherCoords = {
      latitude: listdata[i]["l1"],
      longitude: listdata[i]["l2"],
    };

    const distance = geolib.getDistance(givenCoords, otherCoords);

    if (distance <= radius) {
      newarray.push(listdata[i]); // Use push to add elements to array
    }
  }

  return newarray;
};

app.post("/isnear", (req, res) => {
  try {
    const { l1, l2, radius } = req.body;

    Docter.find({})
      .then((data) => {
        // Filter data using the d function
        const filteredData = d(data, l1, l2, radius);
        res.json(filteredData); // Send back the filtered data
      })
      .catch((error) => {
        res.status(408).json({ error });
      });
  } catch (error) {
    res.json({ error });
  }
});

app.use("/uploads", async (req, res, next) => {
  const body = req.body;
  try {
    const newImage = await Post.create(body);
    newImage.save();
    res
      .status(201)
      .json({ message: "new image uploaded", createdPost: newImage });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
});

app.post("/doctors", async (req, res) => {
  const body = req.body;
  try {
    const newImage = await Docter.create(body);
    newImage.save();
    res
      .status(201)
      .json({ message: "new Doctor uploaded", createdPost: newImage });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
});

mongoose
  .connect("mongodb+srv://empower:empower123@cluster0.xnpx4qj.mongodb.net/", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(console.log("database connected"))
  .catch((err) => err);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("listening at port " + PORT);
});
