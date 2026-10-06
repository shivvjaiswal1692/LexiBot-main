const { body, validationResult } = require('express-validator');

// Validation rules
const signupValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const chatValidation = [
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters'),
  body('sessionId').optional().isMongoId().withMessage('Invalid session ID'),
];

// Validation result checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Prompt injection detection
const INJECTION_PATTERNS = [
  /ignore (previous|all|above) instructions/i,
  /forget (your|all) (instructions|guidelines|rules)/i,
  /you are now/i,
  /act as (a )?(different|new|another)/i,
  /pretend (you are|to be)/i,
  /jailbreak/i,
  /bypass (your|the) (safety|filter|restriction)/i,
  /system prompt/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
];

const sanitizeInput = (req, res, next) => {
  const { message } = req.body;
  if (message) {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(message)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input detected. Please ask a genuine legal question.',
        });
      }
    }
  }
  next();
};

module.exports = { signupValidation, loginValidation, chatValidation, validate, sanitizeInput };
