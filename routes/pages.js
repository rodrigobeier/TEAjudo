const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/informacoes", (req, res) => {
  res.render("inclusao");
});

router.get("/ia", (req, res) => {
  res.render("ia");
});

router.get("/sobre", (req, res) => {
  res.render("sobre");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

module.exports = router;