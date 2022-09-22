const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();

const MongoStore = require("connect-mongo");

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new MongoStore({ mongoUrl: "mongodb://localhost/sesiones" }),
    secret: "coderhouse",
    resave: true,
    saveUninitialized: true,
  })
);

function auth(req, res, next) {
  if (req.session.user == "pepe") return next();
  return res.status(401).send("error de autorización");
}

app.get("/login", (req, res) => {
  // res.redirect('/index.html');
  res.render("layouts/index");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== "pepe" || password !== "pepepass") {
    return res.send("login failed");
  }
  req.session.user = username;
  res.render("layouts/welcome", { username });
  // res.redirect('/welcome.html');
  // res.send("login success!");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.send("Logout Ok!");
    else res.send("Error");
  });
  const user = req.session.user;
  // res.redirect('/logout.html');
  res.render("layouts/logout", { user });
  setTimeout(()=>{
    res.render("layouts/index", { user });
  },2000);
});

app.get("/privada", auth, (req, res) => {
  const user = req.session.user;
  res.render("layouts/welcome", { user });
  // res.redirect('/welcome.html');
  // res.send("Estoy en una ruta privada");
});


app.listen(8080, () => {
    console.log('servidor escuchando');
});