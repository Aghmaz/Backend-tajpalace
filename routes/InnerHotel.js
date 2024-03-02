const router = require("express").Router();
const multer = require("multer");
const AdminUser = require("../models/InnerHotel");
const cloudinary = require("cloudinary").v2;
const upload = require("../utils/multer");
cloudinary.config({
  cloud_name: "hotelroombooking",
  api_key: "641889425963741",
  api_secret: "52b7oARz39qXsuL2oZRFCUNX8TQ",
});

// get all files

router.get("/addfile", async (req, res) => {
  try {
    const room = await AdminUser.find({});
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
});
//add file

router.patch("/addfile/:id", upload.single("file"), async (req, res) => {
  try {
    const existingUser = await AdminUser.findOne({ userId: req.params.id });

    if (!existingUser) {
      // User not found, create a new user
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type:
            req.file.mimetype === "image/jpeg" ||
            req.file.mimetype === "image/png"
              ? "raw"
              : "auto",
          format: req.file.originalname.split(".").pop(),
        });

        const fileId = result.public_id;
        const secure_url_file = result.secure_url;

        const newUser = new AdminUser({
          userId: req.params.id,
          caseImage: [
            {
              url: secure_url_file,
              public_id: fileId,
              format: result.format,
            },
          ],
        });

        const savedUser = await newUser.save();
        if (!savedUser) {
          return res.status(404).json({
            status: "Error",
            message: "Failed to save new user",
          });
        }

        res.status(200).json({
          status: "Success",
          data: {
            savedUser,
            fileId,
            secure_url_file,
          },
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: "Error",
          message: "Internal Server Error",
        });
      }
    } else {
      // User exists, update the existing user
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type:
          req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png"
            ? "raw"
            : "auto",
        format: req.file.originalname.split(".").pop(),
      });

      const fileId = result.public_id;
      const secure_url_file = result.secure_url;

      const updatedUser = await AdminUser.findByIdAndUpdate(
        existingUser._id,
        {
          $push: {
            caseImage: {
              url: secure_url_file,
              public_id: fileId,
              format: result.format,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "Success",
        data: {
          updatedUser,
          fileId,
          secure_url_file,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
});

//updateFile

router.patch(
  "/updatefile/:adminId/:fileId",
  upload.single("file"),
  async (req, res) => {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type:
        req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png"
          ? "raw"
          : "auto",
      format: req.file.originalname.split(".").pop(),
    });

    // Update user
    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.adminId,
      {
        $set: {
          "caseImage.$[elem].url": result.secure_url,
          "caseImage.$[elem].public_id": result.public_id,
          "caseImage.$[elem].format": result.format,
        },
      },
      {
        new: true,
        runValidators: true,
        arrayFilters: [
          { "elem.public_id": req.params.fileId },
          { "elem.url": req.body.url }, // add this condition to match the original url
        ],
      }
    );

    console.log("req.params.engineerId of update file", req.params.engineerId);
    console.log("result.secure_url of update file", result.secure_url);

    if (!updatedUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found or file not associated with user",
      });
    }
    console.log("updatedUser of update file", updatedUser);
    try {
      res.status(200).json({
        status: "Success",
        data: {
          updatedUser,
          fileId: req.params.fileId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.delete("/deletefile/:adminId/:fileId", async (req, res) => {
  const fileId = req.params.fileId;
  console.log("req.params.fileId", req.params.fileId);
  try {
    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(fileId);

    // Remove file from user record
    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.adminId,
      { $pull: { caseImage: { public_id: fileId } } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "Success",
      data: {
        message: "File successfully deleted",
        updatedUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "Failed to delete file",
    });
  }
});
module.exports = router;
