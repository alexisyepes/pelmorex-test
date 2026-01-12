const express = require("express");
const cache = require("../middlewares/cache");
const client = require("../lib/redis/client");
const router = express.Router();

const { format, parseISO } = require("date-fns");

const FIVE_MINUTES = 350; // in seconds

router.get("/temperature", cache("temperature"), async (req, res) => {
	try {
		const response = await fetch("https://wxdata.apdtest.net/api/getweather");
		const data = await response.json();

		const sevenDaysData = data.longterm.slice(0, 7);
		const tenDaysData = data.longterm.slice(0, 10);

		const formattedData = sevenDaysData.map((day) => {
			// The input date string
			const dateString = day.time.local;

			// Create a Date object from the ISO string
			const dateObject = parseISO(dateString); // or new Date(dateString)

			// Format the date to get the day name (EEEE = full day name)
			const dayName = format(dateObject, "EEEE");

			return {
				date: dayName, // Full day name
				dateTemperature: day.day.temperature.value,
			};
		});

		const nightTemperatures = tenDaysData.map(
			(day) => day.night.temperature.value
		);

		const averageNightTemp =
			nightTemperatures.reduce((sum, temp) => sum + temp, 0) /
			nightTemperatures.length;

		const dataToCache = {
			tenNightsTempAvg: averageNightTemp,
			formattedData,
		};

		await client.setEx(
			"temperature",
			FIVE_MINUTES,
			JSON.stringify(dataToCache)
		); // Cache for 5 minutes

		res.json({
			dataSrc: "Source",
			data: {
				tenNightsTempAvg: averageNightTemp,
				formattedData,
			},
		});
	} catch (error) {
		console.error("Error fetching temperature data:", error);
		res.status(500).json({ error: "Failed to fetch temperature data" });
	}
});

module.exports = router;
