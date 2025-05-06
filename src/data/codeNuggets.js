const codeNuggets = [
  "Python’s name was inspired by Monty Python’s Flying Circus, a nod to humor in coding",
  "A moth stuck in a Harvard Mark II relay in 1947 became the original \"debugging\" bug",
  "JavaScript was coded in 10 days by Brendan Eich in 1995 for Netscape’s browser",
  "The word \"algorithm\" traces back to Persian mathematician Al-Khwarizmi’s name",
  "Java aimed to power interactive TV before becoming a programming staple",
  "Ada Lovelace wrote the earliest computer programs in the 1840s for Babbage’s machine",
  "Over 700 programming languages exist, from COBOL to modern Rust",
  "*Spacewar!*, a 1961 MIT project, kicked off video game history",
  "CSS, proposed by Håkon Wium Lie in 1994, revolutionized web styling",
  "Linux’s penguin mascot, Tux, was picked after Linus Torvalds’ fondness for penguins",
  "Mark Zuckerberg hacked together *Facemash*, Facebook’s precursor, in one Harvard night",
  "The World Wide Web’s debut page in 1991 explained its own purpose",
  "\"Byte\" was coined by Werner Buchholz in 1956 to mean eight bits",
  "C, born in 1972 at Bell Labs, shaped modern programming languages",
  "Ray Tomlinson chose the @ symbol for email addresses in 1971",
  "QWERTY keyboards were designed to prevent typewriter jams in the 1870s",
  "Apple I, sold in 1976, was just a circuit board for hobbyists",
  "\"Hacker\" once meant a clever coder, not a cybercriminal, in MIT’s 1960s culture",
  "Douglas Engelbart’s 1964 wooden mouse had only one button",
  "UNIX, developed at Bell Labs, became the backbone of modern operating systems",
  "Windows 1.0, launched in 1985, introduced overlapping windows to PCs",
  "The 2007 iPhone lacked an App Store, relying on web apps initially",
  "\"Open source\" was coined in 1998 to describe freely shared code",
  "*Symbolics.com* became the internet’s earliest registered domain in 1985",
  "USB, standardized in 1996, was co-developed by Intel and Microsoft",
  "\"Cloud computing\" emerged as a buzzword around Amazon’s AWS launch in 2006",
  "The *Creeper* virus of 1971 spread harmless messages on ARPANET",
  "*Archie*, a 1990 tool, indexed FTP files, predating modern search engines",
  "Linus Torvalds shared Linux’s source code in 1991 as a student project",
  "\"Internet\" appeared in a 1974 TCP/IP paper, defining a global network",
  "IBM’s Simon, a 1994 touchscreen phone, doubled as a pager",
  "GIFs, invented by Steve Wilhite in 1987, were limited to 256 colors",
  "Plankalkül, a 1945 language by Konrad Zuse, predates modern coding",
  "ELIZA, a 1966 chatbot, mimicked a therapist with simple pattern matching",
  "IBM’s 1956 hard drive weighed a ton and stored just 3.75 MB",
  "\"Wi-Fi\" is a marketing term, not an acronym, coined in 1999",
  "HTC Dream, the 2008 Android pioneer, featured a slide-out keyboard",
  "A 1 GB USB drive in 2000 cost as much as a laptop",
  "HTML, proposed in 1989, gave the web its structure",
  "The Morris Worm of 1988 slowed 10% of the internet’s computers",
  "\"Spam\" email got its name from a Monty Python sketch about unwanted meat",
  "PHP, created by Rasmus Lerdorf, started as a personal webpage tool in 1994",
  "IBM’s Deep Blue defeated chess champion Garry Kasparov in 1997",
  "Emojis began in 1999 with Shigetaka Kurita’s 176 tiny icons",
  "Raspberry Pi, launched in 2012, made computing accessible for $35",
  "Chuck Hull’s 1984 3D printer used resin hardened by UV light",
  "\"Big data\" describes datasets too large for traditional processing, a 2000s term",
  "Git, born in 2005, was Linus Torvalds’ response to a version control dispute",
  "The 1984 Macintosh had 128 KB of RAM and no hard drive",
  "\"Debugging\" became a term after engineers taped a moth into a logbook",
  "SQL, developed by IBM, standardized database queries in the 1970s",
  "The GRiD Compass laptop of 1982 cost $8,150 and weighed 11 pounds",
  "\"API\" dates to 1960s computing, enabling software to communicate",
  "Xerox Alto’s 1973 GUI inspired Apple’s Macintosh interface",
  "Ruby, released in 1995, prioritized coder happiness over machine efficiency",
  "Jaron Lanier popularized \"virtual reality\" in the 1980s with bulky headsets",
  "A 1991 webcam watched a Cambridge coffee pot to save trips",
  "Node.js, launched in 2009, brought JavaScript to server-side coding",
  "\"Machine learning\" was named by Arthur Samuel during a 1959 checkers project",
  "Apple II’s 1977 color display made it a hit for schools",
  "MySQL, born in 1995, powers much of the web’s backend",
  "\"Blockchain\" entered tech lexicon with Bitcoin’s 2008 whitepaper",
  "The 1998 MPMan F10 MP3 player held eight songs",
  "POSTGRES, now PostgreSQL, pioneered extensible databases in 1986",
  "Web \"cookies\" got their name from fortune-telling programs in 1994",
  "IBM’s 1971 floppy disk stored 80 KB on an 8-inch disk",
  "Swift, Apple’s 2014 language, replaced Objective-C for iOS apps",
  "\"Firewall\" entered computing in the 1980s, inspired by physical barriers",
  "IBM’s 2001 WatchPad smartwatch ran Linux but flopped commercially",
  "MongoDB, launched in 2009, embraced NoSQL for flexible data storage",
  "\"DevOps\" merged development and operations, coined in 2009",
  "NEC’s 1988 PC-8801 introduced CD-ROMs to personal computing",
  "Go, Google’s 2009 language, emphasizes simplicity and concurrency",
  "\"Microservices\" describe apps built as small, independent components, a 2014 trend",
  "The 1962 Bell 103 modem connected computers at 300 bits per second",
  "TypeScript, Microsoft’s 2012 creation, adds types to JavaScript",
  "Quantum computing concepts emerged from Paul Benioff’s 1980s theories",
  "Apple’s PowerBook 500 introduced the touchpad in 1994",
  "Kotlin, JetBrains’ 2016 language, became Android’s preferred choice",
  "The Agile Manifesto of 2001 redefined software development with flexibility",
  "Cray X-MP’s 1984 SSDs were lightning-fast but cost millions",
  "Rust, Mozilla’s 2010 language, prioritizes memory safety",
  "\"Dark web\" refers to hidden Tor networks, named in the 2000s",
  "The 1998 iMac G3 popularized USB ports on consumer PCs",
  "Django, a 2005 Python framework, powers Instagram’s backend",
  "Docker’s 2013 containers made app deployment portable and consistent",
  "SGI IRIS’s 1984 GPU accelerated 3D graphics for workstations",
  "Elixir, built in 2011, leverages Erlang for scalable web apps",
  "\"Deep learning\" gained fame through Geoffrey Hinton’s 2006 neural network work",
  "IBM ThinkPad’s 2001 Bluetooth support was a wireless milestone",
  "Laravel, a 2011 PHP framework, simplified elegant web development",
  "AWS Lambda’s 2014 launch popularized \"serverless\" computing",
  "Connectix QuickCam, a 1994 webcam, captured grainy grayscale images",
  "React, Facebook’s 2013 library, transformed web UI development",
  "\"Edge computing\" processes data closer to devices, a 2010s concept",
  "HP iPAQ’s 2002 fingerprint scanner was a security novelty",
  "Vue.js, created by Evan You in 2014, balances simplicity and power",
  "\"Metaverse\" originated in Neal Stephenson’s 1992 sci-fi novel *Snow Crash*",
  "IBM’s 1961 Shoebox recognized 16 spoken words",
  "TensorFlow, Google’s 2015 framework, democratized machine learning"
];

