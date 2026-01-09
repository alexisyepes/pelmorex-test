const redisClient = require("../lib/redis/client");

const cache = (key) => {
	return async (req, res, next) => {
		try {
			const data = await redisClient.get(key);
			if (data !== null) {
				console.log("Cached data found for key:", key);
				return res.json({ dataSrc: "Cache", data: JSON.parse(data) });
			}
			console.log("No cached data for key:", key);
			next();
		} catch (error) {
			next();
			console.log(error);
		}
	};
};

module.exports = cache;
