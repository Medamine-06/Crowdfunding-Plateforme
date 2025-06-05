const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.model')

exports.register = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })

        if (user) {
            res.status(423).send({ message: 'Email exist' })

        } else {
            let new_user = new UserModel(req.body);
            await new_user.save()
            res.status(201).send({ message: 'User registered successfully' });
        }
    }

    catch (err) {
        res.status(420).send(err)
    }
}

exports.login = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(422).send({ message: 'Invalid credentials' })
        }
        
        let comparaison = await bcrypt.compare(req.body.password, user.password)
        if (comparaison) {
            const token = jwt.sign(
                { _id: user._id, email: user.email, role: user.role },
                process.env.SECRETKEY || '123',
                { expiresIn: '24h' }  // Add token expiration
            )

            // Send token separately from user object
            res.send({
                message: "Login successful",
                token,  // Send token at root level
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(423).send({ message: 'Invalid credentials' })
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(422).send({ message: 'Login failed', error: err.message })
    }
}

