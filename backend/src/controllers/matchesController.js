const Match = require('../models/Match');

const cache = {};
const CACHE_TTL = 30000; // 30s cache

const getMatches = async (req, res) => {
  try {
    const { league, season, team } = req.query;
    
    const cacheKey = `matches_${league||'all'}_${season||'all'}_${team||'all'}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
        return res.json(cache[cacheKey].data);
    }

    const filter = {};
    if (league) filter.league = league;
    if (season) filter.season = season;
    if (team) {
       filter.$or = [{ homeTeam: team }, { awayTeam: team }];
    }

    const matches = await Match.find(filter).sort({ date: -1 });
    cache[cacheKey] = { timestamp: Date.now(), data: matches };
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findOne({ id: req.params.id });
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match', error: error.message });
  }
};

module.exports = { getMatches, getMatchById };
