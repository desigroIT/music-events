// ============================================================
// STUDIO MUSICIANS — DUMMY DATA FILE
// All static content for the platform lives here.
// ============================================================

// ─── NAVIGATION ──────────────────────────────────────────────
export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Courses", href: "#courses" },
  { label: "Academy", href: "#academy" },
  { label: "Community", href: "#community" },
  { label: "Network", href: "#networking" },
  { label: "Blog", href: "#blog" },
  { label: "Events", href: "#events" },
  { label: "Membership", href: "#membership" },
];

// ─── HERO ────────────────────────────────────────────────────
export const heroData = {
  tagline: "Where Artists Become Legends",
  headline: "STUDIO\nMUSICIANS",
  subheadline:
    "The world's most immersive music learning & networking platform. Join 50,000+ artists from 120+ countries.",
  cta: { primary: "Start Learning Free", secondary: "Explore Community" },
  stats: [
    { value: "50K+", label: "Active Musicians" },
    { value: "2K+", label: "Lessons" },
    { value: "150+", label: "Expert Instructors" },
    { value: "120+", label: "Countries" },
  ],
};

// ─── DRUM COURSES ────────────────────────────────────────────
export const drumCourses = [
  {
    id: "dc-1",
    title: "Beginner Drumming Fundamentals",
    instructor: "Alex Rodriguez",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 42,
    students: 12400,
    rating: 4.9,
    price: 49,
    badge: "Bestseller",
    badgeColor: "#FF5B00",
    tags: ["Rhythm", "Technique", "Kit Setup"],
    description:
      "Master the basics of drumming from grip to your first full groove. Perfect for absolute beginners.",
  },
  {
    id: "dc-2",
    title: "Jazz Kit Mastery",
    instructor: "Marcus Webb",
    level: "Intermediate",
    duration: "12 weeks",
    lessons: 68,
    students: 8200,
    rating: 4.8,
    price: 79,
    badge: "Top Rated",
    badgeColor: "#FFD60A",
    tags: ["Jazz", "Improvisation", "Brush Technique"],
    description:
      "Dive deep into jazz drumming tradition — brushes, ride patterns, and bebop independence.",
  },
  {
    id: "dc-3",
    title: "Electronic Beats Production",
    instructor: "DJ Kira Nakamura",
    level: "All Levels",
    duration: "6 weeks",
    lessons: 35,
    students: 19800,
    rating: 4.7,
    price: 59,
    badge: "New",
    badgeColor: "#00D4FF",
    tags: ["DAW", "Programming", "Sound Design"],
    description:
      "Create radio-ready electronic beats. Covers DAW setup, drum programming, and mixing.",
  },
  {
    id: "dc-4",
    title: "Tabla Foundation",
    instructor: "Pandit Ravi Shankar Jr.",
    level: "Beginner",
    duration: "10 weeks",
    lessons: 54,
    students: 6700,
    rating: 5.0,
    price: 69,
    badge: "Premium",
    badgeColor: "#9D4EDD",
    tags: ["Classical", "Taal", "Bols"],
    description:
      "Learn the sacred art of tabla — bols, taal cycles, and the foundation of Indian classical rhythm.",
  },
  {
    id: "dc-5",
    title: "Metal Drumming Unleashed",
    instructor: "Thor Eriksson",
    level: "Advanced",
    duration: "10 weeks",
    lessons: 58,
    students: 9100,
    rating: 4.9,
    price: 89,
    badge: "Hot",
    badgeColor: "#FF5B00",
    tags: ["Double Bass", "Blast Beats", "Endurance"],
    description:
      "Dominate extreme metal drumming. Double bass mastery, blast beats, and superhuman endurance training.",
  },
  {
    id: "dc-6",
    title: "Afrobeat Rhythms",
    instructor: "Kofi Mensah",
    level: "Intermediate",
    duration: "8 weeks",
    lessons: 44,
    students: 5400,
    rating: 4.8,
    price: 65,
    badge: "New",
    badgeColor: "#00D4FF",
    tags: ["Afrobeat", "Polyrhythm", "World Music"],
    description:
      "Explore the vibrant polyrhythmic world of Afrobeat, highlife, and West African percussion.",
  },
];

