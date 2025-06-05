const authController = require ('./controllers/auth.controller')

module.exports = (server)=>{
    server.post('/register',authController.register)
    server.post('/login',authController.login)
}