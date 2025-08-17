const { Router } = require("express");
const router = Router();
const controller = require("../controller/controller");
router.get("/", (req, res) => {
  res.send("Testing Testing");
});

router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", controller.signUpPost);
router.get("/folders/new", controller.folderGet);
router.post("/folders", controller.folderPost);
router.get("/folders/:id", controller.getfolderfiles);
router.post("/folders/:id/delete", controller.deletefolderfiles);

module.exports = router;
