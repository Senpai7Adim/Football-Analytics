const Match = require('../models/Match');

const getTeams = async (req, res) => {
  try {
    const matches = await Match.find();
    const teams = new Set();
    matches.forEach(m => {
        teams.add(m.homeTeam);
        teams.add(m.awayTeam);
    });
    res.json(Array.from(teams));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};

module.exports = { getTeams };
