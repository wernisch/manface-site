const baseJsonUrl = "https://raw.githubusercontent.com/wernisch/manface-stats/refs/heads/main/public/games.json";
const jsonUrl = `${baseJsonUrl}?v=${Date.now()}`;

function truncateGameName(name) {
	return name.length > 25 ? name.substring(0, 25) + "..." : name;
}

async function getGamesData() {
	try {
		const res = await fetch(jsonUrl);
		const json = await res.json();
		const games = json.games || [];

		displayGames(games.slice(0, 5));
	} catch (err) {
		console.error("Failed to fetch cached game data:", err);
	}
}

function displayGames(games) {
	const carouselInner = document.getElementById("carouselInner");
	const prevSlide = document.getElementById("prevSlide");
	const nextSlide = document.getElementById("nextSlide");

	if (!carouselInner) {
		console.error("Carousel inner container not found!");
		return;
	}

	carouselInner.innerHTML = "";

	games.forEach((game, index) => {
		const slide = document.createElement("div");
		slide.className = "min-w-full relative";
		slide.setAttribute("data-aos", "fade-up");
		slide.setAttribute("data-aos-delay", `${100 + index * 150}`);

		slide.innerHTML = `
			<img src="${game.icon}" class="w-full h-[450px] object-cover rounded-2xl" alt="${game.name}" />
			<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-5 rounded-b-2xl">
				<h3 class="text-2xl text-white font-bold mb-3">${truncateGameName(game.name)}</h3>
				<div class="flex flex-wrap gap-2 items-center justify-between">
					<div class="flex flex-wrap gap-2">
						<span class="bg-black/60 border border-white/10 px-3 py-1 text-sm text-white rounded-md flex items-center gap-2">
							<span class="w-2 h-2 rounded-full bg-green-400"></span>
							${game.playing.toLocaleString()} Active
						</span>
						<span class="bg-black/60 border border-white/10 px-3 py-1 text-sm text-white rounded-md">
							${game.visits.toLocaleString()} Visits
						</span>
						<span class="bg-black/60 border border-white/10 px-3 py-1 text-sm text-white rounded-md">
							${game.likeRatio}% Rating
						</span>
					</div>
					<a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank"
						class="ml-auto bg-black/60 text-white px-4 py-1.5 text-sm rounded-md hover:bg-gray-900 transition">
						Play
					</a>
				</div>
			</div>
		`;

		carouselInner.appendChild(slide);
	});

	let currentIndex = 0;
	let autoScroll;
	const totalSlides = games.length;

	function updateCarousel() {
		const offset = -currentIndex * 100;
		carouselInner.style.transform = `translateX(${offset}%)`;
	}

	function next() {
		currentIndex = (currentIndex + 1) % totalSlides;
		updateCarousel();
	}

	function prev() {
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
		updateCarousel();
	}

	function startAutoScroll() {
		autoScroll = setInterval(next, 5000);
	}

	function resetAutoScroll() {
		clearInterval(autoScroll);
		startAutoScroll();
	}

	nextSlide?.addEventListener("click", () => {
		next();
		resetAutoScroll();
	});

	prevSlide?.addEventListener("click", () => {
		prev();
		resetAutoScroll();
	});

	updateCarousel();
	startAutoScroll();
}

getGamesData();