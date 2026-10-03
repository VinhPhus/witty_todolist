const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true, index: true },
  difficulty: { type: String, enum: ['Dễ', 'Vừa', 'Khó'], default: 'Dễ' },
  status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
  pointsAwarded: { type: Number, default: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
