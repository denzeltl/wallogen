# Product Requirements Document (PRD) — Wallogen

## 1. Product Overview & Vision
**Wallogen** is a modern, minimalist wallpaper generator designed to produce high-resolution, aesthetically refined wallpapers for any display—ranging from 8K desktop setups to mobile lock screens and tablets. 

Inspired by clean, minimalist design principles (e.g., WLLPR), Wallogen offers instant, zero-clutter wallpaper generation directly in the browser with no sign-up or account required. Alongside the generation application, Wallogen includes a high-converting landing page showcasing features, interactive previews, an FAQ section, and a "Buy Me a Coffee" creator support link.

---

## 2. Target Audience & Core Use Cases
* **Designers & Creatives:** Seeking minimalist, clean backgrounds for desktop workstations, mockup presentations, and portfolio assets.
* **Tech & Workspace Enthusiasts:** Looking for high-DPI (4K/8K/Retina) wallpapers that match light/dark desktop themes.
* **Mobile Power Users:** Customizing home screens and lock screens on iPhone and Android devices with high-density displays.
* **Casual Browsers:** Users wanting quick, effortless custom backgrounds without downloading bulky software or navigating ad-heavy wallpaper sites.

---

## 3. Key Features & Functional Requirements

### 3.1. Wallpaper Generation Engine
* **Curated Pattern Library:**
  * **Waves:** Smooth mathematical wave vectors with adjustable frequency, amplitude, and phase offset.
  * **Gradients:** Multi-stop linear, radial, and conic mesh gradients with customizable blur and direction.
  * **Mesh Gradients:** Dynamic color blobs with soft gaussian blending.
  * **Geometric Arcs & Hills:** Overlapping curves, minimal mountain ranges, and architectural arc patterns.
  * **Abstract Topography:** Contour maps and line art vectors.
  * **Grain / Noise Overlays:** Adjustable film grain, procedural paper texture, and noise intensity for depth.
* **Color Palette System:**
  * Curated aesthetic light & dark mode presets (Nord, Gruvbox, Cyberpunk, Pastel, Monochrome, Sunset, Forest, Tokyo Night).
  * Random palette generator ("Shuffle" button).
  * Custom hex color picker for primary, secondary, accent, and background tones.
  * Instant Dark / Light mode toggle per pattern.
* **Device Target & Resolution Presets:**
  * **Desktop 4K UHD:** `3840 × 2160` (16:9)
  * **Desktop Ultrawide:** `3440 × 1440` (21:9)
  * **Desktop 8K UHD:** `7680 × 4320` (16:9)
  * **Mobile iPhone:** `1290 × 2796` (19.5:9)
  * **Mobile Android:** `1080 × 2400` (20:9)
  * **Tablet / iPad:** `2048 × 2732` (4:3)
  * **Custom Aspect Ratio & Dimensions:** User-defined width and height.
* **Real-Time Interactive Preview:**
  * Responsive 2D HTML5 canvas renderer with sub-millisecond updates on slider adjustment.
  * Preview modes: Device frame mockups (Desktop, Mobile, Tablet) or borderless raw preview.
  * Random Seed trigger to generate infinite variations of the current pattern.
* **High-Resolution Export Engine:**
  * One-click export to PNG / JPEG format rendered offscreen at native target resolution (up to 8K) without pixelation or quality loss.
  * SVG vector export option for applicable geometric patterns.
* **Describe a Wallpaper (AI):**
  * Prompt bar where users describe a mood or scene; Google Gemini (free tier) picks the pattern, palette and parameters, rendered locally at full resolution.
  * Example prompt chips, "New variation" (local reseed), "Reinterpret" (new AI call), and Undo.
  * Respects locked sliders.
  * When the free AI quota is used up or the AI is unavailable, shows a soft, friendly notice and produces an on-device keyword-based close match, so the button always returns a wallpaper.

### 3.2. Landing Page & Marketing Experience
* **Hero Section:**
  * Engaging tagline, call-to-action buttons ("Start Generating", "View Features"), and a live interactive mini-canvas preview.
  * Supported system badges (macOS, Windows, iOS, Android, Linux).
* **Interactive Feature Showcase:**
  * Visual cards detailing 4K/8K Desktop support, Mobile readiness, Light & Dark mode variants, and Pattern variety.
* **Pattern Gallery / Showcase:**
  * Grid of preset wallpapers generated dynamically to demonstrate visual quality.
* **FAQ Section:**
  * Accordion covering pricing (100% Free), data privacy (Zero data collection, client-side only), image resolution, and commercial usage permissions.
* **Buy Me a Coffee Integration:**
  * Non-intrusive support section with a direct link to Buy Me a Coffee / Ko-fi.
  * Floating widget / footer support badge.

---

## 4. Non-Functional Requirements
* **Performance:** Real-time canvas render updates under 50ms during parameter tweaks. Offscreen export completed under 1.5 seconds for 4K resolutions.
* **Privacy & Security:** 100% client-side generation. No images or telemetry are transmitted. The only exception is the optional AI prompt bar, which sends the text prompt (≤200 chars) to Google Gemini and discloses this in the UI and FAQ.
* **Responsiveness:** Flawless layout adaptivity across desktop monitors, laptops, tablets, and smartphones.
* **Accessibility (a11y):** Keyboard navigation support, aria-labels for interactive sliders, and high contrast UI controls.
* **SEO & Metadata:** OpenGraph images, Twitter cards, meta descriptions, and structured data for high search engine visibility.

---

## 5. Success Metrics
* High page conversion rate from Landing Page to Generator App.
* Sub-1s initial page load time (LCP < 1.2s, CLS < 0.05).
* 100% browser compatibility across modern Chrome, Firefox, Safari, and Edge (Desktop & Mobile).

---

## 6. Future Roadmap (Post-MVP)
* **Custom SVG Uploads:** Mask procedural noise over user-uploaded vectors.
* **Animated / Live Wallpapers:** Export MP4 / WebM dynamic wallpaper loops.
* **Palette Extractor:** Generate color palettes from user-uploaded photos.
* **Community Gallery:** Share and discover user-created wallpaper configurations.
