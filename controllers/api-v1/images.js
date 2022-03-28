const express = require("express")
const router = express.Router()
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { unlinkSync } = require('fs')

// config for multer -- tell it about the static folder
const uploads = multer({ dest: "uploads/" }) // this is a middleware

// GET /images -- READ all images (maybe for a user)
router.get("/", (req, res) => {
  res.send("get all images")
})

// POST /images -- CREATE an image
// uploads.method('key in the body')
router.post("/", uploads.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "no file uploaded" })
    const cloudImageData = await cloudinary.uploader.upload(req.file.path)
    console.log(cloudImageData.url)
    const  cloudImage = `https://res.cloudinary.com/solful/image/upload/v1593119998/${cloudImageData.public_id}.png`

    unlinkSync(req.file.path)
    res.json({ cloudImage })

  } catch (err) {
    console.log(err)
    res.status(503).json({ msg: "you should look at the server console" })
  }
})

module.exports = router
