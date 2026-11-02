/* ------------------------------------------------------------------
   Everything you'll want to edit lives in this file.
   - SITE: your About me section, resume and contact details.
     Anything left empty ("" or []) is simply hidden on the page.
   - PROJECTS: one entry per project, in the order they rotate.
     Add `image` for a screenshot, otherwise a cover is drawn from `art`.
------------------------------------------------------------------- */

window.SITE = {
  name: "Hasan Said",
  role: "Information Systems graduate · University of Haifa", // shown under your name
  location: "Haifa, Israel",
  headline: "I build apps that keep your data yours.",

  // Optional photo of you: put the file in the images folder, e.g. "images/me.jpg"
  photo: "",

  // A few short paragraphs about you.
  about: [
    "I'm Hasan, an Information Systems graduate from the University of Haifa (August 2026). My senior project, KidSafe Monitor, was awarded Excellent: an AI camera system that spots a child left alone in a car and alerts the parent in real time. I've also built a Python/Pandas engine that pulls five clinical datasets into one queryable SQLite model.",
    "I have working knowledge of TCP/IP networking, years of hands-on PC building and some Linux experience, and I'm studying for the AWS Cloud Practitioner certification.",
    "A theme runs through most of my work: your files, photos and data should stay with you. Porthole sends files device-to-device, the DV Photo Checker never uploads your photo, and OfflineOffice does its PDF work on your own machine.",
  ],

  // Your CV as a PDF in the website folder, e.g. "resume.pdf". Empty hides the download buttons.
  resume: "hasan-said-resume.pdf",

  skills: [
    "Python", "Java", "SQL", "JavaScript", "Bash", "C", "C#", "HTML & CSS",
    "MediaPipe", "OpenCV", "Machine Learning", "Pandas", "Matplotlib", "Seaborn", "SQLite",
    "Flask", "Node.js", "WebRTC", "Git & GitHub", "Linux", "AWS (in progress)", "Agile / Scrum",
  ],

  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Hebrew", level: "Proficient" },
    { name: "German", level: "B1" },
  ],

  // Work history, newest first. Copy the example line and fill it in:
  // { when: "2024 – now", title: "Job title", place: "Company", text: "What you did." },
  experience: [],

  education: [
    {
      when: "2022 – 2026",
      title: "B.Sc. in Information Systems",
      place: "University of Haifa",
      text: "Senior project (KidSafe Monitor) awarded Excellent. Coursework: Software Engineering & QA, Data Structures & Algorithms, OOP, Computer Networks, Machine Learning, Database Systems.",
    },
    { when: "2026", title: "AWS Cloud Practitioner", place: "In progress, exam scheduled for 2026" },
  ],

  // Contact details
  email: "hsnsaed.8888@gmail.com",
  github: "https://github.com/HasanIsTrying",
  linkedin: "https://www.linkedin.com/in/hasan-said",
};

