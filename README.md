# My Agent 🏡

**My Agent** is a modern, responsive real estate web application that enables users to manage and explore houses and apartments available for rent or sale. Built entirely with Vanilla HTML, CSS, and JavaScript, the app persists all listing data in the browser using `localStorage`.

---

## ✨ Features

- **📊 Property Statistics Dashboard**: Live overview tracking Total Properties, For Rent, For Sale, and Available listings.
- **➕ Add New Properties**: Comprehensive form supporting Property Title, Type (*Apartment, Detached House, Duplex, Bungalow, Other*), Listing Type (*For Rent / For Sale*), Bedrooms, Bathrooms, Location, Price (in ₦ Nigerian Naira), Description, Availability, and Photo.
- **🖼️ Client-Side Image Compression**: Utilizes HTML5 Canvas to automatically resize and compress uploaded photos (~40–60KB), preventing `localStorage` quota overflow while maintaining high visual clarity. Includes quick sample presets.
- **👁️ View Property Details**: Click any card to open a full modal showcase displaying high-res photos, detailed specifications, full description, and quick actions.
- **✏️ Edit Existing Properties**: Easily update price, title, features, description, or availability. Form automatically pre-fills with existing property information.
- **🗑️ Delete with Confirmation**: Safe deletion workflow requiring explicit confirmation before permanent removal.
- **🔍 Search & Multi-Criteria Filters**:
  - Instant search across property titles, neighbourhoods, and cities.
  - Multi-filtering by Property Type, Listing Type, Bedrooms, Price Range (Min/Max), and Availability.
  - Sorting by Newest, Price (Low to High / High to Low), and Bedroom count.
  - One-click filter reset button.
- **🌓 Dark & Light Theme**: Seamlessly toggle between dark and light modes with saved theme preference.
- **📱 Fully Responsive**: Fluid layout optimized for mobile smartphones, tablets, and desktop displays.
- **💾 100% Client-Side Persistence**: Retains all changes and listings across browser reloads without requiring any server, database, or external setup.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document structure, native `<dialog>` modals, and accessible markup.
- **Vanilla CSS**: Custom design system, CSS Grid & Flexbox, modern variables, glassmorphism, and micro-animations.
- **Vanilla JavaScript (ES6+)**: Reactive state management, DOM manipulation, HTML5 Canvas image optimization, and `localStorage` persistence.

---

## 📂 Project Structure

```text
hero/
├── index.html        # Main HTML layout, modals, search/filters, and cards grid
├── style.css         # Design system tokens, light/dark themes, responsive CSS
├── script.js         # Core application logic, validation, compression, and CRUD
├── assets/
│   └── images/       # High-resolution property imagery
├── .gitignore        # Git ignore file
└── README.md         # Documentation
```

---

## 🚀 Getting Started

No dependencies, build tools, or packages to install!

1. Clone the repository:
   ```bash
   git clone https://github.com/Wisdombalor/my-agent.git
   ```
2. Navigate into the project folder:
   ```bash
   cd my-agent
   ```
3. Open `index.html` directly in your browser:
   - Double-click `index.html`, OR
   - Serve using a local server:
     ```bash
     python3 -m http.server 3000
     ```
     Then navigate to `http://localhost:3000` in your web browser.

---

## 👤 Author

**Wisdom Balor**
- GitHub: [@Wisdombalor](https://github.com/Wisdombalor)

## Landing page and workspace

The home page (`index.html`) introduces My Agent with an animated property-photo mosaic. Use **Explore properties** or **Open workspace** to enter `workspace.html`. The workspace brand links back home.

`landing.css` and `landing.js` handle the responsive introduction and photo rotation. Each photo opens its matching listing. Photos hold still while hovered or keyboard-focused; reduced-motion preferences start with static photos. The workspace retains the existing browser-storage listing management.

See `DESIGN_DECISIONS.md`, `DESIGN_REVIEW.md`, and `DESIGN_SKILL_COVERAGE.md` for scope and verification evidence.