// ─── ACADEMY ────────────────────────────────────────────────
export const academyFeatures = [
  {
    id: "af-1",
    icon: "🎬",
    title: "Video Library",
    description:
      "Access 2,000+ HD lessons taught by world-class musicians. Stream anytime, anywhere.",
    color: "#FF5B00",
    stats: "2,000+ videos",
  },
  {
    id: "af-2",
    icon: "🔴",
    title: "Live Classes",
    description:
      "Weekly live sessions with instructors. Ask questions in real-time and get instant feedback.",
    color: "#00D4FF",
    stats: "50+ per week",
  },
  {
    id: "af-3",
    icon: "🎯",
    title: "1-on-1 Coaching",
    description:
      "Book private sessions with your favorite instructor. Personalized roadmap to mastery.",
    color: "#9D4EDD",
    stats: "150+ coaches",
  },
  {
    id: "af-4",
    icon: "🏆",
    title: "Certifications",
    description:
      "Earn industry-recognized certificates. Build your portfolio and stand out in the music industry.",
    color: "#FFD60A",
    stats: "35+ certificates",
  },
  {
    id: "af-5",
    icon: "🎵",
    title: "Practice Tracks",
    description:
      "Play along with professional backing tracks across 20+ genres. Build real musical intuition.",
    color: "#FF5B00",
    stats: "500+ tracks",
  },
  {
    id: "af-6",
    icon: "🤖",
    title: "AI Feedback",
    description:
      "Upload your recordings and get instant AI-powered analysis on timing, dynamics, and technique.",
    color: "#00D4FF",
    stats: "Instant results",
  },
];

export const academyStats = [
  { value: "50,000+", label: "Students Enrolled" },
  { value: "2,000+", label: "Video Lessons" },
  { value: "150+", label: "Expert Instructors" },
  { value: "98%", label: "Satisfaction Rate" },
];

// ─── COMMUNITY ────────────────────────────────────────────────
export const communityMusicians = [
  {
    id: "cm-1",
    name: "Aisha Patel",
    instrument: "Tabla & Drums",
    country: "India 🇮🇳",
    followers: "12.4K",
    verified: true,
    color: "#9D4EDD",
    bio: "Bridging classical Indian rhythm with modern jazz. Tabla meets jazz kit in fusion experiments.",
    tracks: 48,
    posts: 312,
  },
  {
    id: "cm-2",
    name: "Luca Ferrari",
    instrument: "Electric Guitar",
    country: "Italy 🇮🇹",
    followers: "28.7K",
    verified: true,
    color: "#FF5B00",
    bio: "Neo-soul and blues fusion guitarist. Studio session artist for 3 major labels.",
    tracks: 127,
    posts: 891,
  },
  {
    id: "cm-3",
    name: "Yuki Tanaka",
    instrument: "Violin & Electronic",
    country: "Japan 🇯🇵",
    followers: "19.2K",
    verified: true,
    color: "#00D4FF",
    bio: "Classical violinist turned electronic producer. Blending orchestral beauty with EDM.",
    tracks: 63,
    posts: 445,
  },
  {
    id: "cm-4",
    name: "Marcus Webb",
    instrument: "Jazz Drums",
    country: "USA 🇺🇸",
    followers: "34.1K",
    verified: true,
    color: "#FFD60A",
    bio: "Jazz drummer, educator, and composer. Toured with 5 Grammy-winning artists.",
    tracks: 89,
    posts: 1204,
  },
  {
    id: "cm-5",
    name: "Sofia Mendes",
    instrument: "Classical Piano",
    country: "Brazil 🇧🇷",
    followers: "9.8K",
    verified: false,
    color: "#FF5B00",
    bio: "Concert pianist specializing in contemporary classical and Brazilian music traditions.",
    tracks: 34,
    posts: 167,
  },
  {
    id: "cm-6",
    name: "Omar Al-Rashid",
    instrument: "Oud & Bass",
    country: "Egypt 🇪🇬",
    followers: "15.6K",
    verified: true,
    color: "#9D4EDD",
    bio: "Merging ancient oud traditions with modern bass grooves. World fusion pioneer.",
    tracks: 71,
    posts: 523,
  },
];

export const communityStats = [
  { value: "50K+", label: "Members" },
  { value: "120+", label: "Countries" },
  { value: "8K+", label: "Collaborations" },
  { value: "2M+", label: "Track Plays" },
];

