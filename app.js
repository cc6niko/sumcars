// --- INITIAL DEMO DATA ---
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
        phone: "+994 (50) 123-4567",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
        desc: "Tam ideal vəziyyətdədir. Rəsmi dilerdən alınıb. Yalnız qaraj şəraitində saxlanılıb."
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
        phone: "+994 (12) 444-0099",
        image: "https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=800&q=80",
        desc: "Buraxılış ili 2022. Full komplektasiya. Heç bir xərc tələb etmir."
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
        phone: "+994 (77) 700-1122",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
        desc: "Elektrikli lüks canavar. Bir şarjla 480 km məsafə qət edir."
    }
];

// --- APP INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("cars")) {
        localStorage.setItem("cars", JSON.stringify(defaultCars));
    }
    if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([]));
    }

    initNavbar();
    setupMobileMenu();
    
    // Page specific triggers
    const path = window.location.pathname;
    if (path.includes("index.html") || path === "/") {
        renderFeaturedCars();
        setupSearchForm();
    } else if (path.includes("cars.html")) {
        renderAllCars();
        setupAdvancedSearch();
    } else if (path.includes("car-details.html")) {
        renderCarDetails();
    } else if (path.includes("add-car.html")) {
        setupAddCarForm();
    } else if (path.includes("favorites.html")) {
        renderFavorites();
    } else if (path.includes("profile.html")) {
        renderProfile();
    } else if (path.includes("login.html") || path.includes("register.html")) {
        setupAuth();
    }
});

// --- NAVIGATION & UI EFFECTS ---
function initNavbar() {
    const nav = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
    });
    updateAuthButtons();
}

function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");
    if(toggle) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("active");
        });
    }
}

function updateAuthButtons() {
    const authArea = document.getElementById("auth-area");
    if (!authArea) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        authArea.innerHTML = `
            <a href="profile.html" class="btn-nav btn-login">${user.name}</a>
            <a href="#" id="logout-btn" class="btn-nav btn-premium">Çıxış</a>
        `;
        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.reload();
        });
    }
}

// --- DATA RENDERING ARCHITECTURE ---
function getCarCardHtml(car, isFav) {
    return `
        <div class="car-card glass">
            <div class="car-img-wrapper">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${car.id})">
                    ❤
                </button>
            </div>
            <div class="car-info">
                <div class="car-header">
                    <div class="car-title">
                        <h3>${car.brand} ${car.model}</h3>
                        <p>${car.location}, ${car.year}</p>
                    </div>
                    <div class="car-price">${car.price.toLocaleString()} $</div>
                </div>
                <div class="car-specs">
                    <span>⏱ ${car.mileage.toLocaleString()} km</span>
                    <span>⛽ ${car.fuel}</span>
                    <span>👤 ${car.seller.split(' ')[0]}</span>
                </div>
                <div class="car-footer">
                    <a href="car-details.html?id=${car.id}" class="view-details">Ətraflı bax →</a>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedCars() {
    const container = document.getElementById("featured-cars-container");
    if (!container) return;
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    
    container.innerHTML = cars.slice(0, 3).map(car => {
        return getCarCardHtml(car, favs.includes(car.id));
    }).join('');
}

function renderAllCars(filteredCars = null) {
    const container = document.getElementById("all-cars-container");
    if (!container) return;
    const cars = filteredCars || JSON.parse(localStorage.getItem("cars")) || [];
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if (cars.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">Axtarışa uyğun avtomobil tapılmadı.</p>`;
        return;
    }
    container.innerHTML = cars.map(car => getCarCardHtml(car, favs.includes(car.id))).join('');
}

// --- FAVORITES MANAGEMENT ---
window.toggleFavorite = function(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
    
    const btn = event.currentTarget;
    btn.classList.toggle("active");
    
    // Auto-refresh if on favorites page
    if(window.location.pathname.includes("favorites.html")) {
        renderFavorites();
    }
};

function renderFavorites() {
    const container = document.getElementById("favorites-container");
    if (!container) return;
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const favCars = cars.filter(c => favs.includes(c.id));
    
    if(favCars.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); width:100%;">Seçilmiş avtomobil yoxdur.</p>`;
        return;
    }
    container.innerHTML = favCars.map(car => getCarCardHtml(car, true)).join('');
}

// --- ADVANCED SEARCH SYSTEMS ---
function setupSearchForm() {
    const form = document.getElementById("home-search-form");
    if(!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const brand = document.getElementById("search-brand").value;
        window.location.href = `cars.html?brand=${encodeURIComponent(brand)}`;
    });
}

