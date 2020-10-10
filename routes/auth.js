const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = Router();

router.get("/user", (req, res) => {
  if (req.user) {
    res.json(extractUser(req));
  } else {
    res.json({ user: null });
  }
});
router.post(
  "/signup",
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      await User.register({ username }, password);
    } catch (error) {
      if (error.name === "UserExistsError") {
        return res.status(400).json({ message: error});
      }
      return res
        .status(500)
        .json({ message: "There was an error when signing up the user" });
    }
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    res.json(extractUser(req));
  }
);
router.post('/logout',(req,res) => {
    if (req.user) {
        req.logOut()
        res.json({
            message : 'Logged Out'
        })
    }else{
        res.send({message : 'No user to logged out'})
    }
})
router.post('/login',passport.authenticate('local'),(req,res) => {
    res.json(extractUser(req))
})
router.post('/update-password',(req,res,next) => {
    if (!req.user) {
        return res.json({
            message : 'No User to Change password'
        })
    }
    next()
}, async (req,res) => {
    const {oldPassword,newPassword} = req.body
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message : 'Invalid Request'})
    }
    try {
        const user = await User.findById(req.user._id)
        await user.changePassword(oldPassword,newPassword)
        return res.json({
            message : 'success'
        })
    } catch (error) {
        if (error.name === 'IncorrectPasswordError') {
            return res.status(400).json({message : error.message})
        }
        return res.status(500).json({message : 'There was an error '})
    }
})
function extractUser(req) {
    const {username,_id} = req.user
    return {user : {username,_id}}
}
module.exports = router;
