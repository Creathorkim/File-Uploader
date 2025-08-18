const passport = require("passport");
const prisma = require("../src/prismaClient");
const bcrypt = require("bcryptjs");

const mainpage = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  } else {
    res.render("dashboard");
  }
};
const signUpGet = (req, res) => {
  res.render("sign-up");
};

const signUpPost = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  });
  res.redirect("/");
};

const loginGet = (req, res) => {
  res.render("login");
};

const loginPost = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
};

const folderGet = (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  }
  res.render("addfolder.ejs");
};

const folderPost = async (req, res) => {
  await prisma.folder.create({
    data: {
      name: req.body.name,
      ownerId: req.user.id,
    },
  });
  res.redirect("/");
};

const newFileGet = (req, res) => {
  res.render("addfile.ejs");
};

const getfolderfiles = async (req, res) => {
  const folder = await prisma.folder.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: { files: true },
  });
  if (!folder) return res.sendStatus(404);
  res.render("folder", { folder });
};

const deletefolderfiles = async (req, res) => {
  await prisma.folder.delete({ where: { id: req.params.id } });
  res.redirect("/");
};

module.exports = {
  signUpGet,
  signUpPost,
  loginGet,
  loginPost,
  folderGet,
  folderPost,
  getfolderfiles,
  deletefolderfiles,
  mainpage,
  newFileGet
};
