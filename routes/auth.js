const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken')
require("dotenv").config()

router.get("/login/success", async (req, res) => {
	if (req.user) {
		let payload = {
			username: req.user.username,
			role: req.user.role,
			id: req.user._id
		}
		const options = {
			expiresIn: '1d', // Token will expire in one day
		};
		const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
		console.log("req accepted-----------------------------------------", req.user)
		// res.send(jwt_token)
		return res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			token : jwt_token,
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
	return 
});

module.exports = router;
