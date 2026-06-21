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
        seller: "Emin Məmmədov",
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
        seller: "SumCars Premium",
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
        seller: "Anar Əliyev",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("cars")) {
        localStorage.setItem("cars", JSON.stringify(defaultCars));
    }
    renderFeaturedCars();
});

function renderFeaturedCars() {
    const container = document.getElementById("featured-cars-container");
    if (!container) return;
    const cars = JSON.parse(localStorage.getItem("cars")) || defaultCars;
    
    container.innerHTML = cars.map(car => `
        <div class="car-card glass">
            <div class="car-img-wrapper">
                <img src="${car.image}" alt="${car.brand}">
                <button class="fav-btn">❤</button>
            </div>
            <div class="car-info">
                <h3 style="font-size:18px;">${car.brand} ${car.model}</h3>
                <p style="font-size:13px; color:var(--text-muted);">${car.location}, ${car.year}</p>
                <div class="car-price">${car.price.toLocaleString()} $</div>
                <div class="car-specs">
                    <span>⏱ ${car.mileage.toLocaleString()} km</span>
                    <span>⛽ ${car.fuel}</span>
                </div>
            </div>
        </div>
    `).join('');
}
