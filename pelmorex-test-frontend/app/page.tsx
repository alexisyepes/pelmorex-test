async function getData() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/temperature`,
		{
			cache: "no-store",
		}
	);
	if (!res.ok) {
		console.error("Failed to fetch temperature data");
		return [];
	}
	return res.json();
}

export default async function Home() {
	const weatherData = await getData();

	console.log(weatherData);

	const averageNightTemp = weatherData.data.tenNightsTempAvg;
	const formattedData = weatherData.data.formattedData;

	const renderFormattedData = formattedData.map((day: any) => (
		<div key={day.date}>
			<p>Day: {day.date}</p>
			<p>Night Temperature: {day.dateTemperature}°C</p>
		</div>
	));

	console.log("Average Night Temperature over 10 days:", formattedData);

	console.log(weatherData);

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<h1 className="text-4xl font-bold">
					THE WEATHER APP (Data is coming from: {weatherData.dataSrc})
				</h1>
				<p className="mt-4 text-lg">
					Average Night Temperature over 10 days: {averageNightTemp?.toFixed(1)}
					°C
				</p>
				{weatherData ? renderFormattedData : null}
			</main>
		</div>
	);
}
