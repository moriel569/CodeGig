const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");

// Get gig list
router.get("/", (req, res) =>
  Gig.findAll()
    .then((gigs) => {
      console.log(gigs);

      // New required sequre method
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
  const data = {
    title: "Wordpress Site",
    technologies: "Wordpress, php , html, css",
    budget: "$1000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida egestas quam sed bibendum. Nulla hendrerit mauris in tristique tristique. Quisque ut condimentum quam, a pharetra felis. Etiam eget ultricies lorem. In scelerisque velit nisi, eget tincidunt felis semper nec. Quisque ac lectus suscipit, pharetra enim sed, dictum orci. Sed eu ullamcorper est. Aenean gravida sodales ligula. Nam mollis arcu est. Curabitur ut molestie nisi.",
    contact_email: "trav@gmail.com",
  };

  let { title, technologies, budget, description, contact_email } = data;

  // Insert into table
  Gig.create({
    title,
    technologies,
    budget,
    description,
    contact_email,
  })
    .then((gig) => res.redirect("/gigs"))
    .catch((err) => console.log(err));
});

module.exports = router;
