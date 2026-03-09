const express = require('express');
const router = express.Router();

// Temporary placeholder auth route
router.get('/health', (req, res) => {
  res.json({ ok: true, module: 'auth', message: 'Auth routes placeholder' });
});

module.exports = router;

