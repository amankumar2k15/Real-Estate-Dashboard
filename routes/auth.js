const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../utils/Email");
require("dotenv").config()

router.post("/login", async (req, res) => {
	if (req.body.email) {

		await sendEmail({ email: "Thanks for the request", xubject: "Otp is ", message: "otp is " + "" + "" })
		return res.status(200).json({
			error: false,
			message: "Otp sent",
			token: jwt_token,
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}

	try {
		const { phone, password } = req.body;
		// if(!phone || phone.length !=10) return res.status(422).json(validateRes("Phone enter valid phone number "));
		const user = await userModel.findOne({ phone });
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return res.status(400).json(error("Wrong Password Entered", 400));
		const payload = { _id: user._id, isAdmin: user.isAdmin, phone: user.phone };
		console.log(process.env.JWT_SECRET_KEY);
		const jwt_token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);
		console.log(user);
		let userPayload = {
			phone: user.phone,
			token: jwt_token,
		};
		return res.status(200).json(success("Logged in successfully", userPayload, 200));
	}
	catch (err) {
		return res.status(500).json(error(err.message, 500))
	}
});

router.get("/login/success", async (req, res) => {
	if (req.user) {
		let payload = {
			username: req.user.username,
			email: req.user.email,
			role: req.user.role,
			id: req.user._id
		}
		const options = {
			expiresIn: '1d', // Token will expire in one day
		};
		const jwt_token = await jwt.sign(payload, process.env.JWT_KEY, options);
		// res.send(jwt_token)
		return res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			token: jwt_token,
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
