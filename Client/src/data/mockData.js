export const COMPANY_INFO = {
  name: "ANR HOSPITAL GARMENTS",
  contactPersons: ["Mr. Manjunath Rao G", "Mr. Balraj. V"],
  phones: ["9986044574", "6363429113"],
  email: "anr20072010@gmail.com",
  address: "N0:1205, 12th Cross, 2nd Phase, 1st Stage, Banashankari, Girinagar, Bangalore-560085",
  city: "Bangalore",
  pincode: "560085",
  state: "Karnataka, India",
  googleMapsUrl: "https://share.google/kBUb7fNh4v7FJm2yp",
  slogan: "Care in every thread. ANR",
  headline: "DESIGNED FOR CARE. MADE TO PERFORM.",
  subheadline: "Premium hospital garments for healthcare professionals who go above and beyond."
};

export const ANNOUNCEMENTS = [
  "Free shipping on orders above ₹1499 · Use code WELCOME20 for 20% off",
  "Special Hospital & Institutional Bulk Pricing Available Across India",
  "Custom Hospital Crest & Doctor Name Computerized Embroidery Available",
  "Premium Medical Apparel: Scrub Suits • Aprons & Lab Coats • Underscrubs • Patient Wear",
  "Direct Factory Supply: Certified Medical-Grade Hospital Garments"
];

