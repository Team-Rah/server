const login = async(req, res) => {

    const user = {
        id:"1234",
        name:"david"
    }

    let jwtToken = await jwt.sign(user, 'mysecret', {expiresIn: 360000});
    res.json({jwtToken})
}

const user = async(req, res) => {
    const finduser = await User.findId(req.user)
    finduser.password = 'newpasword'
    finduser.save()
    res.status(200).json({
        message: "your pasword has been changed"
    })
}

const authenticateToken = async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token)
        if (!token) {
            return res.status(403).json({message: 'you need a token'})
        }
        jwt.verify(token,'mysecret', (err, user) => {
            if (err) {
              return res.sendStatus(403);
            }
            req.user = user.id
            next()
      })
    }
    catch (err) {
        res.status(500).json({err})
    }

}

app.get('/login', login)
app.post('/', authenticateToken , user)
app.post('/creatgamne' ,authenticateToken, (req,res) => {
    const user = req.user
})