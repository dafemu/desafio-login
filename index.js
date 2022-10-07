import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import exphbs from "express-handlebars";
import path from "path";

import User from "./models/User.js";
import "./db/config.js";

const app = express();

app.use(cookieParser());

app.set("views", path.join(path.dirname(""), "./views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 200000,
    },
  })
);

function auth(req, res, next) {
  if (req.session.user == "pepe") return next();
  return res.status(401).send("error de autorización");
}

app.get("/", (req, res) => {
  if (req.session.nombre) {
    res.redirect("/datos");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/login-error", (req, res) => {
  res.render("login-error");
});

app.post(
  "/login",(req, res) => {
    res.redirect("/datos");
  }
);

app.get("/datos", auth, async (req, res) => {
  const datosUsuario = await User.findById(req.user._id).lean();
  res.render("datos", {
    datosUsuario,
  });
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(8080, () => {
    console.log('servidor escuchando');
});