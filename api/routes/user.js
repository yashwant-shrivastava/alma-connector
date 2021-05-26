const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const getJWTToken = require('../middlewares/auth_token');
const jwtService = require('../services/jwt');

const User = require('../models/user');

// API To Register New User
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

    jwt.sign(
      { user: user.id },
      config.get('JWT_SECRET_TOKEN'),
      { expiresIn: 3600},
      (err, token) => {
          if (err) {
              throw err;
          }
          res.json({token});
      }
    );
  } catch (err) {
    console.log(err);
      res.status(500).json({errors: [{"msg": "Server Error"}]});
  }
});

// get User from auth Token
router.get('/getUser', getJWTToken, async function(req, res, next) {
    let user_id = req.user;
    try {
        let user = await User.findById(user_id, '-password', function(err, result) {
            if (err) {
                throw err;
            }
            res.status(200).json({result});
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }

});


// get User from Email and Password
router.get('/signIn', [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password').exists()
    ],
    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()});
        }

        const email = req.query.email;
        const password = req.query.password;

        try {
            let user = await User.findOne({email}, async function (err, user) {
                if (err) {
                    throw err;
                }

                if (!user) {
                    res.status(200).send({
                        'message': 'Invalid Credentials'
                    });
                }

                let isPasswordCorrect = await bcrypt.compare(password, user.password);

                if (!isPasswordCorrect) {
                    res.status(200).send({
                        'message': 'Invalid Credentials'
                    });
                }

                let jwt = new jwtService();
                let result = jwt.getJWTTokenForUser(user.id);

                console.log(result);
                // console.log(token);
                // console.log(message);

                // if (!status) {
                //     res.status(200).json({message});
                // }

                res.status(200).json({result});
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({'message': 'Server Error'});
        }
    }
)


module.exports = router;
