const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Get gig list
router.get("/", (req, res) =>
  Gig.findAll()
    .then((gigs) => {
      console.log(gigs);

      // New required secure method
      const context = {
        gigs: gigs.map((gig) => {
          return {
            title: gig.title,
            technologies: gig.technologies,
            budget: gig.budget,
            description: gig.description,
            contact_email: gig.contact_email,
          };
        }),
      };

      res.render("gigs", {
        gigs: context.gigs,
      });
    })
    .catch((err) => console.log(err))
);
// Display add gig form
router.get("/add", (req, res) => res.render("add"));

// Add gig
router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  // Validate fields
  if (!technologies) {
    errors.push({ text: "Please add technologies" });
  }
  if (!description) {
    errors.push({ text: "Please add description" });
  }
  if (!title) {
    errors.push({ text: "Please add title" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add contact email" });
  }

  // Check for errors

  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove spaces
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    // Insert data into table
    Gig.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    })
      .then((gig) => res.redirect("/gigs"))
      .catch((err) => console.log(err));
  }
});

// Search for gigs
router.get("/search", (req, res) => {
  let { term } = req.query;

  // Make all case valid
  term = term.toLowerCase();

  Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
    .then((gigs) => {
      const context = {
        gigs: gigs.map((gig) => {
          return {
            title: gig.title,
            technologies: gig.technologies,
            budget: gig.budget,
            description: gig.description,
            contact_email: gig.contact_email,
          };
        }),
      };

      res.render("gigs", { gigs: context.gigs });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
