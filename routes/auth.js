import express from 'express';
import usersService from '../services/users.js';
import { validateRegistration,validateLogin } from '../middlewares/authorize.js';

const authRouter = express.Router();
    
// ──  Registrera användare ────────
authRouter.post('/register', validateRegistration, async (req, res) => {
	const { username, password } = req.body;

    try {
        const newUser = await usersService.registerUser(username, password);

        if (!newUser) {
            return res.status(409).json({ success: false, message: 'Username already exists.' });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: {
                userId: newUser.userId,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// ──  Logga in ────────
authRouter.post('/login', validateLogin, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usersService.loginUser(username, password);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        };
        // spara användaren i global user, så man stannar inloggad
        global.user = {
        userId: user.userId,
        username: user.username,
        role: user.role
      };
  return res.status(200).json({
        success: true,
        message: 'Login successful!',
        user: {
          userId: user.userId,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Error during user login:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }});
    
    // ──  Logga ut ────────

authRouter.get('/logout', (req, res) => {
  // Nollställ global.user för att “logga ut” användaren 
  global.user = null;

  return res.status(200).json({
    success: true,
    message: 'Logout successful.',
  });
});

export default authRouter;