const categorizedNuggets = {
  // Programming languages history and trivia
  languages: [
    "Python's name was inspired by Monty Python's Flying Circus, a nod to humor in coding",
    "JavaScript was coded in 10 days by Brendan Eich in 1995 for Netscape's browser",
    "Java aimed to power interactive TV before becoming a programming staple",
    "C, born in 1972 at Bell Labs, shaped modern programming languages",
    "Plankalkül, a 1945 language by Konrad Zuse, predates modern coding",
    "Ruby, released in 1995, prioritized coder happiness over machine efficiency",
    "Swift, Apple's 2014 language, replaced Objective-C for iOS apps",
    "Go, Google's 2009 language, emphasizes simplicity and concurrency",
    "TypeScript, Microsoft's 2012 creation, adds types to JavaScript",
    "Kotlin, JetBrains' 2016 language, became Android's preferred choice",
    "Rust, Mozilla's 2010 language, prioritizes memory safety",
    "Elixir, built in 2011, leverages Erlang for scalable web apps"
  ],
  
  // Computing history and pioneers
  pioneers: [
    "Ada Lovelace wrote the earliest computer programs in the 1840s for Babbage's machine",
    "The word \"algorithm\" traces back to Persian mathematician Al-Khwarizmi's name",
    "Douglas Engelbart's 1964 wooden mouse had only one button",
    "Linus Torvalds shared Linux's source code in 1991 as a student project",
    "Mark Zuckerberg hacked together *Facemash*, Facebook's precursor, in one Harvard night",
    "Ray Tomlinson chose the @ symbol for email addresses in 1971",
    "Xerox Alto's 1973 GUI inspired Apple's Macintosh interface",
    "Jaron Lanier popularized \"virtual reality\" in the 1980s with bulky headsets",
    "\"Machine learning\" was named by Arthur Samuel during a 1959 checkers project",
    "Chuck Hull's 1984 3D printer used resin hardened by UV light",
    "Evan You created Vue.js in 2014, balancing simplicity and power"
  ],
  
  // Web development milestones
  webDev: [
    "CSS, proposed by Håkon Wium Lie in 1994, revolutionized web styling",
    "The World Wide Web's debut page in 1991 explained its own purpose",
    "HTML, proposed in 1989, gave the web its structure",
    "PHP, created by Rasmus Lerdorf, started as a personal webpage tool in 1994",
    "Web \"cookies\" got their name from fortune-telling programs in 1994",
    "Node.js, launched in 2009, brought JavaScript to server-side coding",
    "MySQL, born in 1995, powers much of the web's backend",
    "\"Open source\" was coined in 1998 to describe freely shared code",
    "POSTGRES, now PostgreSQL, pioneered extensible databases in 1986",
    "Django, a 2005 Python framework, powers Instagram's backend",
    "Laravel, a 2011 PHP framework, simplified elegant web development",
    "React, Facebook's 2013 library, transformed web UI development"
  ],
  
  // Hardware evolution
  hardware: [
    "IBM's 1956 hard drive weighed a ton and stored just 3.75 MB",
    "IBM's 1971 floppy disk stored 80 KB on an 8-inch disk",
    "The 1962 Bell 103 modem connected computers at 300 bits per second",
    "Apple I, sold in 1976, was just a circuit board for hobbyists",
    "The GRiD Compass laptop of 1982 cost $8,150 and weighed 11 pounds",
    "The 1984 Macintosh had 128 KB of RAM and no hard drive",
    "Apple II's 1977 color display made it a hit for schools",
    "NEC's 1988 PC-8801 introduced CD-ROMs to personal computing",
    "The 1998 iMac G3 popularized USB ports on consumer PCs",
    "Cray X-MP's 1984 SSDs were lightning-fast but cost millions",
    "SGI IRIS's 1984 GPU accelerated 3D graphics for workstations",
    "Raspberry Pi, launched in 2012, made computing accessible for $35"
  ],
  
  // Internet and networking history
  internetHistory: [
    "*Symbolics.com* became the internet's earliest registered domain in 1985",
    "\"Internet\" appeared in a 1974 TCP/IP paper, defining a global network",
    "The *Creeper* virus of 1971 spread harmless messages on ARPANET",
    "The Morris Worm of 1988 slowed 10% of the internet's computers",
    "*Archie*, a 1990 tool, indexed FTP files, predating modern search engines",
    "A 1991 webcam watched a Cambridge coffee pot to save trips",
    "\"Firewall\" entered computing in the 1980s, inspired by physical barriers",
    "\"Dark web\" refers to hidden Tor networks, named in the 2000s",
    "USB, standardized in 1996, was co-developed by Intel and Microsoft",
    "\"Wi-Fi\" is a marketing term, not an acronym, coined in 1999"
  ],
  
  // Mobile and personal computing
  mobileComputing: [
    "The 2007 iPhone lacked an App Store, relying on web apps initially",
    "IBM's Simon, a 1994 touchscreen phone, doubled as a pager",
    "HTC Dream, the 2008 Android pioneer, featured a slide-out keyboard",
    "IBM's 2001 WatchPad smartwatch ran Linux but flopped commercially",
    "Apple's PowerBook 500 introduced the touchpad in 1994",
    "HP iPAQ's 2002 fingerprint scanner was a security novelty",
    "IBM ThinkPad's 2001 Bluetooth support was a wireless milestone",
    "The 1998 MPMan F10 MP3 player held eight songs",
    "Connectix QuickCam, a 1994 webcam, captured grainy grayscale images"
  ],
  
  // Fun computing facts
  funFacts: [
    "A moth stuck in a Harvard Mark II relay in 1947 became the original \"debugging\" bug",
    "\"Debugging\" became a term after engineers taped a moth into a logbook",
    "Linux's penguin mascot, Tux, was picked after Linus Torvalds' fondness for penguins",
    "\"Byte\" was coined by Werner Buchholz in 1956 to mean eight bits",
    "QWERTY keyboards were designed to prevent typewriter jams in the 1870s",
    "\"Hacker\" once meant a clever coder, not a cybercriminal, in MIT's 1960s culture",
    "Emojis began in 1999 with Shigetaka Kurita's 176 tiny icons",
    "\"Spam\" email got its name from a Monty Python sketch about unwanted meat",
    "Over 700 programming languages exist, from COBOL to modern Rust",
    "GIFs, invented by Steve Wilhite in 1987, were limited to 256 colors",
    "A 1 GB USB drive in 2000 cost as much as a laptop"
  ],
  
  // Modern computing concepts
  modernConcepts: [
    "Git, born in 2005, was Linus Torvalds' response to a version control dispute",
    "\"Cloud computing\" emerged as a buzzword around Amazon's AWS launch in 2006",
    "\"Blockchain\" entered tech lexicon with Bitcoin's 2008 whitepaper",
    "\"Big data\" describes datasets too large for traditional processing, a 2000s term",
    "Docker's 2013 containers made app deployment portable and consistent",
    "\"DevOps\" merged development and operations, coined in 2009",
    "\"Microservices\" describe apps built as small, independent components, a 2014 trend",
    "AWS Lambda's 2014 launch popularized \"serverless\" computing",
    "\"Edge computing\" processes data closer to devices, a 2010s concept",
    "\"Deep learning\" gained fame through Geoffrey Hinton's 2006 neural network work",
    "TensorFlow, Google's 2015 framework, democratized machine learning",
    "The Agile Manifesto of 2001 redefined software development with flexibility",
    "\"Metaverse\" originated in Neal Stephenson's 1992 sci-fi novel *Snow Crash*"
  ],
  
  // Gaming and entertainment tech
  gaming: [
    "*Spacewar!*, a 1961 MIT project, kicked off video game history",
    "Windows 1.0, launched in 1985, introduced overlapping windows to PCs",
    "ELIZA, a 1966 chatbot, mimicked a therapist with simple pattern matching",
    "IBM's Deep Blue defeated chess champion Garry Kasparov in 1997",
    "IBM's 1961 Shoebox recognized 16 spoken words"
  ],
  
  // Database technology
  databases: [
    "SQL, developed by IBM, standardized database queries in the 1970s",
    "\"API\" dates to 1960s computing, enabling software to communicate",
    "MongoDB, launched in 2009, embraced NoSQL for flexible data storage",
    "POSTGRES, now PostgreSQL, pioneered extensible databases in 1986",
    "MySQL, born in 1995, powers much of the web's backend"
  ],
  
  // Operating systems
  operatingSystems: [
    "UNIX, developed at Bell Labs, became the backbone of modern operating systems",
    "Windows 1.0, launched in 1985, introduced overlapping windows to PCs",
    "Linux's penguin mascot, Tux, was picked after Linus Torvalds' fondness for penguins",
    "The 1984 Macintosh had 128 KB of RAM and no hard drive",
    "Quantum computing concepts emerged from Paul Benioff's 1980s theories"
  ]
};

