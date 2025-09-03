const passport = require("passport");
const prisma = require("../src/prismaClient");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const homePage = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render("home");
  } else if (req.isAuthenticated) {
    return res.redirect("/home");
  }
};
const mainpage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  } else {
    const folders = await prisma.folder.findMany({
      orderBy: { name: "desc" },
      where: { ownerId: req.user.id },
    });
    const ownerName = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const folderId = req.params.id;
    res.render("dashboard", {
      folders: folders,
      ownerName,
      files: [],
      folderId,
    });
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
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const folderId = req.params.id;
  res.render("addfile.ejs", { folderId: folderId });
};

const newFilePost = async (req, res) => {
  try {
    await prisma.file.create({
      data: {
        originalName: req.file.originalname,
        url: req.file.path,
        publicId: req.file.public_id,
        size: req.file.size,
        folder: {
          connect: { id: Number(req.params.id) },
        },
        uploader: {
          connect: { id: Number(req.user.id) },
        },
      },
    });
    res.send("Successfully Uploaded");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Uploading file");
  }
};

const editFolderName = async (req, res) => {
  try {
    await prisma.folder.update({
      where: { id: Number(req.params.id) },
      data: { name: req.body.name },
    });
  } catch (err) {
    console.log("We have an error:", err);
  } finally {
    res.redirect(`/folders/${req.params.id}`);
  }
};

const deleteFolderName = async (req, res) => {
  try {
    await prisma.folder.delete({ where: { id: Number(req.params.id) } });
  } catch (err) {
    console.log("We have an err", err);
  } finally {
    res.redirect(`/folders/${req.params.id}`);
  }
};
const getfolderfiles = async (req, res) => {
  const folders = await prisma.folder.findMany({});
  const ownerName = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const files = await prisma.file.findMany({
    include: { uploader: true },
    where: { folderId: Number(req.params.id) },
    orderBy: { createdAt: "desc" },
  });
  const folderId = req.params.id;
  if (!files) return res.sendStatus(404);
  res.render("dashboard", {
    files,
    folders,
    ownerName,
    folderId,
  });
};

const deletefiles = async (req, res) => {
  await prisma.file.delete({ where: { id: Number(req.params.id) } });
  res.redirect(`/folders/${req.params.id}`);
};

const logOut = async (req, res) => {
  await req.logout((err) => {
    if (err) {
      return res.status(404).send("Error logging out");
    }
    res.redirect("/");
  });

};

const generateShareLink = async (req, res) => {
  try {
    const folderId = Number(req.params.folderId);
    const duration = Number(req.body.duration);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    const shareId = uuidv4();

    await prisma.sharedFolder.create({
      data: {
        shareId: shareId,
        folderId: folderId,
        expiresAt: expiresAt,
      },
    });
    const shareUrl = `${req.protocol}://${req.get("host")}/share/${shareId}`;
    res.send(shareUrl);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating share link");
  }
};

const viewSharedFolder = async (req, res) => {
  try {
    const shareId = req.params.shareId;

    const sharedFolder = await prisma.sharedFolder.findUnique({
      where: {
        shareId: shareId,
      },
      include: {
        folder: {
          include: { files: true, owner: true },
        },
      },
    });

    if (!sharedFolder) {
      res.status(404).send("Share link not found");
    }

    if (new Date() > sharedFolder.expiresAt) {
      res.status(404).send("Share Link has expired");
    }

    res.render("sharePage", {
      folder: sharedFolder.folder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error accessing shared folder");
  }
};

const shareform = (req, res) => {
  const folderId = req.params.folderId;
  res.render("share", {
    folderId: folderId,
  });
};
module.exports = {
  signUpGet,
  signUpPost,
  loginGet,
  loginPost,
  folderPost,
  getfolderfiles,
  deletefiles,
  mainpage,
  newFileGet,
  newFilePost,
  logOut,
  editFolderName,
  deleteFolderName,
  generateShareLink,
  viewSharedFolder,
  shareform,
  homePage,
};
