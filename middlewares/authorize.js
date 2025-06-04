
export const validateRegistration = (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ success: false, message: 'Username and password are required.' });
	}

	if (username.length < 6) {
		return res.status(400).json({
			success: false,
			message: 'Username must be at least 6 characters long.',
		});
	}

	if (password.length < 6) {
		return res.status(400).json({
			success: false,
			message: 'Password must be at least 6 characters long.',
		});
	}

	next();
};

// ──  Validering för login ────────
export const validateLogin = (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ success: false, message: 'Username and password are required.' });
	}

	if (username.length < 6) {
		return res
			.status(400)
			.json({
				success: false,
				message: 'Username must be at least 6 characters long.',
			});
	}
	if (password.length < 6) {
		return res
			.status(400)
			.json({
				success: false,
				message: 'Password must be at least 6 characters long.',
			});
	}
	next();
};

// ──  Validering(?) för logga ut  ────────

// export const setCurrentUser = async (req, res, next) => {
// 	const userId = req.header('userId');

// 	if (!userId) {
// 		// Ingen userId = användaren är inte inloggad
// 		global.user = null;
// 		return next();
// 	}

// 	try {
// 		// Hämta användaren från databasen
// 		const userDoc = await User.findOne({ id: userId });
// 		if (!userDoc) {
// 			// Om det inte finns någon User med det id:t = nollställer global.user
// 			global.user = null;
// 		} else {
// 			// Annars sätt ett  objekt i global.user
// 			global.user = {
// 				id: userDoc.id,
// 				username: userDoc.username,
// 				role: userDoc.role,
// 			};
// 		}
// 		next();
// 	} catch (err) {
// 		global.user = null;
// 		next();
// 	}
// };
