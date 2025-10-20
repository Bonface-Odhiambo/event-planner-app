const express = require('express');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chat/:chatId
// @desc    Get chat messages
// @access  Public (for anonymous users) / Private (for registered users)
router.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Message.countDocuments({ chatId });
    
    res.json({
      success: true,
      messages,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/:chatId/messages
// @desc    Send message
// @access  Public (for anonymous users) / Private (for registered users)
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, senderName, senderEmail, senderType } = req.body;

    if (!content || !senderName || !senderEmail) {
      return res.status(400).json({
        success: false,
        message: 'Content, sender name, and sender email are required'
      });
    }

    // Determine sender type
    let messageSenderType = 'guest';
    if (senderType === 'bot') {
      messageSenderType = 'bot';
    } else if (req.user) {
      messageSenderType = req.user.role === 'admin' || req.user.role === 'planner' ? 'admin' : 'user';
    }

    const message = new Message({
      chatId,
      content,
      senderName,
      senderEmail,
      senderType: messageSenderType
    });

    await message.save();

    // Emit to all users in the chat room
    const io = req.app.get('io');
    io.to(chatId).emit('newMessage', message);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @route   PUT /api/chat/:chatId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:chatId/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        isRead: true,
        $addToSet: {
          readBy: {
            user: req.user.id,
            readAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/active
// @desc    Get active chats (admin only)
// @access  Private (Admin)
router.get('/active', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'planner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const activeChats = await Message.aggregate([
      {
        $group: {
          _id: '$chatId',
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$createdAt' },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({
      success: true,
      chats: activeChats
    });
  } catch (error) {
    console.error('Get active chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