// ─── NETWORKING ─────────────────────────────────────────────
export const networkingOpportunities = [
  {
    id: "no-1",
    type: "Studio Session",
    title: "Session Drummer Wanted",
    company: "Rhythm Records, NYC",
    budget: "$500–800 / session",
    deadline: "Urgent",
    skills: ["Jazz", "Funk", "Hip-Hop"],
    color: "#FF5B00",
  },
  {
    id: "no-2",
    type: "Tour",
    title: "European Tour Guitarist",
    company: "Eclipse Music Group",
    budget: "$3,000 / month",
    deadline: "2 weeks",
    skills: ["Rock", "Touring", "Stage Presence"],
    color: "#00D4FF",
  },
  {
    id: "no-3",
    type: "Collaboration",
    title: "Film Score Composer",
    company: "Indie Film 'Echoes'",
    budget: "$5,000 flat",
    deadline: "1 month",
    skills: ["Orchestration", "DAW", "Cinematic"],
    color: "#9D4EDD",
  },
  {
    id: "no-4",
    type: "Teaching",
    title: "Online Guitar Instructor",
    company: "MusicPath Platform",
    budget: "$80 / hour",
    deadline: "Ongoing",
    skills: ["Guitar", "Teaching", "Video Production"],
    color: "#FFD60A",
  },
  {
    id: "no-5",
    type: "Performance",
    title: "Wedding & Events Violinist",
    company: "Elite Events Co.",
    budget: "$400–600 / event",
    deadline: "Ongoing",
    skills: ["Violin", "Classical", "Jazz Standards"],
    color: "#FF5B00",
  },
  {
    id: "no-6",
    type: "Recording",
    title: "Background Vocalist (Album)",
    company: "Soundwave Studios",
    budget: "$1,200",
    deadline: "3 weeks",
    skills: ["Vocals", "Harmonies", "Studio Work"],
    color: "#00D4FF",
  },
];

export const networkingMilestones = [
  {
    year: "2019",
    event: "Platform Founded",
    detail: "Studio Musicians born from a drummer's dream in Chicago.",
    color: "#FF5B00",
  },
  {
    year: "2020",
    event: "10,000 Members",
    detail: "Community exploded during global lockdowns. Music united the world.",
    color: "#00D4FF",
  },
  {
    year: "2021",
    event: "Academy Launch",
    detail: "Launched premium video courses with 50 hand-picked instructors.",
    color: "#9D4EDD",
  },
  {
    year: "2022",
    event: "Global Expansion",
    detail: "Reached musicians in 100+ countries across 6 continents.",
    color: "#FFD60A",
  },
  {
    year: "2023",
    event: "AI Feedback Engine",
    detail: "Launched AI-powered practice analysis. 50M recordings analyzed.",
    color: "#FF5B00",
  },
  {
    year: "2024",
    event: "50,000 Artists",
    detail: "Half a million lessons completed. 8,000+ collaborations formed.",
    color: "#00D4FF",
  },
];

// ─── BLOG ────────────────────────────────────────────────────
export const blogPosts = [
  {
    id: "bp-1",
    category: "Technique",
    title: "The Secret Language of Polyrhythm: A Drummer's Guide to Afrobeat",
    excerpt:
      "Uncover the hypnotic world of polyrhythmic drumming borrowed from West African musical traditions that power modern Afrobeat grooves.",
    author: "Marcus Webb",
    readTime: "8 min",
    date: "Dec 15, 2024",
    featured: true,
    color: "#FF5B00",
    tag: "Featured",
  },
  {
    id: "bp-2",
    category: "Gear",
    title: "Best Electronic Drum Kits Under $1000 in 2025",
    excerpt:
      "We tested 14 e-kits so you don't have to. Here's our definitive guide to the best value electronic drum kits this year.",
    author: "Alex Rodriguez",
    readTime: "6 min",
    date: "Dec 10, 2024",
    featured: false,
    color: "#00D4FF",
    tag: "Guide",
  },
  {
    id: "bp-3",
    category: "Industry",
    title: "How to Get Your First Session Work as a Studio Musician",
    excerpt:
      "Breaking into session work requires more than great chops. Industry veteran Luca Ferrari shares the real path to getting hired.",
    author: "Luca Ferrari",
    readTime: "10 min",
    date: "Dec 5, 2024",
    featured: false,
    color: "#9D4EDD",
    tag: "Career",
  },
  {
    id: "bp-4",
    category: "Culture",
    title: "Tabla in the 21st Century: Ancient Rhythm Meets Modern Music",
    excerpt:
      "How a 500-year-old percussion instrument is finding its voice in jazz, electronic, and experimental music scenes worldwide.",
    author: "Aisha Patel",
    readTime: "7 min",
    date: "Nov 28, 2024",
    featured: false,
    color: "#FFD60A",
    tag: "Culture",
  },
  {
    id: "bp-5",
    category: "Practice",
    title: "The 20-Minute Daily Drummer Warm-Up Routine",
    excerpt:
      "A structured warm-up that professional drummers swear by. Build technique, endurance, and musicality in just 20 minutes.",
    author: "Thor Eriksson",
    readTime: "5 min",
    date: "Nov 20, 2024",
    featured: false,
    color: "#FF5B00",
    tag: "Tips",
  },
];

