require('dotenv').config();
const axios = require('axios');
const Match = require('../models/Match');

// Extended mock fallback data
const mockMatches = [
  { id: '1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 3, awayScore: 1, status: 'FINISHED', date: new Date(Date.now() - 86400000*2), league: 'Premier League', season: '2023' },
  { id: '2', homeTeam: 'Manchester City', awayTeam: 'Liverpool', homeScore: 2, awayScore: 2, status: 'FINISHED', date: new Date(Date.now() - 86400000*1), league: 'Premier League', season: '2023' },
  { id: '3', homeTeam: 'Manchester United', awayTeam: 'Tottenham', homeScore: 1, awayScore: 0, status: 'FINISHED', date: new Date(), league: 'Premier League', season: '2023' },
  { id: '4', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 2, awayScore: 1, status: 'FINISHED', date: new Date(Date.now() - 86400000*3), league: 'La Liga', season: '2023' },
  { id: '5', homeTeam: 'Atletico Madrid', awayTeam: 'Sevilla', homeScore: 0, awayScore: 0, status: 'FINISHED', date: new Date(Date.now() - 86400000*4), league: 'La Liga', season: '2023' },
  { id: '6', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', homeScore: 4, awayScore: 2, status: 'FINISHED', date: new Date(Date.now() - 86400000*1), league: 'Bundesliga', season: '2023' },
  { id: '7', homeTeam: 'Juventus', awayTeam: 'AC Milan', homeScore: 1, awayScore: 1, status: 'FINISHED', date: new Date(Date.now() - 86400000*2), league: 'Serie A', season: '2023' },
  { id: '8', homeTeam: 'PSG', awayTeam: 'Marseille', homeScore: 3, awayScore: 0, status: 'FINISHED', date: new Date(Date.now() - 86400000*0), league: 'Ligue 1', season: '2023' },
];

const fetchRealData = async () => {
    try {
        const apiKey = process.env.FOOTBALL_DATA_API_KEY;
        if (!apiKey) {
           console.log('No API key provided. Falling back to mock data...');
           return await seedMockData();
        }

        console.log('Fetching real data for multiple leagues from football-data.org...');
        
        const competitionCodes = ['PL', 'PD', 'BL1', 'SA', 'FL1'];
        
        // Fetch all 5 concurrently
        const responses = await Promise.allSettled(
            competitionCodes.map(comp => 
               axios.get(`http://api.football-data.org/v4/competitions/${comp}/matches`, {
                  headers: { 'X-Auth-Token': apiKey }
               })
            )
        );

        let allRealMatches = [];

        responses.forEach(result => {
           if (result.status === 'fulfilled') {
              const competitionName = result.value.data.competition.name;
              let matches = result.value.data.matches
                .filter(m => m.status === 'FINISHED')
                .map(m => ({
                    id: m.id.toString(),
                    homeTeam: m.homeTeam.name,
                    awayTeam: m.awayTeam.name,
                    homeCrest: m.homeTeam.crest || '',
                    awayCrest: m.awayTeam.crest || '',
                    homeScore: m.score.fullTime.home !== null ? m.score.fullTime.home : 0,
                    awayScore: m.score.fullTime.away !== null ? m.score.fullTime.away : 0,
                    status: m.status,
                    date: new Date(m.utcDate),
                    league: competitionName,
                    season: m.season ? m.season.startDate.substring(0,4) : "2023"
                }));
              allRealMatches = allRealMatches.concat(matches);
           } else {
               console.error('Failed to fetch a league:', result.reason.message);
           }
        });

        if (allRealMatches.length > 0) {
           await Match.deleteMany({}); // clear existing
           await Match.insertMany(allRealMatches);
           console.log(`Successfully fetched and seeded ${allRealMatches.length} matches from the API across multiple leagues!`);
        } else {
           throw new Error('No matches returned from any of the real API requests');
        }

    } catch (error) {
        console.error('Error fetching from real API, falling back to mock data:', error.message);
        await seedMockData();
    }
};

const seedMockData = async () => {
    try {
        const count = await Match.countDocuments();
        if (count === 0) {
            await Match.insertMany(mockMatches);
            console.log('Mock matches seeded to database successfully');
        }
    } catch (error) {
        console.error('Error seeding mock data:', error);
    }
};

module.exports = { seedMockData, fetchRealData };