window.PROJECTS = [
  {
    id: "porthole",
    title: "Porthole",
    tagline: "Share files between devices in a private, encrypted room.",
    year: 2026,
    kind: "Web app",
    badge: "Open source",
    art: { c1: "#0f4c75", c2: "#3fc1c9", icon: "porthole" },
    description:
      "Start a room and you get a 6-character code and a QR code. Anyone you let in can share files and notes straight from their browser. Files travel device-to-device, end-to-end encrypted, and nothing is stored in the cloud.",
    highlights: [
      "Join by code or by scanning a QR code",
      "Both screens show the same 6-digit number to confirm who's joining",
      "Direct device-to-device transfer over WebRTC",
      "End-to-end tests across four browser profiles, plus a load test",
    ],
    readme:
      "Everything inside a room is encrypted with a key the server never sees, and joining by code uses a key exchange plus a matching 6-digit check to stop anyone in the middle. The server only helps devices find each other: it stores nothing and logs no messages.",
    stack: ["JavaScript", "Node.js", "WebRTC", "WebSockets", "Docker"],
    code: "https://github.com/HasanIsTrying/porthole",
  },
  {
    id: "dv-photo-checker",
    title: "DV Photo Checker",
    tagline: "Check your DV Lottery photo before you enter. It never leaves your phone.",
    year: 2026,
    kind: "Web app · AI",
    badge: "Live",
    image: "images/dv-photo-checker.jpg",
    art: { c1: "#1f2937", c2: "#e11d74", icon: "camera" },
    description:
      "A free, unofficial pre-checker for DV Lottery photos. It measures head size and eye height against the official rules, checks the background, and saves a correct 600×600 JPEG, all inside the browser.",
    highlights: [
      "Measures head size and eye position against the official rules",
      "Checks the background and exports a compliant 600×600 JPEG",
      "Photos are never uploaded; the AI runs in your browser",
      "English and Arabic, with AI models verified by hash",
    ],
    readme:
      "AI (MediaPipe) places lines at the top of the head, the eyes and the chin, which you can drag to adjust. It then checks head size, eye height, pose, expression and background, and fixes what cropping can fix. The face is never edited and photo metadata is stripped.",
    stack: ["JavaScript", "MediaPipe", "i18n", "Vercel"],
    live: "https://dvphotochecker.com",
    note: "Code is private.",
  },
  {
    id: "kidsafe",
    title: "KidSafe Monitor",
    tagline: "An AI camera that spots a child left alone in a car.",
    year: 2026,
    kind: "AI · Desktop · Open source",
    badge: "Senior project · Excellent",
    art: { c1: "#7a1f2b", c2: "#ff8a5b", icon: "shield" },
    description:
      "A camera watches the car's interior and an AI model sorts every face it sees into an age band. If it decides a young child is there without an adult, it sounds an alarm and pushes a notification to the parent's phone. If nobody responds within two minutes, it texts emergency contacts with a map link to the car.",
    highlights: [
      "My B.Sc. senior project, awarded Excellent",
      "Age estimation on every face the camera sees",
      "Local alarm plus a push notification to the parent",
      "Escalates to emergency contacts with a map link after two minutes",
      "Runs on Windows and macOS, with a one-command install",
    ],
    readme:
      "Comes with a demo mode that needs no camera, phone or accounts, and double-click launchers for Windows and macOS that install anything missing on the first run.",
    note: "An assistive tool, not a certified safety device.",
    stack: ["TypeScript", "Python", "Node.js", "MediaPipe", "PyTorch"],
    code: "https://github.com/HasanIsTrying/KidSafe-Monitor",
  },
  {
    id: "stockscript",
    title: "StockScript",
    tagline: "See which stocks the people you follow on X are talking about.",
    year: 2026,
    kind: "Dashboard",
    badge: "Open source",
    art: { c1: "#0f2a1d", c2: "#4ade80", icon: "chart" },
    description:
      "A dark-mode dashboard that reads tweets from accounts you choose, pulls out any ticker symbols, and shows the live price for each. From there you can open news, get an AI take on the sentiment, and view a price chart without leaving the page.",
    highlights: [
      "Finds ticker symbols in tweets from accounts you pick",
      "Live prices plus hand-drawn SVG charts (5D to 1Y)",
      "AI reads tweets and news and calls them bullish or bearish",
      "Runs locally; your keys stay on your machine",
    ],
    readme:
      "Reads X with twikit (no official API needed), gets prices and news from yfinance, and asks Groq for the sentiment. Everything is stored in a SQLite database that sets itself up.",
    note: "Not financial advice.",
    stack: ["Python", "Flask", "SQLite", "JavaScript", "SVG", "Groq AI"],
    code: "https://github.com/HasanIsTrying/StockScript",
  },
  {
    id: "offlineoffice",
    title: "OfflineOffice",
    tagline: "Everyday file tools that run on your own machine.",
    year: 2026,
    kind: "Local web app",
    badge: "Open source",
    art: { c1: "#1e1b4b", c2: "#a78bfa", icon: "doc" },
    description:
      "Tired of random \"free online\" converter sites, I bundled the file tools I actually use into one local app. No accounts, no uploads, no internet needed once it's running.",
    highlights: [
      "PDF editor, merger, splitter, compressor and password tools",
      "Smart redactor that blacks out text by word or pattern",
      "Converts PDFs and documents to Markdown, with OCR for scans",
      "Offline audio transcription with Whisper",
      "Local Drop: send files between your PC and phone over your own Wi-Fi",
    ],
    readme:
      "About 20 tools in one tab. Some run fully in the browser with PyScript, like the image converter, EXIF stripper and regex tester. The rest run on a local Flask server, like the PDF tools, OCR, Whisper transcription and Local Drop.",
    stack: ["Python", "Flask", "PyScript / Pyodide", "PyMuPDF", "Whisper", "OCR"],
    code: "https://github.com/HasanIsTrying/OfflineOffice",
  },
];
