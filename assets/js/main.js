document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Live Chat
function openChat() {
    document.getElementById('chatBox').classList.toggle('d-none');
}

// Currency Converter (supports USD, EUR, GBP, COP to VES)
async function updateCurrency() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const usdInput = document.getElementById('usdAmount');
        const vesOutput = document.getElementById('vesAmount');
        const currencySelect = document.getElementById('currencySelect');

        if (usdInput && vesOutput && currencySelect) {
            function convert() {
                const amount = parseFloat(usdInput.value) || 0;
                let rate = 1;
                switch (currencySelect.value) {
                    case 'USD':
                        rate = data.rates.VES / data.rates.USD;
                        break;
                    case 'EUR':
                        rate = data.rates.VES / data.rates.EUR;
                        break;
                    case 'GBP':
                        rate = data.rates.VES / data.rates.GBP;
                        break;
                    case 'COP':
                        rate = data.rates.VES / data.rates.COP;
                        break;
                }
                vesOutput.value = (amount * rate).toFixed(2);
            }
            usdInput.addEventListener('input', convert);
            currencySelect.addEventListener('change', convert);
            convert();
        }
    } catch (error) {
        console.error('Currency conversion error:', error);
    }
}
document.addEventListener('DOMContentLoaded', updateCurrency);
const usdInput = document.getElementById('usdAmount');
const currencySelect = document.getElementById('currencySelect');
if (usdInput && currencySelect) {
    function updatePlaceholder() {
        usdInput.placeholder = `Amount (${currencySelect.value})`;
    }
    currencySelect.addEventListener('change', updatePlaceholder);
    updatePlaceholder();
}

// Initialize Map
function initMap() {
    if (document.getElementById('venezuelaMap')) {
        const map = L.map('venezuelaMap').setView([8.0000, -66.0000], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Add markers for key locations
        const locations = [
            { name: 'Angel Falls', coords: [5.9675, -62.5356] },
            { name: 'Caracas', coords: [10.4806, -66.9036] },
            { name: 'Margarita Island', coords: [10.9972, -63.9113] },
            { name: 'Morrocoy National Park', coords: [10.8592, -68.2526] },
            { name: 'Canaima National Park', coords: [6.2406, -62.8536] },
            { name: 'Medanos de Coro', coords: [11.4194, -69.6736] },
            { name: 'Lake Maracaibo', coords: [9.803, -71.556] },
            { name: 'Merida', coords: [8.5897, -71.1561] }
        ];

        locations.forEach(loc => {
            L.marker(loc.coords)
                .addTo(map)
                .bindPopup(loc.name);
        });
    }
}
document.addEventListener('DOMContentLoaded', initMap);

// Form handling
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Hide the form
    this.classList.add('d-none');
    // Show the success message
    document.getElementById('bookingSuccessMsg').classList.remove('d-none');
    // Optionally, close the modal after a delay:
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        modal?.hide();
        // Reset form and message for next time
        this.reset();
        this.classList.remove('d-none');
        document.getElementById('bookingSuccessMsg').classList.add('d-none');
    }, 2000);
});

// Booking modals
document.querySelectorAll('.btn-primary, .btn-success, .btn-warning, .btn-danger').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const packageName = this.closest('.card').querySelector('.card-title').textContent;
        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        document.getElementById('modalPackageTitle').textContent = packageName;
        modal.show();
    });
});

// Testimonial carousel
const testimonialCarousel = new bootstrap.Carousel('#testimonialsCarousel', {
    interval: 5000,
    wrap: true
});

// Lazy loading
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
}, { rootMargin: '200px' });

lazyImages.forEach(img => {
    if (!img.complete) {
        img.dataset.src = img.src;
        img.src = 'assets/images/placeholder.jpg';
        observer.observe(img);
    }
});

// Cookie consent
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieBanner').classList.add('d-none');
}

if (!localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookieBanner')?.classList.remove('d-none');
}

// Scroll animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeInUp');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    element.classList.add('animate__animated');
    animationObserver.observe(element);
});

