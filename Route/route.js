const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const controller = require("../controller/controller");
require("dotenv").config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_app_uploads",
    resource_type: "auto",
  },
});

const upload = multer({ storage });
router.get("/", controller.homePage)
router.get("/home", controller.mainpage);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", controller.signUpPost);
router.post("/folders/new/:id", controller.folderPost);

router.get("/file/new/:id", controller.newFileGet);
router.post("/file/new/:id", upload.single("myFile"), controller.newFilePost);
router.post("/folders", controller.folderPost);
router.get("/folders/:id", controller.getfolderfiles);
router.post("/folders/:id/edit", controller.editFolderName);
router.post("/folders/delete/:id", controller.deleteFolderName);
router.post("/file/delete/:id", controller.deletefiles);
router.post("/logout", controller.logOut);
router.get("/share/:shareId", controller.viewSharedFolder);
router.post("/folders/share/:folderId", controller.generateShareLink);
router.get("/folders/share/:folderId", controller.shareform);

module.exports = router;
