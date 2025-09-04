const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const path = require("path");
const app = express();
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./src/prismaClient");
const appRouter = require("./Route/route");
const multer = require("multer");

require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: "Invalid Username" });

      const ok = bcrypt.compare(password, user.password);
      if (!ok) return done(null, false, { message: "Invalid Password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/", appRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App live at ${port}`);
});
