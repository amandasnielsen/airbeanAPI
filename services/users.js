// Logiken för att interagera med User-modellen för att skapa ny användare

import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

const usersService = {

	async registerUser(username, password) {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return null; // Username finns redan
		}

		// Generera ett slumpat userId
		const userId = uuidv4();

		const newUser = new User({
			userId,
			username,
			password
		});

		await newUser.save();
		return newUser;
	},

	async findUserByUsername(username) {
		return await User.findOne({ username });
	},

 async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) return null;
    // Kontrollera om lösenordet matchar
    if (user.password !== password) return null;
    return user;
  }



};



export default usersService;