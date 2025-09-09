const proxyUrl = "https://manface.bloxyhdd.workers.dev/?url=";

const users = [
  { alt: "Timmy", userId: 780878222 },
  { alt: "Ykk",   userId: 591368982 }
];

users.forEach(async ({ alt, userId }) => {
  const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`;

  try {
    const res = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    if (!res.ok) throw new Error(`Proxy/API ${res.status}`);
    const data = await res.json();

    const imageUrl = data?.data?.[0]?.imageUrl;
    if (!imageUrl) throw new Error("No imageUrl in response");

    const img = document.querySelector(`img[alt="${alt}"]`);
    if (img) img.src = imageUrl;
  } catch (err) {
    console.error(`Error loading avatar for ${alt}:`, err);
  }
});