// The 5 Core Product Categories strictly defined
export const CATEGORIES = [
  {
    id: "scrub-suits",
    name: "Scrub Suits",
    title: "Scrub Suits (Men & Women)",
    shortLabel: "Scrubs",
    description: "Functional, comfortable, durable. Made for everyday hospital shifts.",
    count: "Men & Women Cuts",
    badge: "Core Essential",
    startingPrice: "₹1,199",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80",
    link: "#scrubs-collection",
    href: "#scrubs-collection",
    subcategories: [
      { name: "Classic Scrub Suits (Unisex)", label: "Classic Scrub Suits (Unisex)", href: "#scrubs-collection", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80" },
      { name: "Women's Tailored Scrub Suits", label: "Women's Tailored Scrub Suits", href: "#scrubs-collection", image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80" },
      { name: "Men's Multi-Pocket Cargo Scrubs", label: "Men's Multi-Pocket Cargo Scrubs", href: "#scrubs-collection", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80" },
      { name: "OT & Surgical Scrub Suits", label: "OT & Surgical Scrub Suits", href: "#scrubs-collection", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: "aprons-labcoats",
    name: "Aprons & Lab Coats",
    title: "Aprons for Men & Women",
    shortLabel: "Aprons & Coats",
    description: "Doctor's consultation coats, long aprons, and clinical examination aprons.",
    count: "Full & Half Sleeves",
    badge: "Doctor Choice",
    startingPrice: "₹899",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80",
    link: "#aprons-collection",
    href: "#aprons-collection",
    subcategories: [
      { name: "Doctor Full-Length Lab Coats", label: "Doctor Full-Length Lab Coats", href: "#aprons-collection", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80" },
      { name: "Consultation Half-Sleeve Aprons", label: "Consultation Half-Sleeve Aprons", href: "#aprons-collection", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80" },
      { name: "Women's Fitted Doctor Aprons", label: "Women's Fitted Doctor Aprons", href: "#aprons-collection", image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80" },
      { name: "Executive Lab & Tech Aprons", label: "Executive Lab & Tech Aprons", href: "#aprons-collection", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: "underscrubs",
    name: "Underscrubs",
    title: "Underscrubs for Men & Women",
    shortLabel: "Underscrubs",
    description: "Moisture-wicking, thermal breathable base layer for sterile OT environments.",
    count: "Long & Short Sleeve",
    badge: "Comfort Layer",
    startingPrice: "₹649",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80",
    link: "#underscrubs-collection",
    href: "#underscrubs-collection",
    subcategories: [
      { name: "Performance Long Sleeve Underscrubs", label: "Performance Long Sleeve Underscrubs", href: "#underscrubs-collection", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80" },
      { name: "Women's Cooling Moisture-Wicking", label: "Women's Cooling Moisture-Wicking", href: "#underscrubs-collection", image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80" },
      { name: "Men's Athletic Fit Crew Underscrubs", label: "Men's Athletic Fit Crew Underscrubs", href: "#underscrubs-collection", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: "patient-gown",
    name: "Patient Wear",
    title: "Patient Gown & Inpatient Wear",
    shortLabel: "Patient Wear",
    description: "Soft, hygienic, overlap tie-back patient gowns for examination and surgery.",
    count: "Adult & Pediatric",
    badge: "Hospital Grade",
    startingPrice: "₹499",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=80",
    link: "#patient-wear-collection",
    href: "#patient-wear-collection",
    subcategories: [
      { name: "Hospital Patient Gowns (Tie-Back)", label: "Hospital Patient Gowns (Tie-Back)", href: "#patient-wear-collection", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80" },
      { name: "Two-Piece Patient Pant & Shirt Sets", label: "Two-Piece Patient Pant & Shirt Sets", href: "#patient-wear-collection", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80" },
      { name: "OT & Maternity Patient Gowns", label: "OT & Maternity Patient Gowns", href: "#patient-wear-collection", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: "hospital-linen",
    name: "Hospital Linen & Drapes",
    title: "Hospital Bed Linen & OT Drapes",
    shortLabel: "OT Linens & Bedding",
    description: "Autoclavable OT green drape sheets, hospital ward bed sets, and clinic privacy curtains.",
    count: "Institutional Grade",
    badge: "Sterile Weave",
    startingPrice: "Bulk Quote",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80",
    link: "#bulk-inquiry",
    href: "#bulk-inquiry",
    subcategories: [
      { name: "Autoclavable OT Green Drapes", label: "Autoclavable OT Green Drapes", href: "#bulk-inquiry", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80" },
      { name: "Hospital Ward Fitted Bed Sheets", label: "Hospital Ward Fitted Bed Sheets", href: "#bulk-inquiry", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80" },
      { name: "Patient Privacy Curtains", label: "Patient Privacy Curtains", href: "#bulk-inquiry", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80" }
    ]
  }
];

// Product Line 1: Scrub Suits for Men & Women
// Second photo shown on card hover. Add a real `hoverImage` (back / detail / on-model
// shot) to any product to override. Until then we borrow a different photo from the
// same list as a placeholder so the hover effect is visible.
function withHover(list) {
  return list.map((item, i) => {
    if (item.hoverImage) return item;
    for (let k = 1; k < list.length; k++) {
      const other = list[(i + k) % list.length];
      if (other.image !== item.image) return { ...item, hoverImage: other.image };
    }
    return item;
  });
}

export const SCRUB_SUITS = withHover([
  {
    id: "scrub-01",
    name: "ANR Classic Unisex 5-Pocket Scrub Suit",
    category: "Scrub Suits for Men & Women",
    price: 1299,
    originalPrice: 1699,
    discount: "24% OFF",
    rating: 4.9,
    reviews: 580,
    badge: "Most Popular",
    colors: ["#1E40AF", "#1A175A", "#0F766E", "#0F172A"],
    image: "/anr-hero-banner.jpg",
    sectionId: "scrubs-collection",
    overview: "Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts. Features 5 deep reinforced utility pockets for stethoscope, scissors & phone, with ergonomic side-slit hem for unrestricted mobility.",
    features: ["5 Deep Utility Pockets", "Breathable & Sweat Absorbent", "Side Slit Movement"]
  },
  {
    id: "scrub-02",
    name: "ANR Women's Tailored Contoured Scrub Suit",
    category: "Scrub Suits for Women",
    price: 1399,
    originalPrice: 1849,
    discount: "24% OFF",
    rating: 4.9,
    reviews: 412,
    badge: "Doctor Choice",
    colors: ["#3B82F6", "#1A175A", "#6B1D2F", "#0F766E"],
    image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=600&q=80",
    sectionId: "scrubs-collection",
    overview: "Contoured princess-cut medical scrub tailored specifically for women practitioners. Fitted comfort with hidden zippered security pocket and silky soft hypoallergenic hand-feel.",
    features: ["Fitted Princess Cut", "Hidden Zipper Security Pocket", "Soft On Skin"]
  },
  {
    id: "scrub-03",
    name: "ANR Men's Multi-Pocket Cargo Scrub Set",
    category: "Scrub Suits for Men",
    price: 1449,
    originalPrice: 1899,
    discount: "23% OFF",
    rating: 4.8,
    reviews: 388,
    badge: "High Mobility",
    colors: ["#1A175A", "#1C4E3D", "#475569", "#1E40AF"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    sectionId: "scrubs-collection",
    overview: "Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets, elasticated drawstring waistband, and high-mobility gusseting for emergency & surgical teams.",
    features: ["7 Reinforced Pockets", "Elasticated Drawstring Waist", "Autoclavable Weave"]
  },
  {
    id: "scrub-04",
    name: "ANR Operation Theatre (OT) Surgical Scrub Set",
    category: "Theatre Wear",
    price: 1199,
    originalPrice: 1599,
    discount: "25% OFF",
    rating: 4.9,
    reviews: 490,
    badge: "OT Certified",
    colors: ["#1C4E3D", "#3B82F6", "#1A175A"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    sectionId: "scrubs-collection",
    overview: "Sterile Operation Theatre scrub suit certified for surgical suites. Anti-glare OT Green/Blue dye, fluid splash repellent finish, and autoclaving endurance exceeding 60+ cycles.",
    features: ["Fade & Shrink Proof"]
  }
]);

// Product Line 2: Aprons for Men & Women (Doctor's Lab Coats & Aprons)
export const APRONS_LIST = withHover([
  {
    id: "apron-01",
    name: "ANR Doctor's Full-Length Consultation Lab Coat",
    category: "Aprons for Men & Women",
    price: 1399,
    originalPrice: 1799,
    discount: "22% OFF",
    rating: 5.0,
    reviews: 620,
    badge: "Senior Consultant",
    colors: ["#FFFFFF"],
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    sectionId: "aprons-collection",
    overview: "Senior consultant full-length consultation lab coat with structured notch lapels, padded tablet pocket, stethoscope loop, and pre-shrunk cotton-rich twill that stays crisp all day.",
    features: ["Notch Lapel Collar", "Tablet & Stethoscope Pockets", "Pre-Shrunk Cotton-Poly"]
  },
  {
    id: "apron-02",
    name: "ANR Medical Consultation Half-Sleeve Apron",
    category: "Aprons for Men & Women",
    price: 899,
    originalPrice: 1199,
    discount: "25% OFF",
    rating: 4.8,
    reviews: 345,
    badge: "Daily Clinical Wear",
    colors: ["#FFFFFF"],
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
    sectionId: "aprons-collection",
    overview: "Ergonomic half-sleeve clinical examination coat with rear movement vent, dual chest pen slot, and nanotechnology stain-release barrier against medical fluids.",
    features: ["Ergonomic Back Vent", "Chest Pen Slot", "Stain Release Nanotech"]
  },
  {
    id: "apron-03",
    name: "ANR Women's Fitted Slim-Cut Doctor Apron",
    category: "Aprons for Women",
    price: 1449,
    originalPrice: 1899,
    discount: "24% OFF",
    rating: 4.9,
    reviews: 290,
    badge: "Tailored Cut",
    colors: ["#FFFFFF"],
    image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=600&q=80",
    sectionId: "aprons-collection",
    overview: "Tailored slim-cut doctor apron with flattering back-belt detailing, princess seams, and non-yellowing bright white clinical weave resistant to repeated laundering.",
    features: ["Smooth Non-Yellowing Fabric", "Concealed Placket Closure", "Deep Pen & Tablet Pockets"]
  },
  {
    id: "apron-04",
    name: "ANR Men's Executive Heavy-Duty Lab Apron",
    category: "Aprons for Men",
    price: 1299,
    originalPrice: 1699,
    discount: "23% OFF",
    rating: 4.8,
    reviews: 275,
    badge: "Reinforced Seams",
    colors: ["#FFFFFF"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    sectionId: "aprons-collection",
    overview: "Heavy-duty executive lab coat designed for diagnostic labs and pathology. Features acid/chemical splash resistance, shatterproof buttons, and side pants-pocket pass-through slits.",
    features: ["Chemical Splash Resistant", "Unbreakable Buttons", "Side Access Slits"]
  }
]);

// Product Line 3: Underscrubs for Men & Women
export const UNDERSCRUBS_LIST = withHover([
  {
    id: "us-01",
    name: "ANR Unisex Performance Long Sleeve Underscrub",
    category: "Underscrubs for Men & Women",
    price: 699,
    originalPrice: 999,
    discount: "30% OFF",
    rating: 4.9,
    reviews: 320,
    badge: "Thermal Base Layer",
    colors: ["#1A175A", "#0F172A", "#FFFFFF", "#475569"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    sectionId: "underscrubs-collection",
    overview: "Thermoregulating micro-knit underscrub shirt with thumbhole cuffs and flatlock anti-chafe seams. Ideal moisture-wicking base layer for cold Operation Theatres.",
    features: ["Ultra-Breathable Micro-Knit", "Thumb-Hole Cuffs", "Flatlock Anti-Chafe Seams"]
  },
  {
    id: "us-02",
    name: "ANR Women's Silky-Soft Moisture-Wicking Underscrub",
    category: "Underscrubs for Women",
    price: 749,
    originalPrice: 1049,
    discount: "28% OFF",
    rating: 4.8,
    reviews: 210,
    badge: "Cooling Tech",
    colors: ["#1E40AF", "#0F172A", "#FFFFFF"],
    image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=600&q=80",
    sectionId: "underscrubs-collection",
    overview: "Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish designed to prevent skin irritation under protective PPE.",
    features: ["Temperature Regulating", "4-Way Spandex Stretch", "Soft Next to Skin"]
  },
  {
    id: "us-03",
    name: "ANR Men's Athletic Fit Crew Underscrub Tee",
    category: "Underscrubs for Men",
    price: 649,
    originalPrice: 899,
    discount: "27% OFF",
    rating: 4.9,
    reviews: 185,
    badge: "OT Duty",
    colors: ["#1A175A", "#475569", "#0F172A"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    sectionId: "underscrubs-collection",
    overview: "Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability designed for intensive surgical duties.",
    features: ["Quick-Dry Poly-Spandex", "Antimicrobial Treatment", "Tagless Collar"]
  }
]);

// Product Line 4 & 5: Patient Gown & Patient Pant & Shirt
export const PATIENT_WEAR_LIST = withHover([
  {
    id: "pw-01",
    name: "ANR Hospital Inpatient Patient Gown (Tie-Back)",
    category: "Patient Gown",
    price: 499,
    originalPrice: 699,
    discount: "28% OFF",
    rating: 4.9,
    reviews: 440,
    badge: "Patient Dignity",
    colors: ["#3B82F6", "#0F766E", "#E2E8F0"],
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    sectionId: "patient-wear-collection",
    overview: "Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable skin-friendly cotton.",
    features: ["Full Overlap Modesty Back", "Heavy-Duty Cotton Twill Ties", "Soft Hypoallergenic Fabric"]
  },
  {
    id: "pw-02",
    name: "ANR Two-Piece Patient Pant & Shirt Set (Hospital Ward)",
    category: "Patient Pant & Shirt",
    price: 799,
    originalPrice: 1099,
    discount: "27% OFF",
    rating: 4.9,
    reviews: 510,
    badge: "Inpatient Uniform",
    colors: ["#1E40AF", "#3B82F6", "#475569"],
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
    sectionId: "patient-wear-collection",
    overview: "Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers. Breathable, durable, and comfortable for extended hospital stays.",
    features: ["Front Button / Snap Closure Shirt", "Elastic Drawstring Pant", "Breathable Long-Wear Cotton"]
  },
  {
    id: "pw-03",
    name: "ANR Operation Theatre Surgical Patient Gown",
    category: "Patient Gown",
    price: 549,
    originalPrice: 749,
    discount: "26% OFF",
    rating: 4.8,
    reviews: 320,
    badge: "Sterile Surgery",
    colors: ["#0F766E", "#1E40AF"],
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    sectionId: "patient-wear-collection",
    overview: "Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel, raglan sleeve styling for fast IV access, and 60+ autoclave wash endurance.",
    features: ["Fluid Repellent Finish", "Raglan Sleeves For IV Access", "Autoclavable 60+ Cycles"]
  },
  {
    id: "pw-04",
    name: "ANR Maternity & Pediatric Patient Gown",
    category: "Patient Gown",
    price: 529,
    originalPrice: 729,
    discount: "27% OFF",
    rating: 4.9,
    reviews: 215,
    badge: "Easy Access",
    colors: ["#EC4899", "#3B82F6"],
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
    sectionId: "patient-wear-collection",
    overview: "Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access, tagless comfort, and non-toxic skin-safe hospital dyes.",
    features: ["Front Shoulder Snaps for Nursing", "100% Breathable Combed Cotton", "Non-Toxic Skin-Safe Dyes"]
  }
]);

// Unified catalog for real-time search across all medical garment collections
export const ALL_PRODUCTS = [
  ...SCRUB_SUITS,
  ...APRONS_LIST,
  ...UNDERSCRUBS_LIST,
  ...PATIENT_WEAR_LIST
];
// Color Spectrum Line from Image 3 ("ALL COLOURS. SAME QUALITY. SAME CARE.")
export const COLOR_COLLECTIONS = [
  { name: "Royal Blue", hex: "#1E40AF", count: "Top Seller for Surgery & OT", popular: true },
  { name: "Ceil / Sky Blue", hex: "#60A5FA", count: "Standard Clinical Ward Pastel", popular: true },
  { name: "Navy Blue", hex: "#1A175A", count: "ANR Signature Deep Navy", popular: true },
  { name: "Teal Blue", hex: "#0D9488", count: "Dental & Modern Clinic Tone" },
  { name: "Hunter Green", hex: "#15803D", count: "Operation Theatre Glare-Free", popular: true },
  { name: "Forest Green", hex: "#14532D", count: "Critical Care Specialist" },
  { name: "Lavender", hex: "#A855F7", count: "Pediatrics & Wellness" },
  { name: "Wine / Burgundy", hex: "#831843", count: "Consultant & Dermatology" },
  { name: "Blush Pink", hex: "#F472B6", count: "Maternity & Nursing" },
  { name: "Beige / Khaki", hex: "#D4B996", count: "Admin & Executive Staff" },
  { name: "Slate Grey", hex: "#64748B", count: "Lab & Diagnostics" },
  { name: "Midnight Black", hex: "#0F172A", count: "Aesthetic Medicine & Surgery" },
  { name: "Doctor White", hex: "#FFFFFF", count: "Lab Coats & Consultation Aprons", popular: true }
];

export const FABRIC_FEATURES = [
  {
    title: "SOFT ON SKIN",
    desc: "All-day comfort you can feel during grueling 14+ hour clinical rotations.",
    icon: "Heart"
  },
  {
    title: "BREATHABLE FABRIC",
    desc: "Micro-porous weave keeps doctors and nurses cool and fresh under OT lights.",
    icon: "Wind"
  },
  {
    title: "DURABLE & BUILT TO LAST",
    desc: "Industrial-grade double reinforced seams built to last shift after shift.",
    icon: "Shield"
  },
  {
    title: "EASY CARE & EASY WASH",
    desc: "Wash, wear and repeat with rapid drying and minimal ironing required.",
    icon: "Sparkles"
  },
  {
    title: "EASY MOVEMENT",
    desc: "Engineered ergonomic cuts allow complete flexibility for emergency procedures.",
    icon: "Move"
  },
  {
    title: "FADE & SHRINK RESISTANT",
    desc: "Pre-shrunk reactive dyed textiles tested for repeated autoclave sterilizations.",
    icon: "Layers"
  }
];

export const INSTITUTIONS = [
  { name: "Apollo Hospitals", location: "Pan India Network", badge: "Direct Partner" },
  { name: "Fortis Healthcare", location: "South & West India", badge: "Verified Client" },
  { name: "Manipal Hospitals", location: "Bangalore & Regional", badge: "Direct Supply" },
  { name: "Narayana Health", location: "Cardiac & Multi-Speciality", badge: "Hospital Supply" },
  { name: "Max Healthcare", location: "Clinical Network", badge: "Preferred Uniforms" },
  { name: "St. John's Medical College", location: "Bangalore", badge: "Institutional Client" },
  { name: "Aster CMI Hospital", location: "Bangalore", badge: "OT & Ward Supply" }
];

export const FAQS = [
  {
    q: "What products are manufactured by ANR Hospital Garments?",
    a: "We directly manufacture 5 core hospital garment categories: (1) Scrub suits for Men & Women, (2) Aprons & Doctor Lab Coats for Men & Women, (3) Underscrubs for Men & Women, (4) Patient Gowns, and (5) Patient Pant & Shirt sets."
  },
  {
    q: "How can I place institutional or bulk orders with ANR?",
    a: "You can connect directly with our founders: Mr. Manjunath Rao G at 9986044574 or Mr. Balraj. V at 6363429113, email us at anr20072010@gmail.com, or fill out the quotation request form on this page."
  },
  {
    q: "Where is ANR Hospital Garments located?",
    a: "Our manufacturing facility and head office is located at N0:1205, 12th Cross, 2nd Phase, 1st Stage, Banashankari, Girinagar, Bangalore-560085. You can also view our live location on Google Maps: https://share.google/kBUb7fNh4v7FJm2yp."
  },
  {
    q: "Do you provide custom hospital logo and doctor name embroidery?",
    a: "Yes! We have an in-house computerized embroidery unit. We digitize official hospital crests and embroider doctor names, qualifications (MBBS, MD, MS), and department titles in permanent fade-proof threads."
  },
  {
    q: "Can you send physical fabric swatches and samples to our hospital?",
    a: "Yes. For medical institutions, nursing colleges, and clinics, we courier physical fabric swatch cards and sample scrub/apron sets directly to your procurement department."
  }
];


export const TESTIMONIALS = [
  {
    doctor: "Dr. Sandeep K.",
    specialty: "Senior Consultant Surgeon",
    hospital: "Bangalore Super Speciality Hospital",
    rating: 5,
    text: "ANR Hospital Garments has supplied our surgical team for the past 4 years. The breathability and comfort during 12-hour OT shifts is exceptional. Their Bangalore factory delivers reliably every time.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    verified: true,
    productUsed: "ANR Classic Unisex 5-Pocket Scrub Suit (Royal Blue)"
  },
  {
    doctor: "Dr. Meenakshi S.",
    specialty: "Chief Resident - OBGYN",
    hospital: "Manipal Hospital, Bangalore",
    rating: 5,
    text: "The tailored women's fit and the computerized embroidery of our department name are top quality. The fabric survives heavy hospital laundering without any color bleeding or shrinkage.",
    image: "https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80",
    verified: true,
    productUsed: "ANR Women's Tailored Scrub Set & Lab Apron"
  },
  {
    doctor: "Mr. Ramesh Babu",
    specialty: "Materials & Procurement Head",
    hospital: "Apollo Clinics Network",
    rating: 5,
    text: "Dealing directly with Mr. Manjunath Rao and Mr. Balraj ensures zero delay in procurement. Their patient gowns and ward sets are durable, soft on patients, and competitively priced.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80",
    verified: true,
    productUsed: "Patient Gowns & Patient Pant/Shirt Sets"
  }
];