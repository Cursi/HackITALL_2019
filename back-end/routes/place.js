const express = require('express');
const router = express.Router();
const PlaceController = require('../controllers/place');

router.get("/favorite", PlaceController.getFavoritePlaces);
router.get("/:id", PlaceController.getPlace);
router.post("/favorite/:id", PlaceController.addFavoritePlace);
router.post("/", PlaceController.createPlace);
router.put("/:id", PlaceController.updatePlace);

module.exports = router;