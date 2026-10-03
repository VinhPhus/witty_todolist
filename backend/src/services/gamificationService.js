const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { POINTS_PER_DIFFICULTY, POINTS_PER_RANK, REWARDS_PER_RANK, MAX_POINTS_PER_DAY, RANK_NAMES } = require('../config/constants');

exports.awardPointsForTask = async (userId, taskId, difficulty) => {
  const points = POINTS_PER_DIFFICULTY[difficulty] || 0;
  if (points === 0) return { awarded: 0 };

  // TODO: Check MAX_POINTS_PER_DAY limit
  // For now, simple logic
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let newRankPoints = user.rankPoints + points;
  let newRankIndex = user.rankIndex;
  let newBalance = user.balance;
  let rankUps = 0;
  
  // Calculate rank ups
  while (newRankPoints >= POINTS_PER_RANK && newRankIndex < RANK_NAMES.length - 1) {
    newRankPoints -= POINTS_PER_RANK;
    newRankIndex++;
    rankUps++;
    newBalance += REWARDS_PER_RANK[newRankIndex];
  }
  
  // Handle GOD rank (max rank)
  if (newRankIndex >= RANK_NAMES.length - 1) {
    newRankIndex = RANK_NAMES.length - 1;
    // Keep accumulating points if GOD, or cap it? Requirements: "đạt GOD thì chỉ tiếp tục tích điểm"
  }

  // Update user atomically if possible, but save() is fine here
  user.rankPoints = newRankPoints;
  user.rankIndex = newRankIndex;
  user.balance = newBalance;
  user.totalTasksCompleted += 1;
  await user.save();

  // Create transaction for task completion
  await Transaction.create({
    userId,
    type: 'earn',
    amount: points,
    reason: 'Hoàn thành task',
    referenceId: taskId
  });

  // Create transactions for rank up rewards
  if (rankUps > 0) {
    let totalReward = 0;
    for (let i = 0; i < rankUps; i++) {
       totalReward += REWARDS_PER_RANK[user.rankIndex - i];
    }
    await Transaction.create({
      userId,
      type: 'earn',
      amount: totalReward,
      reason: `Thưởng lên rank ${RANK_NAMES[user.rankIndex]}`,
    });
  }
  
  // Broadcast update
  const { broadcastLeaderboardUpdate } = require('../sockets/socket');
  broadcastLeaderboardUpdate();

  return { 
    awarded: points, 
    newRankIndex, 
    newRankPoints, 
    newBalance,
    rankUps
  };
};
