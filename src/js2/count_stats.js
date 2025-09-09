import { CountUp } from "./countup.js";

const baseJsonUrl = "https://raw.githubusercontent.com/wernisch/manface-stats/refs/heads/main/public/games.json";
const jsonUrl = `${baseJsonUrl}?v=${Date.now()}`;

let playerCountDisplay, visitsCountDisplay, gamesCreatedDisplay, averageRatingDisplay;

function initializeCountUp(gamesCreated) {
	playerCountDisplay = new CountUp("player-count", 0, {
		duration: 2,
		separator: ","
	});
	visitsCountDisplay = new CountUp("visits-count", 0, {
		duration: 2,
		separator: ","
	});
	gamesCreatedDisplay = new CountUp("games-created", 0, {
		duration: 2,
		separator: ",",
		suffix: "+"
	});
	averageRatingDisplay = new CountUp("average-rating", 0, {
		duration: 1,
		decimalPlaces: 0,
		suffix: "%"
	});

	playerCountDisplay.start();
	visitsCountDisplay.start();
	gamesCreatedDisplay.start();
	averageRatingDisplay.start();

	gamesCreatedDisplay.update(gamesCreated);
}

function updateCountDisplays(playerCount, visitsCount, avgRating) {
	playerCountDisplay.update(playerCount);
	visitsCountDisplay.update(visitsCount);
	averageRatingDisplay.update(avgRating);
}

async function loadGameStats() {
	try {
		const response = await fetch(jsonUrl);
		if (!response.ok) throw new Error("Failed to fetch game stats");

		const data = await response.json();
		const games = data.games || [];

		const totalPlayers = games.reduce((sum, game) => sum + (game.playing || 0), 0);
		const totalVisits = games.reduce((sum, game) => sum + (game.visits || 0), 0);

		const validRatings = games.filter(g => g.likeRatio >= 0);
		const averageRating = validRatings.length
			? Math.round(validRatings.reduce((sum, g) => sum + g.likeRatio, 0) / validRatings.length)
			: 0;

		initializeCountUp(games.length);
		updateCountDisplays(totalPlayers, totalVisits, averageRating);
	} catch (error) {
		console.error("Error loading game stats:", error);
	}
}

loadGameStats();