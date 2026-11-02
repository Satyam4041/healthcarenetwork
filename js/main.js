// ============================================================
// Business details - change these in one place
// ============================================================
const WHATSAPP_NUMBER = "918887811489"; // country code + number, no "+"

// Tests list: add/remove tests here.
// price: write a number (e.g. 299) to show "₹299", or leave null to show "Call for price".
const TESTS = [
  { name: "CBC (Complete Blood Count)", info: "Hb, WBC, platelets & more", price: null },
  { name: "Thyroid Profile (T3, T4, TSH)", info: "Thyroid function", price: null },
  { name: "Blood Sugar Fasting / PP", info: "Diabetes screening", price: null },
  { name: "HbA1c", info: "3-month average sugar", price: null },
  { name: "Lipid Profile", info: "Cholesterol & triglycerides", price: null },
  { name: "LFT (Liver Function Test)", info: "Liver health", price: null },
  { name: "KFT (Kidney Function Test)", info: "Urea, creatinine & more", price: null },
  { name: "Vitamin D (25-OH)", info: "Bone & immunity", price: null },
  { name: "Vitamin B12", info: "Nerves & energy", price: null },
  { name: "Urine Routine", info: "Urine examination", price: null },
  { name: "Dengue NS1 / IgG / IgM", info: "Fever panel", price: null },
  { name: "Typhoid (Widal)", info: "Fever panel", price: null },
  { name: "Malaria Antigen", info: "Fever panel", price: null },
  { name: "CRP", info: "Infection / inflammation", price: null },
  { name: "Uric Acid", info: "Joint pain / gout", price: null },
  { name: "Iron Studies", info: "Anaemia check", price: null },
  { name: "ESR", info: "Inflammation marker", price: null },
  { name: "Blood Group", info: "ABO & Rh typing", price: null },
];

// Health packages: edit names, test lists and prices here.
// price = offer price, mrp = original price (optional, shown crossed out).
const PACKAGES = [
  {
    name: "Essential Health Checkup",
    price: 1000,
    tests: [
      "Complete Blood Count (CBC)", "ESR", "eGFR", "Liver Function Test with GGT",
      "Kidney Function Test", "Lipid Profile", "Blood Sugar Fasting",
      "Thyroid Profile (T3, T4, TSH)", "Urine Routine",
    ],
  },
  {
    name: "Health Checkup Plus",
    price: 1200,
    tests: [
      "Complete Blood Count with ESR", "Liver Function Test with GGT", "Kidney Function Test",
      "eGFR", "Lipid Profile", "HbA1c (with graph)", "Blood Sugar Fasting",
      "Thyroid Profile (T3, T4, TSH)", "Urine Routine",
    ],
  },
  {
    name: "Super 5 Full Body Checkup",
    featured: true,
    price: 2400,
    mrp: 7170,
    tests: [
      "CBC", "ESR", "Blood Sugar Fasting", "Liver Function Test", "Kidney Function Test",
      "Lipid Profile", "Thyroid Profile", "HbA1c", "Calcium", "Iron Profile",
      "Vitamin B12", "Vitamin D3", "CRP", "RA Factor", "Urine Analysis",
    ],
  },
  {
    name: "Advanced Health Checkup",
    price: 2600,
    tests: [
      "Complete Blood Count with ESR", "Liver Function Test with GGT", "Kidney Function Test",
      "eGFR", "Lipid Profile", "Iron Profile", "Vitamin D", "Vitamin B12",
      "HbA1c (with graph)", "Blood Sugar Fasting", "Thyroid Profile (T3, T4, TSH)", "Urine Routine",
    ],
  },
  {
    name: "Comprehensive Health Checkup",
    price: 3600,
    mrp: 6000,
    tests: [
      "Complete Blood Count (CBC)", "ESR", "Peripheral Smear", "Glucose Fasting", "HbA1c",
      "Liver Function Test (Extended)", "Kidney Function Test", "Lipid Profile", "Thyroid Profile",
      "Iron, Serum", "TIBC", "Transferrin Saturation", "Vitamin D3 (25-Hydroxy)", "Vitamin B12",
      "Arthritis Profile", "Total IgE", "CA-125", "VDRL", "Hepatitis B (HBsAg)",
      "Hepatitis C Antibody (HCV)", "Urine Routine",
    ],
  },
];

// Packages show this many tests first, the rest behind a "show all" button
const PACKAGE_PREVIEW = 9;

// ============================================================
// Helpers
// ============================================================
const $ = (sel) => document.querySelector(sel);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function priceLabel(price) {
  return typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : "Call for price";
}

// Pre-fill the booking form with a test and scroll to it
function bookTest(name) {
  $("#test").value = name;
  $("#book").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#name").focus({ preventScroll: true }), 500);
}

