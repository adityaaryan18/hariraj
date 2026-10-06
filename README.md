# Hariraj — The Veg Restaurant (website)

A fast, fully static website. No build step, no server, no database.
Everything that goes online is inside the **`docs/`** folder.

```
docs/
├── index.html            ← the page
├── 404.html              ← "page not found" page
├── assets/
│   ├── css/style.css
│   ├── js/config.js      ← ✏️ phone, WhatsApp, address, hours, form settings
│   ├── js/menu-data.js   ← ✏️ all dishes & prices
│   ├── js/main.js
│   └── img/              ← optimised photos (WebP)
├── .nojekyll, _headers, robots.txt, site.webmanifest
```

The original photos in `Food/`, `Menu/` and `Restraunt pics/` are **not** uploaded
(`.gitignore` skips them). The site uses the optimised copies in `docs/assets/img/`.

---

## 1. Publish on GitHub Pages (free) → get a shareable link

Your link will be: **`https://<your-github-username>.github.io/hariraj/`**

### Step A — Create the repository
1. Log in at **https://github.com** → click **+** (top right) → **New repository**.
2. Repository name: **`hariraj`**
3. Choose **Public** (free GitHub Pages needs a public repo).
4. Do **not** tick "Add a README". Click **Create repository**.

### Step B — Upload the code (pick ONE way)

**Way 1: command line** (this folder is already a git repository with everything committed):
```bash
git remote add origin https://github.com/adityaaryan18/hariraj.git
git push -u origin main
```
(Replace `adityaaryan18` with your GitHub username if it's different. On first push,
a browser window opens to log in to GitHub.)

**Way 2: GitHub Desktop** (no commands): File → Add local repository → choose this
folder → **Publish repository** (untick "Keep this code private").

**Way 3: in the browser**: on the new empty repo page click **"uploading an existing file"**,
then drag in the **`docs`** folder, `README.md`, `.gitignore` and `netlify.toml` → **Commit changes**.

### Step C — Turn on GitHub Pages
1. In the repo: **Settings → Pages**.
2. **Source:** "Deploy from a branch".
3. **Branch:** `main`, folder: **`/docs`** → **Save**.
4. Wait 1–2 minutes and refresh. The page shows **"Your site is live at …"**. That's your link to share.

Every later `git push` (or upload) updates the live site automatically within a minute or two.

### Step D — Make the WhatsApp/Facebook link preview show the restaurant photo
`docs/index.html` (near the top) contains these two lines:
```html
<meta property="og:url" content="https://adityaaryan18.github.io/hariraj/" />
<meta property="og:image" content="https://adityaaryan18.github.io/hariraj/assets/img/og-image.jpg" />
```
If your username or repo name is different, change them to your real link.

---

## 2. Make reservations reach you (important on GitHub Pages)

GitHub Pages only serves pages. It can't receive form submissions. Pick one or both:

**a) WhatsApp (easiest):** in `docs/assets/js/config.js` set
`whatsapp: "91XXXXXXXXXX"` (country code + number, digits only).
After booking, the guest gets a **Confirm on WhatsApp** button with all details pre-filled.

**b) Email for every booking (free, 2 minutes):**
1. Sign up at **https://formspree.io** → **New form** → copy the endpoint, like `https://formspree.io/f/abcdwxyz`.
2. Paste it into `docs/assets/js/config.js` → `formEndpoint: "https://formspree.io/f/abcdwxyz"`.
3. Push / upload again. Bookings now arrive in your email inbox and the Formspree dashboard.

Without either, guests still get a booking ticket and are asked to **call** to confirm, so no booking is lost silently.

---

## 3. Use your own domain (optional)
Buy a domain (e.g. hariraj.in) → repo **Settings → Pages → Custom domain** → follow
GitHub's DNS instructions → tick **Enforce HTTPS**. Then update the two `og:` lines above.

## 4. Alternative host: Netlify
Drag the `docs` folder onto **https://app.netlify.com/drop**. On Netlify, the booking form works
without Formspree: enable **Forms → form detection** and add an email notification.
`netlify.toml` is already set up.

---

## 5. Settings — `docs/assets/js/config.js`

| Setting | What it does |
|---|---|
| `phone`, `phoneDisplay`, `phone2` | Every "Call" button on the site |
| `whatsapp` | Adds **Confirm on WhatsApp** with the booking pre-filled. **Strongly recommended.** |
| `formEndpoint` | Formspree/Web3Forms link so bookings are emailed to you |
| `address`, `mapsQuery` | Footer, "Find us" section, map and directions |
| `openHour`, `closeHour` | Live "Open now / Closed" badge and the bookable time slots |
| `email`, `instagram`, `facebook` | Shown in the footer when filled in |

## 6. Changing the menu — `docs/assets/js/menu-data.js`
Each dish is one line: `["Masala Dosa", 120],`. Edit and save. The page-turning book re-arranges itself.
After any edit, bump the `?v=3` numbers at the bottom of `index.html` (e.g. to `?v=4`) so visitors
get the new version, then push/upload again.

## 7. Preview on your computer
```bash
python -m http.server 5173 --directory docs
```
Then open http://localhost:5173

## Please double-check
- **Prices** were typed from photos of the printed menu. Please verify unclear ones (e.g. Roomali Roti ₹120, Paneer Paratha ₹150).
- **PIN code** 490006 for Civic Centre, Bhilai.
- The **WhatsApp number** and **Formspree link** are empty until you add them.
