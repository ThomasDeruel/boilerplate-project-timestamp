// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// middleware -> date validator
// add res.locals.date -> date
// or -> send json error
function validateDate(req, res, next) {
  const param = req.params.date;
  let date = param.trim() !== "" ? new Date(param) : new Date();
  if (isNaN(date)) {
    date = new Date(parseInt(param));
    if (date.toString() == "Invalid Date") {
      res.json({ error: "Invalid Date" });
      return;
    }
  }
  res.locals.date = date;
  next();
}
// return defauft date
app.get("/api/timestamp/", function (req, res) {
  const date = new Date();
  res.status(200).json({ unix: Date.now(), utc: date });
});

app.get("/api/timestamp/:date", validateDate, function (req, res) {
  const date = res.locals.date;
  const unix = date.getTime();
  let utc = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
  utc = utc.toUTCString();
  res.status(200).json({ unix, utc });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