function setupAdvancedSearch() {
    const params = new URLSearchParams(window.location.search);
    const initialBrand = params.get("brand");
    if(initialBrand) {
        document.getElementById("filter-brand").value = initialBrand;
        filterCars();
    }

    const filters = ['filter-brand', 'filter-fuel', 'filter-price'];
    filters.forEach(id => {
        document.getElementById(id).addEventListener("change", filterCars);
    });
}

function filterCars() {
    const brand = document.getElementById("filter-brand").value;
    const fuel = document.getElementById("filter-fuel").value;
    const priceLimit = document.getElementById("filter-price").value;
    
    let cars = JSON.parse(localStorage.getItem("cars")) || [];
    
    if(brand) cars = cars.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
    if(fuel) cars = cars.filter(c => c.fuel === fuel);
    if(priceLimit) cars = cars.filter(c => c.price <= parseInt(priceLimit));
    
    renderAllCars(cars);
}

// --- DETAIL VIEW LOGIC ---
function renderCarDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const car = cars.find(c => c.id === id);
    
    if(!car) {
        document.getElementById("details-root").innerHTML = "<h2>Avtomobil tapılmadı</h2>";
        return;
    }
    
    document.getElementById("detail-img").src = car.image;
    document.getElementById("detail-title").innerText = `${car.brand} ${car.model}`;
    document.getElementById("detail-price").innerText = `${car.price.toLocaleString()} $`;
    document.getElementById("detail-desc").innerText = car.desc;
    document.getElementById("seller-name").innerText = car.seller;
    document.getElementById("seller-phone").innerText = car.phone;
    
    const specsRoot = document.getElementById("detail-specs");
    const specs = [
        { name: "İl", value: car.year },
        { name: "Yürüş", value: `${car.mileage.toLocaleString()} km` },
        { name: "Yanacaq", value: car.fuel },
        { name: "Şəhər", value: car.location }
    ];
    
    specsRoot.innerHTML = specs.map(s => `
        <div class="spec-item glass">
            <span>${s.name}</span>
            <strong>${s.value}</strong>
        </div>
    `).join('');
}

// --- ADD VEHICLE PROCESSOR ---
function setupAddCarForm() {
    const form = document.getElementById("add-car-form");
    if(!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if(!user) {
            alert("Elan yerləşdirmək üçün giriş etməlisiniz!");
            window.location.href = "login.html";
            return;
        }
        
        const cars = JSON.parse(localStorage.getItem("cars")) || [];
        const newCar = {
            id: Date.now(),
            brand: document.getElementById("car-brand").value,
            model: document.getElementById("car-model").value,
            year: parseInt(document.getElementById("car-year").value),
            price: parseInt(document.getElementById("car-price").value),
            mileage: parseInt(document.getElementById("car-mileage").value),
            fuel: document.getElementById("car-fuel").value,
            location: document.getElementById("car-location").value,
            desc: document.getElementById("car-desc").value,
            seller: user.name,
            phone: user.phone || "+994 (50) 777-7777",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80" // Standart lüks placeholder
        };
        
        cars.push(newCar);
        localStorage.setItem("cars", JSON.stringify(cars));
        alert("Elanınız uğurla yerləşdirildi!");
        window.location.href = "cars.html";
    });
}

// --- PROFILE LOADER ---
function renderProfile() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user) {
        window.location.href = "login.html";
        return;
    }
    document.getElementById("profile-name").innerText = user.name;
    document.getElementById("profile-email").innerText = user.email;
    
    // Render only user's active posts
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const myCars = cars.filter(c => c.seller === user.name);
    const container = document.getElementById("my-cars-container");
    
    if(myCars.length === 0) {
        container.innerHTML = "<p style='color:var(--text-muted);'>Hələ elan yerləşdirməmisiniz.</p>";
        return;
    }
    container.innerHTML = myCars.map(car => getCarCardHtml(car, false)).join('');
}

// --- AUTHENTICATION FLOWS ---
function setupAuth() {
    const loginForm = document.getElementById("login-form");
    const regForm = document.getElementById("register-form");
    
    if(loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.email === email);
            
            if(user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                window.location.href = "index.html";
            } else {
                alert("İstifadəçi tapılmadı və ya şifrə yanlışdır!");
            }
        });
    }
    
    if(regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if(users.some(u => u.email === email)) {
                alert("Bu e-poçt artıq qeydiyyatdan keçib!");
                return;
            }
            
            const newUser = { name, email, phone: "+994 (50) 999-9999" };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            
            alert("Qeydiyyat uğurla tamamlandı!");
            window.location.href = "index.html";
        });
    }
}
