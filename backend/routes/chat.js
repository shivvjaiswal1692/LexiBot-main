const express = require('express');
const ChatSession = require('../models/ChatSession');
const { protect } = require('../middleware/auth');
const { chatValidation, validate, sanitizeInput } = require('../middleware/validation');
const { streamLegalResponse, detectCategory } = require('../config/openai');

const router = express.Router();

// POST /api/chat — send message with streaming response
router.post('/', protect, chatValidation, validate, sanitizeInput, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user._id;

    // Find or create session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Chat session not found.' });
      }
    } else {
      session = await ChatSession.create({ userId, messages: [] });
    }

    // Detect legal category
    const category = detectCategory(message);
    if (category !== 'general') session.category = category;

    // Add user message
    session.messages.push({ role: 'user', content: message, category });
    await session.save();

    // Build conversation history for context (last 10 messages)
    const historyMessages = session.messages
      .slice(-10)
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    // Set up SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-Id', session._id.toString());

    // Send session ID immediately
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session._id })}\n\n`);

    let fullResponse = '';

    await streamLegalResponse(
      historyMessages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      },
      async (complete) => {
        fullResponse = complete;
        // Save assistant message
        session.messages.push({ role: 'assistant', content: fullResponse, category });
        if (session.messages.length === 2) session.generateTitle();
        await session.save();
        res.write(`data: ${JSON.stringify({ type: 'done', sessionId: session._id })}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to process your request.' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'An error occurred. Please try again.' })}\n\n`);
      res.end();
    }
  }
});

// GET /api/chat/history — get all sessions for user
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id, isActive: true })
      .select('title category createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(50);

    // Return sessions with preview (last message snippet)
    const sessionsWithPreview = sessions.map((s) => ({
      id: s._id,
      title: s.title,
      category: s.category,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages.length,
      preview: s.messages.length > 0 ? s.messages[s.messages.length - 1].content.substring(0, 80) + '...' : '',
    }));

    res.json({ success: true, sessions: sessionsWithPreview });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat history.' });
  }
});

// GET /api/chat/session/:id — get a specific session with all messages
router.get('/session/:id', protect, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }
    res.json({ success: true, session });
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch session.' });
  }
});

// DELETE /api/chat/session/:id — delete a session
router.delete('/session/:id', protect, async (req, res) => {
  try {
    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false }
    );
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }
    res.json({ success: true, message: 'Session deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete session.' });
  }
});

module.exports = router;
