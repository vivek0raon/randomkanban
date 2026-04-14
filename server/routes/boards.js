import express from 'express';
import Board from '../models/Board.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all board routes
router.use(protect);

// Get all boards for the logged-in user
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new board
router.post('/', async (req, res) => {
  try {
    const newBoard = new Board({
      title: req.body.title || 'New Board',
      category: req.body.category || 'General',
      user: req.user._id,
      columns: req.body.columns || [
        { title: 'To Do', color: 'indigo-500', cards: [] },
        { title: 'In Progress', color: 'cyan-500', cards: [] },
        { title: 'Done', color: 'emerald-500', cards: [] }
      ]
    });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update the full board (for drag and drop reordering)
router.put('/:id', async (req, res) => {
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, 
      { new: true }
    );
    if (!updatedBoard) return res.status(404).json({ message: 'Board not found' });
    res.json(updatedBoard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a board
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a column
router.post('/:id/columns', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    board.columns.push(req.body);
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a card to a column
router.post('/:id/columns/:colId/cards', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    const column = board.columns.id(req.params.colId);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    
    column.cards.push(req.body);
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a card
router.put('/:id/columns/:colId/cards/:cardId', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    const column = board.columns.id(req.params.colId);
    const card = column.cards.id(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    Object.assign(card, req.body);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a card
router.delete('/:id/columns/:colId/cards/:cardId', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const column = board.columns.id(req.params.colId);
    column.cards = column.cards.filter(c => c._id.toString() !== req.params.cardId);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