// Function to get a random nugget
const getRandomNugget = () => {
  const randomIndex = Math.floor(Math.random() * codeNuggets.length);
  return codeNuggets[randomIndex];
};

// Get a date-based nugget from a specific category
const getDailyNugget = (category = null) => {
  const today = new Date();
  const weekNumber = getWeekNumber(today); // Get the week number
  const seed = today.getFullYear() * 100 + weekNumber; // Create seed from year and week
  
  if (category && categorizedNuggets[category]) {
    const categoryNuggets = categorizedNuggets[category];
    const nuggetIndex = seed % categoryNuggets.length;
    return categoryNuggets[nuggetIndex];
  }
  
  // Return from general list if no category specified
  const nuggetIndex = seed % codeNuggets.length;
  return codeNuggets[nuggetIndex];
};

// Helper function to get week number
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Get a random nugget from a specific category
const getRandomNuggetByCategory = (category) => {
  if (!categorizedNuggets[category]) {
    return getRandomNugget(); // Fallback to any random nugget
  }
  
  const categoryNuggets = categorizedNuggets[category];
  const randomIndex = Math.floor(Math.random() * categoryNuggets.length);
  return categoryNuggets[randomIndex];
};

// Get all available category names
const getNuggetCategories = () => {
  return Object.keys(categorizedNuggets);
};

export { 
  codeNuggets, 
  categorizedNuggets, 
  getRandomNugget, 
  getDailyNugget,
  getRandomNuggetByCategory,
  getNuggetCategories 
 };
export default codeNuggets;