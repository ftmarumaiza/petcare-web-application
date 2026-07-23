const express = require("express");
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// all pet routes require login
router.use(protect);

router.route("/").get(getPets).post(upload.single("image"), createPet);

router
  .route("/:id")
  .get(getPetById)
  .put(upload.single("image"), updatePet)
  .delete(deletePet);

module.exports = router;