// ─── EVENTS ─────────────────────────────────────────────────
export const events = [
  {
    id: "ev-1",
    type: "Masterclass",
    title: "Groove Science: Advanced Pocket Playing",
    host: "Marcus Webb",
    date: "Jan 15, 2025",
    time: "7:00 PM EST",
    mode: "Live",
    price: "Free for Pro+",
    spots: 200,
    spotsLeft: 43,
    color: "#FF5B00",
    tag: "Live",
  },
  {
    id: "ev-2",
    type: "Workshop",
    title: "Recording Your Drum Kit at Home",
    host: "Alex Rodriguez",
    date: "Jan 20, 2025",
    time: "2:00 PM EST",
    mode: "Online",
    price: "$25",
    spots: 50,
    spotsLeft: 12,
    color: "#00D4FF",
    tag: "Workshop",
  },
  {
    id: "ev-3",
    type: "Concert",
    title: "Studio Musicians Live — Chicago",
    host: "Multiple Artists",
    date: "Feb 8, 2025",
    time: "8:00 PM CST",
    mode: "In-Person",
    price: "$45 / $75 VIP",
    spots: 800,
    spotsLeft: 215,
    color: "#9D4EDD",
    tag: "In-Person",
  },
  {
    id: "ev-4",
    type: "Masterclass",
    title: "Indian Classical Rhythm: A Deep Dive",
    host: "Pandit Ravi Shankar Jr.",
    date: "Feb 14, 2025",
    time: "10:00 AM IST",
    mode: "Online",
    price: "Free for All",
    spots: 500,
    spotsLeft: 378,
    color: "#FFD60A",
    tag: "Free",
  },
  {
    id: "ev-5",
    type: "Jam Session",
    title: "Global Drum Circle — Virtual",
    host: "Studio Musicians Team",
    date: "Feb 28, 2025",
    time: "6:00 PM GMT",
    mode: "Online",
    price: "Free",
    spots: 1000,
    spotsLeft: 642,
    color: "#FF5B00",
    tag: "Free",
  },
  {
    id: "ev-6",
    type: "Workshop",
    title: "Music Business: Getting Paid as a Musician",
    host: "Sophie Chang (Music Lawyer)",
    date: "Mar 5, 2025",
    time: "3:00 PM EST",
    mode: "Online",
    price: "$35",
    spots: 100,
    spotsLeft: 28,
    color: "#00D4FF",
    tag: "Business",
  },
];

