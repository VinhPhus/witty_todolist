const cron = require('node-cron');
const Season = require('../models/Season');
const User = require('../models/User');
const { SEASON_DURATION_MONTHS } = require('../config/constants');
const { broadcastLeaderboardUpdate } = require('../sockets/socket');

exports.initCronJobs = () => {
  // Chạy vào 00:00 ngày mùng 1 mỗi tháng
  cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('Checking season reset...');
      const currentSeason = await Season.findOne({ status: 'active' });
      
      if (!currentSeason) return;

      const now = new Date();
      if (now >= currentSeason.endDate) {
        console.log('Ending current season and starting a new one...');
        
        // 1. Get Top players
        const topPlayers = await User.find({})
          .sort({ rankIndex: -1, rankPoints: -1, updatedAt: 1 })
          .limit(50)
          .select('displayName rankIndex rankPoints');
          
        const formattedTop = topPlayers.map(p => ({
          userId: p._id,
          displayName: p.displayName,
          rankIndex: p.rankIndex,
          rankPoints: p.rankPoints
        }));

        // 2. Update current season status and save top players
        currentSeason.status = 'ended';
        currentSeason.topPlayers = formattedTop;
        await currentSeason.save();
        
        // 3. Reset ranks for all users
        await User.updateMany({}, {
          $set: {
            rankIndex: 0,
            rankPoints: 0
          }
        });
        
        // 4. Create new season
        const nextEndDate = new Date();
        nextEndDate.setMonth(nextEndDate.getMonth() + SEASON_DURATION_MONTHS);
        
        const newSeason = await Season.create({
          name: `Mùa ${new Date().getFullYear()} - Đợt ${Math.ceil(new Date().getMonth()/SEASON_DURATION_MONTHS) + 1}`,
          startDate: now,
          endDate: nextEndDate,
          status: 'active'
        });
        
        // Broadcast new empty leaderboard
        broadcastLeaderboardUpdate();
        
        console.log('Season reset completed. New season:', newSeason.name);
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};
