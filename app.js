// İnteqrasiya olunmuş Premium Data Sistemi
const defaultCars = [
    {
        id: 1,
        brand: "Porsche",
        model: "911 Turbo S",
        year: 2023,
        price: 245000,
        mileage: 4500,
        fuel: "Benzin",
        location: "Bakı",
        badge: "Yeni",
        seller: "SumCars Premium",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        brand: "Mercedes-Benz",
        model: "G63 AMG",
        year: 2022,
        price: 189000,
        mileage: 12000,
        fuel: "Benzin",
        location: "Bakı",
        badge: "Trend",
        seller: "Emin M.",
        image: "https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        brand: "Audi",
        model: "RS e-tron GT",
        year: 2023,
        price: 135000,
        mileage: 1500,
        fuel: "Elektro",
        location: "Sumqayıt",
        badge: "Eksklüziv",
        seller: "Fərid R.",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("cars")) {
        localStorage.setItem("cars", JSON.stringify(defaultCars));
    }
    if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([]));
    }

    renderFeaturedCars();
    updateFavoriteCount();
});

// HTML Strukturuna və CSS klasslarına tam uyğun kart inject mexanizmi
function renderFeaturedCars() {
    const container = document.getElementById("featured-cars-container");
    if (!container) return;
    
    const cars = JSON.parse(localStorage.getItem("cars")) || defaultCars;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    container.innerHTML = cars.map(car => {
        const isFav = favorites.includes(car.id);
        return `
            <div class="car-card">
                <div class="car-card-media">
                    <span class="car-card-badge">${car.badge}</span>
                    <img src="${car.image}" alt="${car.brand} ${car.model}">
                    <button class="car-card-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite(${car.id})">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <div class="car-card-location-tag">
                        <span>📍 ${car.location}</span>
                    </div>
                </div>
                <div class="car-card-body">
                    <div class="car-card-top">
                        <h3 class="car-card-title">${car.brand}</h3>
                        <span class="car-card-year">${car.year}</span>
                    </div>
                    <p style="font-size: 14px; color: var(--text-dim); margin-bottom: 5px;">${car.model}</p>
                    <div class="car-card-price">${car.price.toLocaleString()} <span>$</span></div>
                    
                    <div class="car-card-specs">
                        <div class="spec-chip">⏱ ${car.mileage.toLocaleString()} km</div>
                        <div class="spec-chip">⛽ ${car.fuel}</div>
                    </div>

                    <div class="car-card-seller">
                        <div class="car-card-seller-name">
                            <div class="mini-avatar">${car.seller.substring(0,2).toUpperCase()}</div>
                            <span>${car.seller}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Seçilmişlər (Qaraj) Mexanizmi
function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFeaturedCars();
    updateFavoriteCount();
}

function updateFavoriteCount() {
    const countBadge = document.getElementById("global-fav-count");
    if (countBadge) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        countBadge.innerText = favorites.length;
    }
}