// ─── MEMBERSHIP ──────────────────────────────────────────────
export const membershipPlans = [
  {
    id: "mp-1",
    tier: "Free",
    price: 0,
    period: "forever",
    color: "#F0F0F0",
    description: "Get started on your musical journey",
    popular: false,
    features: [
      { label: "Access to 50 free lessons", included: true },
      { label: "Community forum access", included: true },
      { label: "1 free masterclass/month", included: true },
      { label: "Basic profile page", included: true },
      { label: "HD video quality", included: false },
      { label: "Live classes", included: false },
      { label: "1-on-1 coaching", included: false },
      { label: "Download lessons offline", included: false },
      { label: "AI practice feedback", included: false },
      { label: "Certificate program", included: false },
    ],
    cta: "Get Started Free",
  },
  {
    id: "mp-2",
    tier: "Pro",
    price: 29,
    period: "month",
    color: "#FF5B00",
    description: "For serious musicians ready to level up",
    popular: true,
    features: [
      { label: "All 2,000+ lessons", included: true },
      { label: "Community forum access", included: true },
      { label: "Unlimited masterclasses", included: true },
      { label: "Enhanced profile page", included: true },
      { label: "HD video quality", included: true },
      { label: "Live classes (50+/week)", included: true },
      { label: "2 coaching sessions/month", included: true },
      { label: "Download lessons offline", included: true },
      { label: "AI practice feedback", included: false },
      { label: "Certificate program", included: false },
    ],
    cta: "Start Pro Trial",
  },
  {
    id: "mp-3",
    tier: "Elite",
    price: 79,
    period: "month",
    color: "#FFD60A",
    description: "The complete professional musician experience",
    popular: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Priority community access", included: true },
      { label: "Unlimited masterclasses", included: true },
      { label: "Verified artist profile", included: true },
      { label: "4K Ultra HD quality", included: true },
      { label: "Live classes + backstage", included: true },
      { label: "Unlimited coaching", included: true },
      { label: "Download + offline sync", included: true },
      { label: "AI practice feedback", included: true },
      { label: "All certificate programs", included: true },
    ],
    cta: "Go Elite",
  },
];

// ─── TESTIMONIALS ────────────────────────────────────────────
export const testimonials = [
  {
    id: "t-1",
    name: "Priya Sharma",
    role: "Professional Tabla Player",
    quote:
      "Studio Musicians completely transformed how I practice. The tabla courses are taught by the best teachers I've ever had, and the community keeps me accountable.",
    rating: 5,
    color: "#9D4EDD",
  },
  {
    id: "t-2",
    name: "James O'Brien",
    role: "Session Drummer, Dublin",
    quote:
      "I landed my first paid session gig 3 months after joining. The networking section actually works. This platform is the real deal.",
    rating: 5,
    color: "#FF5B00",
  },
  {
    id: "t-3",
    name: "Mei Lin",
    role: "Music Producer, Shanghai",
    quote:
      "The electronic beats course combined with the community feedback loop is unmatched. I've released two EPs since I started here.",
    rating: 5,
    color: "#00D4FF",
  },
];

// ─── FOOTER ─────────────────────────────────────────────────
export const footerLinks = {
  Learn: [
    { label: "All Courses", href: "#" },
    { label: "Drum Lessons", href: "#" },
    { label: "Guitar Lessons", href: "#" },
    { label: "Violin Lessons", href: "#" },
    { label: "Tabla Lessons", href: "#" },
    { label: "Live Classes", href: "#" },
  ],
  Community: [
    { label: "Member Feed", href: "#" },
    { label: "Collaboration Hub", href: "#" },
    { label: "Forums", href: "#" },
    { label: "Jam Sessions", href: "#" },
    { label: "Networking", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Our Instructors", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

export const socialLinks = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "Discord", href: "#", icon: "discord" },
  { label: "TikTok", href: "#", icon: "tiktok" },
];

// ─── INSTRUMENTS (for scroll story labels) ───────────────────
export const scrollStoryActs = [
  {
    act: 1,
    title: "The Stage Awakens",
    subtitle: "A new era of music begins",
    color: "#FF5B00",
  },
  {
    act: 2,
    title: "The Drummer",
    subtitle: "Heartbeat of the universe",
    instrument: "🥁",
    color: "#FF5B00",
  },
  {
    act: 3,
    title: "The Rhythm Lives",
    subtitle: "Every beat tells a story",
    instrument: "🥁",
    color: "#FF5B00",
  },
  {
    act: 4,
    title: "The Violinist",
    subtitle: "Strings of light and emotion",
    instrument: "🎻",
    color: "#00D4FF",
  },
  {
    act: 5,
    title: "The Tabla Master",
    subtitle: "Ancient rhythm, futuristic soul",
    instrument: "🪘",
    color: "#9D4EDD",
  },
  {
    act: 6,
    title: "The Guitarist",
    subtitle: "Six strings, infinite worlds",
    instrument: "🎸",
    color: "#FFD60A",
  },
  {
    act: 7,
    title: "PLAY. LEARN. CONNECT.",
    subtitle: "The symphony of tomorrow",
    color: "#FF5B00",
  },
];
