const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// Checking or Vaildating data
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post('/', [
    check('name', 'Please enter a name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a vaild email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });    
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'User already exsits' });
        }

        user = new User({ 
            name,
            email,
            password
        });

        // To encrypt the password
        const salt = await bcrypt.genSalt(10);
        
        user.password = await bcrypt.hash(password, salt);

        // Save to database
        await user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{
            // 3600 is a hour
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}
);

module.exports = router;