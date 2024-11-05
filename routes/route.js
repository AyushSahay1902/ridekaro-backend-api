const express = require('express');
const router = express.Router();
const { getAllProductPrices, testingPrices } = require('../controllers/products');

router.get('/', getAllProductPrices);
router.get('/testing', testingPrices);

module.exports = router;
