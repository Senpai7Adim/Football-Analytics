const express = require('express');
const router = express.Router();

const { getMatches, getMatchById } = require('../controllers/matchesController');
const { getStats } = require('../controllers/statsController');
const { getTeams } = require('../controllers/teamsController');

router.get('/matches', getMatches);
router.get('/matches/:id', getMatchById);
router.get('/stats', getStats);
router.get('/teams', getTeams);

module.exports = router;
