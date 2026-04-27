const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeCrest: { type: String },
  awayCrest: { type: String },
  homeScore: { type: Number, required: true },
  awayScore: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, required: true },
  league: { type: String, required: true },
  season: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
