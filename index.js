const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const client = require("./lib/redis/client");
const temperatureRouter = require("./routes/temperature");

app.use(express.json());
app.use("/api", temperatureRouter);

(async () => {
	try {
		await client.connect();
		console.log("Connected to Redis");
	} catch (error) {
		console.log("Cannot Connect to Redis");
	}
})();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
