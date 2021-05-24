const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../models/user');


router.post('/register', [
    check('name').isLength({ min: 3 }),
    check('email', 'Please enter a valid email').isEmail(),
    check('age', 'Please enter correct age').isNumeric(),
    check('password', 'Password Length should have minimum 8 characters').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const name  = req.body.name;
  const email = req.body.email;
  const age   = req.body.age;
  const password = req.body.password;

  try {
    let user = await User.findOne({email});
    if (user) {
      res.status(422).json({errors: [{"msg": "User Already Exists"}]});
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      age,
      password,
      avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send("User Registered");
  } catch (err) {
      res.status(500).json({errors: [{"msg": "Server Error"}]});
  }
});

module.exports = router;
