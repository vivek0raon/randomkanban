import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const columnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'indigo-500', 
  },
  cards: [cardSchema],
}, { timestamps: true });

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Main Board',
  },
  category: {
    type: String,
    default: 'General'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  columns: [columnSchema],
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);

export default Board;
