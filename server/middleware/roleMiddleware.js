module.exports = roleMiddleWare = (role) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            if (req.user.role !== role) {
                return res.json({message: "You do not have access"})
            }
    
            next()
        } catch (e) {
            res.status(400).json({message: "User is not authorized"})
        }   
    }
}