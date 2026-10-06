const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [10000, 'Message too long'],
  },
  category: {
    type: String,
    enum: ['criminal_law', 'civil_law', 'corporate_law', 'family_law', 'property_law', 'general', null],
    default: null,
  },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: [100, 'Title too long'],
  },
  messages: [messageSchema],
  category: {
    type: String,
    enum: ['criminal_law', 'civil_law', 'corporate_law', 'family_law', 'property_law', 'general'],
    default: 'general',
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt
chatSessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate title from first user message
chatSessionSchema.methods.generateTitle = function () {
  const firstUserMessage = this.messages.find((m) => m.role === 'user');
  if (firstUserMessage) {
    this.title = firstUserMessage.content.substring(0, 60) + (firstUserMessage.content.length > 60 ? '...' : '');
  }
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