// ============================================================
// Render tests + search
// ============================================================
function renderTests(filter = "") {
  const query = filter.trim().toLowerCase();
  const list = TESTS.filter(
    (t) => !query || t.name.toLowerCase().includes(query) || t.info.toLowerCase().includes(query)
  );

  $("#testGrid").innerHTML = list
    .map(
      (t) => `
      <div class="test">
        <div>
          <h3>${escapeHtml(t.name)}</h3>
          <small>${escapeHtml(t.info)}</small>
        </div>
        <div style="text-align:right">
          <div class="price">${priceLabel(t.price)}</div>
          <a href="#book" class="book-link" data-test="${escapeHtml(t.name)}">Book →</a>
        </div>
      </div>`
    )
    .join("");

  $("#testEmpty").hidden = list.length > 0;
}

// ============================================================
// Render packages
// ============================================================
function renderPackages() {
  $("#packageGrid").innerHTML = PACKAGES.map((p) => {
    // Only shorten long lists (more than 12 tests)
    const extra = p.tests.length > 12 ? p.tests.length - PACKAGE_PREVIEW : 0;
    const items = p.tests
      .map((t, i) => `<li${extra > 0 && i >= PACKAGE_PREVIEW ? " hidden" : ""}>${escapeHtml(t)}</li>`)
      .join("");
    const off = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0;

    return `
    <article class="package${p.featured ? " featured" : ""}">
      ${p.featured ? '<span class="tag">Best value</span>' : ""}
      <h3>${escapeHtml(p.name)}</h3>
      <p class="count">${p.tests.length} tests included</p>
      <ul>${items}</ul>
      ${extra > 0 ? `<button type="button" class="more-btn" aria-expanded="false">+ ${extra} more tests</button>` : ""}
      <div class="price-row">
        <span class="price">${priceLabel(p.price)}</span>
        ${p.mrp ? `<s class="mrp">${priceLabel(p.mrp)}</s><span class="off">${off}% off</span>` : ""}
      </div>
      <a href="#book" class="btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block" data-test="${escapeHtml(p.name)}">Book Now</a>
    </article>`;
  }).join("");

  // "+ N more tests" toggles the hidden part of the list
  document.querySelectorAll(".more-btn").forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.parentElement.querySelectorAll("li").forEach((li, i) => {
        if (i >= PACKAGE_PREVIEW) li.hidden = !open;
      });
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show less" : label;
    });
  });
}

// Suggestions in the booking form's "Test / Package" field
function fillTestSuggestions() {
  const names = [...PACKAGES.map((p) => p.name), ...TESTS.map((t) => t.name)];
  $("#testList").innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">`).join("");
}

// ============================================================
// Booking form -> opens WhatsApp with booking details
// ============================================================
function setupBookingForm() {
  const form = $("#bookForm");
  const error = $("#formError");

  // Don't allow past dates
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("#date").min = today.toISOString().slice(0, 10);

  // Allow only digits in phone field
  $("#phone").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    let message = "";
    if (!data.name.trim()) message = "Please enter your name.";
    else if (!/^[6-9]\d{9}$/.test(data.phone)) message = "Please enter a valid 10-digit mobile number.";
    else if (!data.date) message = "Please choose a date.";
    else if (data.type === "Home collection" && !data.address.trim()) message = "Please enter your address for home collection.";

    if (message) {
      error.textContent = message;
      error.hidden = false;
      return;
    }
    error.hidden = true;

    const lines = [
      "*New Test Booking*",
      `Name: ${data.name.trim()}`,
      `Mobile: ${data.phone}`,
      `Test: ${data.test.trim() || "Not sure – please guide"}`,
      `Date: ${new Date(data.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
      `Slot: ${data.slot}`,
      `Type: ${data.type}`,
    ];
    if (data.address.trim()) lines.push(`Address: ${data.address.trim()}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
}

// ============================================================
// Mobile menu
// ============================================================
function setupMenu() {
  const btn = $("#menuBtn");
  const nav = $("#nav");

  const toggle = (open) => {
    nav.classList.toggle("open", open);
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", () => toggle(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
}

// ============================================================
// Start
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderTests();
  renderPackages();
  fillTestSuggestions();
  setupBookingForm();
  setupMenu();

  $("#testSearch").addEventListener("input", (e) => renderTests(e.target.value));

  // Hero search + "Popular" buttons: show matching tests in the Tests section
  const searchTests = (query) => {
    $("#testSearch").value = query;
    renderTests(query);
    $("#tests").scrollIntoView({ behavior: "smooth" });
  };
  $("#heroSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    searchTests($("#heroQuery").value);
  });
  document.querySelectorAll("[data-search]").forEach((btn) =>
    btn.addEventListener("click", () => searchTests(btn.dataset.search))
  );

  // Any "Book" button on a test or package fills the form
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-test]");
    if (link) {
      e.preventDefault();
      bookTest(link.dataset.test);
    }
  });

  $("#year").textContent = new Date().getFullYear();
});
