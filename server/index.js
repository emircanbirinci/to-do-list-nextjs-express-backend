const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      next();
    });

    server.get("/api/priority", (req, res) => {
      let data = {
        priorityList: { 1: "  Trivial", 2: "Regular", 3: "Urgent" },
      };
      res.send(data);
    });

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.log(`Server ready on ${process.env.PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
