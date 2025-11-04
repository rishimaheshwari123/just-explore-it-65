const express = require("express");
const router = express.Router();

const {
  createHeroItem,
  getHeroItems,
  updateHeroItem,
  toggleHeroItem,
  deleteHeroItem,
} = require("../controllers/heroCarouselCtrl");

router.post("/create", createHeroItem);
router.get("/list", getHeroItems);
router.put("/:id", updateHeroItem);
router.patch("/:id/toggle", toggleHeroItem);
router.delete("/:id", deleteHeroItem);

module.exports = router;