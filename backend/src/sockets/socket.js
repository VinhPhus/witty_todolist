const socketIo = require('socket.io');
const User = require('../models/User');

let io;

exports.initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*', // Customize in production
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // When a user requests the leaderboard
    socket.on('get_leaderboard', async () => {
      try {
        const topPlayers = await User.find({})
          .sort({ rankIndex: -1, rankPoints: -1, updatedAt: 1 })
          .limit(50)
          .select('displayName avatarUrl rankIndex rankPoints _id');
          
        socket.emit('leaderboard_data', topPlayers);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

exports.getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

exports.broadcastLeaderboardUpdate = async () => {
  if (io) {
    try {
      const topPlayers = await User.find({})
        .sort({ rankIndex: -1, rankPoints: -1, updatedAt: 1 })
        .limit(50)
        .select('displayName avatarUrl rankIndex rankPoints _id');
        
      io.emit('leaderboard_data', topPlayers);
    } catch (error) {
      console.error(error);
    }
  }
};
