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
  while (newRankIndex < RANK_NAMES.length - 1 && newRankPoints >= POINTS_PER_RANK[newRankIndex]) {
    newRankPoints -= POINTS_PER_RANK[newRankIndex];
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
  user.inactiveDays = 0; // Reset inactive streak
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

exports.processDailyInactivityPenalties = async () => {
  const users = await User.find({});
  const Task = require('../models/Task');
  
  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);
  
  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  let updatedUsers = 0;

  for (const user of users) {
    // Count tasks completed yesterday
    const completedTasksCount = await Task.countDocuments({
      userId: user._id,
      status: 'completed',
      completedAt: { $gte: startOfYesterday, $lte: endOfYesterday }
    });

    if (completedTasksCount === 0) {
      // Inactive yesterday
      user.inactiveDays = (user.inactiveDays || 0) + 1;
      
      // Calculate penalty: 1 day = 20, 2 days = 30, 3 days = 40...
      // formula: 10 + (inactiveDays * 10)
      const penalty = 10 + (user.inactiveDays * 10);
      
      user.rankPoints -= penalty;
      
      // Handle rank demotion if points < 0
      while (user.rankPoints < 0 && user.rankIndex > 0) {
        user.rankIndex--;
        const previousRankMaxPoints = POINTS_PER_RANK[user.rankIndex];
        user.rankPoints += previousRankMaxPoints;
      }
      
      // If even after demotion to Bronze, points are < 0, cap at 0
      if (user.rankPoints < 0) {
        user.rankPoints = 0;
        user.rankIndex = 0;
      }

      await user.save();
      
      await Transaction.create({
        userId: user._id,
        type: 'spend',
        amount: 0,
        reason: `Phạt vắng mặt ngày ${user.inactiveDays} (-${penalty} EXP)`
      });
      
      updatedUsers++;
    }
  }
  
  if (updatedUsers > 0) {
    const { broadcastLeaderboardUpdate } = require('../sockets/socket');
    broadcastLeaderboardUpdate();
  }
  console.log(`Processed inactivity penalties for ${updatedUsers} users.`);
};
