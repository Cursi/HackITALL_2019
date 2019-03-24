const express = require('express');
const router = express.Router();
const OfferController = require('../controllers/offer');

router.get("/owner", OfferController.getAllOfferForOwner);
router.get("/:id", OfferController.getAllOffers);
router.post("/", OfferController.createOffer);
router.delete("/:id", OfferController.deleteOffer);

module.exports = router;