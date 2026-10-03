module.exports = {
  POINTS_PER_DIFFICULTY: {
    'Dễ': 5,
    'Vừa': 10,
    'Khó': 20
  },
  RANK_NAMES: [
    'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Supreme', 'Extra Supreme'
  ],
  POINTS_PER_RANK: [100, 150, 200, 250, 300, 350, 400, 400],
  REWARDS_PER_RANK: [
    0, // Lên Bronze (ko thưởng, vì mặc định)
    50, // Lên Silver
    100, // Lên Gold
    150, // Lên Platinum
    200, // Lên Diamond
    300, // Lên Master
    400, // Lên Grand Master
    500  // Lên GOD
  ],
  MAX_POINTS_PER_DAY: 200, // Chống gian lận: giới hạn điểm tối đa 1 ngày
  SEASON_DURATION_MONTHS: 3
};
