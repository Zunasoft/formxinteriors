// Journal content for /journal/ (the wall) and /journal/<slug>/ (a post).
// Ported from the "formx-journal" mockups; the drawings and posts are shared by both pages.

// Line drawings, all on a 400 x 240 sheet: shell lines, orange for the point being made, mono labels.
// Inner SVG markup; components/JournalArt.js draws it.
export const ART = {
  // section through a room: ambient downlight, task pendant over the table (orange), accent washer on the wall
  light: '<path class="lnf soft" d="M12 22H388M12 214H388M388 22V214"/>' +
    '<rect class="fc" x="62" y="22" width="26" height="5"/><path class="cone" d="M66 27L18 214H140L84 27Z"/>' +
    '<path class="lnf soft" d="M216 22V82"/><path class="accf" d="M198 96H234L226 82H206Z"/><path class="cone acc" d="M202 96L176 160H256L230 96Z"/>' +
    '<path class="lnf" d="M166 160H266M174 160V214M258 160V214"/>' +
    '<rect class="fc" x="322" y="22" width="26" height="5"/><path class="cone" d="M328 27L388 84V170L344 27Z"/>' +
    '<text x="79" y="233" text-anchor="middle">AMBIENT</text><text x="216" y="233" text-anchor="middle" class="tacc">TASK</text><text x="356" y="233" text-anchor="middle">ACCENT</text>',
  // colour temperature: warm for living rooms and bedrooms, neutral where you work
  kelvin: '<path class="lnf soft" d="M40 76V70H168V76"/><text x="104" y="62" text-anchor="middle">LIVING · BEDROOM</text>' +
    '<path class="lnf acc" d="M232 76V70H296V76"/><text x="264" y="62" text-anchor="middle" class="tacc">KITCHEN · STUDY</text>' +
    '<rect x="40" y="84" width="64" height="56" fill="#FFA957"/><rect x="104" y="84" width="64" height="56" fill="#FFB46B"/><rect x="168" y="84" width="64" height="56" fill="#FFC489"/>' +
    '<rect x="232" y="84" width="64" height="56" fill="#FFD1A3"/><rect x="296" y="84" width="64" height="56" fill="#FFE4CE"/>' +
    '<path class="lnf soft" d="M72 140V148M136 140V148M200 140V148M264 140V148M328 140V148"/>' +
    '<text x="72" y="164" text-anchor="middle">2700 K</text><text x="136" y="164" text-anchor="middle">3000 K</text><text x="200" y="164" text-anchor="middle">3500 K</text>' +
    '<text x="264" y="164" text-anchor="middle" class="tacc">4000 K</text><text x="328" y="164" text-anchor="middle">5000 K</text>' +
    '<text x="40" y="200" class="tsoft">WARMER</text><text x="360" y="200" text-anchor="end" class="tsoft">COOLER</text><path class="lnf soft" d="M100 197H300"/>',
  // a flat plan: the wet zones in orange
  zones: '<rect class="lnf" x="16" y="16" width="368" height="208"/><path class="lnf" d="M176 16V112M16 112H120M16 144H120V224M236 16V224"/>' +
    '<rect class="lnf soft" x="16" y="16" width="160" height="24"/><rect class="lnf soft" x="16" y="40" width="24" height="72"/>' +
    '<rect class="zone" x="84" y="16" width="44" height="24"/><rect class="lnf" x="94" y="21" width="24" height="14" rx="3"/>' +
    '<rect class="zone" x="30" y="144" width="62" height="22"/>' +
    '<rect class="lnf soft" x="356" y="40" width="28" height="160"/><path class="lnf acc" d="M356 40V200" stroke-width="3"/>' +
    '<path class="lnf soft" d="M344 58H356M344 186H356"/>' +
    '<text x="106" y="60" text-anchor="middle" class="tacc">BWP</text><text x="61" y="186" text-anchor="middle" class="tacc">BWP</text>' +
    '<text x="340" y="61" text-anchor="end">MR</text><text x="340" y="189" text-anchor="end" class="tacc">HDHMR</text>' +
    '<text x="108" y="98" text-anchor="middle" class="tsoft">KITCHEN</text><text x="68" y="212" text-anchor="middle" class="tsoft">BATH</text><text x="292" y="212" text-anchor="middle" class="tsoft">BEDROOM</text>',
  // the stamp on a sheet of ply
  stamp: '<rect class="lnf" x="40" y="30" width="320" height="180"/>' +
    '<path class="lnf soft" d="M40 58C120 52 200 64 360 56M40 172C140 164 220 180 360 170M40 196C150 188 250 202 360 194"/>' +
    '<rect class="lnf acc" x="96" y="72" width="176" height="82"/>' +
    '<text x="110" y="96">BRAND</text><text x="110" y="118">GRADE <tspan class="tacc">BWP</tspan></text><text x="110" y="140">THICKNESS 19 MM</text>',
  // a quote that names every board and fitting, and one line that does not
  quote: '<rect class="lnf" x="88" y="12" width="224" height="216"/><text x="104" y="34">QUOTE · KITCHEN</text><path class="lnf soft" d="M104 44H296"/>' +
    '<text x="104" y="66">CARCASS</text><text x="296" y="66" text-anchor="end">BWP · 19 MM</text>' +
    '<text x="104" y="90">SHUTTERS</text><text x="296" y="90" text-anchor="end">HDHMR · 18 MM</text>' +
    '<text x="104" y="114">HINGES</text><text x="296" y="114" text-anchor="end">SOFT-CLOSE · MODEL</text>' +
    '<text x="104" y="138">CHANNELS</text><text x="296" y="138" text-anchor="end">FULL EXTENSION</text>' +
    '<path class="lnf soft" d="M104 74H296M104 98H296M104 122H296M104 146H296"/>' +
    '<text x="104" y="170" class="tacc">PLY</text><text x="296" y="170" text-anchor="end" class="tacc">?</text><path class="lnf acc dash" d="M104 178H296"/>' +
    '<text x="104" y="210" class="tsoft">EXCLUSIONS LISTED BELOW</text>',
  // plan of a wardrobe: 600 deep, 500 hanger, shutters in orange
  robe: '<path class="lnf soft" d="M40 40V180M32 40H48M32 180H48"/><text transform="translate(24 110) rotate(-90)" text-anchor="middle">600</text>' +
    '<rect class="lnf" x="64" y="40" width="292" height="140"/><path class="lnf soft dash" d="M72 110H348"/>' +
    '<path class="lnf" d="M96 52V168M124 52V168M152 52V168M180 52V168M208 52V168M236 52V168M264 52V168M292 52V168M320 52V168"/>' +
    '<path class="lnf acc" d="M64 180H356" stroke-width="3"/>' +
    '<path class="lnf soft" d="M372 52V168M364 52H380M364 168H380"/><text transform="translate(392 110) rotate(-90)" text-anchor="middle">500</text>' +
    '<text x="210" y="30" text-anchor="middle" class="tsoft">BACK WALL</text><text x="210" y="204" text-anchor="middle" class="tacc">SHUTTERS</text>',
  // elevation: a double-hang bay, shelves, and one bay at full height
  hang: '<rect class="lnf" x="70" y="20" width="260" height="200"/><path class="lnf" d="M157 20V220M244 20V220"/>' +
    '<path class="lnf" d="M78 36H149M78 140H149"/><path class="lnf soft" d="M90 36V122M102 36V126M114 36V120M126 36V124M138 36V118M90 140V206M102 140V210M114 140V204M126 140V208M138 140V202"/>' +
    '<path class="lnf soft" d="M157 60H244M157 100H244M157 140H244M157 180H244"/>' +
    '<path class="lnf" d="M252 36H322"/><path class="lnf acc" d="M264 36V196M278 36V200M292 36V194M306 36V198"/>' +
    '<path class="lnf soft" d="M56 36V124M50 36H62M50 124H62"/><text transform="translate(44 80) rotate(-90)" text-anchor="middle">≈ 1000</text>' +
    '<path class="lnf acc" d="M346 36V196M340 36H352M340 196H352"/><text transform="translate(362 116) rotate(-90)" text-anchor="middle" class="tacc">≈ 1500</text>',
  // plan of a sliding wardrobe: two tracks need 650
  slide: '<path class="lnf soft" d="M40 30V190M32 30H48M32 190H48"/><text transform="translate(24 110) rotate(-90)" text-anchor="middle" class="tacc">650</text>' +
    '<rect class="lnf" x="64" y="30" width="292" height="160"/>' +
    '<path class="lnf" d="M96 42V158M124 42V158M152 42V158M180 42V158M208 42V158M236 42V158M264 42V158M292 42V158M320 42V158"/>' +
    '<path class="lnf soft" d="M64 168H356M64 180H356"/><path class="lnf acc" d="M64 180H214M206 168H356" stroke-width="3"/>' +
    '<text x="210" y="210" text-anchor="middle" class="tacc">TWO TRACKS</text>',
  // an L kitchen with the working triangle
  triangle: '<rect class="lnf soft" x="40" y="16" width="320" height="208"/><rect class="lnf" x="40" y="16" width="320" height="36"/><rect class="lnf" x="40" y="52" width="36" height="172"/>' +
    '<rect class="lnf" x="186" y="22" width="44" height="24" rx="4"/>' +
    '<circle class="lnf" cx="300" cy="28" r="5"/><circle class="lnf" cx="318" cy="28" r="5"/><circle class="lnf" cx="300" cy="42" r="5"/><circle class="lnf" cx="318" cy="42" r="5"/>' +
    '<rect class="lnf" x="44" y="170" width="28" height="40"/>' +
    '<path class="lnf acc dash" d="M208 34L309 35L58 190Z"/><circle class="accf" cx="208" cy="34" r="3.5"/><circle class="accf" cx="309" cy="35" r="3.5"/><circle class="accf" cx="58" cy="190" r="3.5"/>' +
    '<text x="208" y="70" text-anchor="middle">SINK</text><text x="309" y="70" text-anchor="middle">HOB</text><text x="88" y="196">FRIDGE</text>' +
    '<text x="196" y="136" class="tacc">EACH LEG 1.2–2.7 M</text>',
  // elevation of a counter
  counter: '<path class="lnf soft" d="M30 214H370"/><rect class="lnf" x="80" y="124" width="240" height="90"/><path class="lnf soft" d="M160 124V214M240 124V214"/>' +
    '<rect class="fc" x="76" y="118" width="248" height="6" opacity=".6"/><rect class="lnf" x="80" y="24" width="240" height="56"/><path class="lnf soft" d="M160 24V80M240 24V80"/>' +
    '<path class="lnf acc" d="M56 118V214M48 118H64M48 214H64"/><text transform="translate(40 166) rotate(-90)" text-anchor="middle" class="tacc">850–900</text>' +
    '<text x="200" y="110" text-anchor="middle" class="tsoft">COUNTER</text>',
  // a parallel kitchen and the space between its counters
  aisle: '<rect class="lnf soft" x="30" y="20" width="340" height="200"/><rect class="lnf" x="30" y="20" width="340" height="44"/><rect class="lnf" x="30" y="176" width="340" height="44"/>' +
    '<path class="lnf acc" d="M200 64V176M192 64H208M192 176H208"/><text x="214" y="124" class="tacc">1000–1200</text>' +
    '<text x="44" y="46" class="tsoft">COUNTER</text><text x="44" y="202" class="tsoft">COUNTER</text>',
  // an A4 sample next to a chip
  swatch: '<rect class="lnf" x="70" y="34" width="105" height="148"/>' +
    '<path class="lnf soft" d="M70 58C110 54 140 62 175 56M70 92C100 86 150 98 175 90M70 128C110 122 140 132 175 126M70 162C100 156 150 168 175 160"/>' +
    '<rect class="lnf acc" x="252" y="144" width="30" height="38"/>' +
    '<text x="122" y="206" text-anchor="middle">A4 · 210 × 297</text><text x="267" y="206" text-anchor="middle" class="tacc">CHIP</text>',
  // design, then 48 days from sign-off to keys
  timeline: '<path class="lnf soft" d="M30 120H110" stroke-width="3"/><path class="lnf acc" d="M110 120H356" stroke-width="3"/><path class="lnf soft" d="M280 110V130"/>' +
    '<circle class="accf" cx="110" cy="120" r="5.5"/><circle class="accf" cx="356" cy="120" r="5.5"/>' +
    '<text x="70" y="100" text-anchor="middle" class="tsoft">DESIGN</text><text x="196" y="100" text-anchor="middle">BUILD</text><text x="318" y="100" text-anchor="middle">DELIVER</text>' +
    '<text x="110" y="152" text-anchor="middle" class="tacc">SIGN-OFF · DAY 0</text><text x="356" y="152" text-anchor="end" class="tacc">KEYS · DAY 48</text>',
  // a drawer on a full-extension channel and one on a partial channel
  drawer: '<rect class="lnf" x="40" y="40" width="150" height="160"/>' +
    '<rect class="lnf acc" x="190" y="54" width="150" height="50"/><path class="lnf soft" d="M44 108H340"/>' +
    '<rect class="fs" x="120" y="134" width="70" height="50"/><rect class="lnf" x="120" y="134" width="150" height="50"/><path class="lnf soft" d="M44 188H270"/>' +
    '<text x="265" y="42" text-anchor="middle" class="tacc">FULL EXTENSION</text><text x="195" y="212" text-anchor="middle" class="tsoft">PARTIAL</text>',
  // a room measured on site
  plan: '<rect class="lnf" x="70" y="40" width="260" height="150"/><path class="lnf" d="M150 36V44M250 36V44M150 40H250"/>' +
    '<path class="lnf soft" d="M270 190V150A40 40 0 0 1 310 190"/>' +
    '<path class="lnf acc" d="M70 22H330M70 16V28M330 16V28"/><text x="200" y="14" text-anchor="middle" class="tacc">4200</text>' +
    '<path class="lnf acc" d="M52 40V190M46 40H58M46 190H58"/><text transform="translate(40 115) rotate(-90)" text-anchor="middle" class="tacc">3600</text>' +
    '<text x="200" y="216" text-anchor="middle" class="tsoft">MEASURED ON SITE</text>'
};

// Renders in public/images/journal/, with their sizes (the post page frames close-ups on them).
export const IMG = {
  corporate: [1400, 786], emerald: [1400, 786], "project-001": [1200, 844], "project-004": [1200, 844],
  "project-b115": [1332, 844], "project-mbr": [1332, 844], rajan: [1254, 815],
};
export const imgSrc = (k) => `/images/journal/${k}.jpg`;

// Each section shows one visual: a render { img, x, y, z } (x, y = point to centre, z = zoom),
// a drawing { art } from ART, or a figure { fig }. `tile` sets how the post looks on the wall.
// related.kind: project (a /projects/ slug), post (a journal slug) or site (a path on this site).
export const POSTS = [
  { slug: "light-in-three-layers", cat: "Lighting", title: "Light a room in three <em>layers</em>.", name: "Light a room in three layers",
    dek: "Most rooms get one row of downlights. Three layers make the same room work at noon, at dinner and at midnight.",
    tile: "photo", cover: { img: "rajan", x: 0.62, y: 0.4, z: 1.3 },
    related: { kind: "project", slug: "rajan-residence-villa-financial-district", name: "Rajan Residence" },
    sections: [
      { h: "Ambient", p: "The base light you see the room by, from downlights, a cove or a ceiling fixture. Spread it evenly and put it on a dimmer.", v: { img: "corporate", x: 0.4, y: 0.08, z: 1.8 } },
      { h: "Task", p: "Light aimed at what your hands are doing, over the counter, the desk or the dining table. It sits lower and brighter than the ambient layer.", v: { img: "project-001", x: 0.08, y: 0.1, z: 2.2 } },
      { h: "Accent", p: "Light that picks out a niche, a shelf or a wall. It gives the room depth after dark and makes the joinery read.", v: { img: "rajan", x: 0.62, y: 0.4, z: 1.6 } },
      { h: "Colour of light", p: "Warm white, around 2700 to 3000 K, suits living rooms and bedrooms. Neutral white, around 4000 K, suits the places you work, such as the kitchen counter.", v: { art: "kelvin" } },
      { h: "Before the ceiling closes", p: "Every layer needs a wire and a switch in the right place. Mark them on the drawing before the false ceiling goes up.", v: { art: "light" } }
    ] },
  { slug: "ply-by-zone", cat: "Materials", title: "Ply by <em>zone</em>.", name: "Ply by zone",
    dek: "Not every cabinet needs the same board. Match the board to the water it will see.",
    tile: "shell", spec: [["BWP", "Wet zones: sink, vanity"], ["MR", "Everywhere else"], ["HDHMR", "Shutters"]], cover: { art: "zones" },
    related: { kind: "project", slug: "pranithi-residence-apartment-narsingi", name: "Pranithi Residence" },
    sections: [
      { h: "BWP in wet zones", p: "Boiling-water-proof ply goes under the sink, around the dishwasher and into bathroom vanities. These cabinets meet water every day.", v: { art: "zones" } },
      { h: "MR everywhere else", p: "Moisture-resistant ply is the right board for dry rooms: wardrobes, TV units, study tables. BWP there costs more and adds little.", v: { img: "project-004", x: 0.12, y: 0.4, z: 1.8 } },
      { h: "HDHMR for shutters", p: "Shutters are large, thin and opened every day. A dense, moisture-resistant board like HDHMR holds its shape and takes a clean profile.", v: { img: "project-mbr", x: 0.95, y: 0.45, z: 2.0 } },
      { h: "Read the stamp", p: "Each sheet is stamped with its brand, grade and thickness. Check the stamp on site before the carpenter cuts.", v: { art: "stamp" } },
      { h: "Name it in the quote", p: "Brand, grade and thickness for every board, line by line. If a quote says ply and nothing else, ask.", v: { art: "quote" } }
    ] },
  { slug: "wardrobes-need-600-mm", cat: "Planning", title: "Wardrobes need <em>600 mm</em>.", name: "Wardrobes need 600 mm",
    dek: "Depth is the one wardrobe number you cannot fix later.",
    tile: "draw", cover: { art: "robe" },
    related: { kind: "site", href: "/projects/", name: "See the projects" },
    sections: [
      { h: "600 mm deep", p: "A hanger needs about 500 mm. Add the shutter and a little air, and 600 is the depth that works.", v: { art: "robe" } },
      { h: "Hanging heights", p: "Shirts and jackets need about a metre of drop. Long dresses and kurtas need closer to 1.5 m, so give one bay the full height.", v: { art: "hang" } },
      { h: "Sliding needs more", p: "Sliding shutters run on two tracks inside the carcass. Plan around 650 mm of depth so the hangers clear both doors.", v: { art: "slide" } },
      { h: "Light inside", p: "A profile light that comes on as the shutter opens. You will use it every morning.", v: { img: "project-004", x: 0.8, y: 0.35, z: 1.9 } }
    ] },
  { slug: "kitchen-triangle", cat: "Planning", title: "Keep the kitchen triangle <em>tight</em>.", name: "Keep the kitchen triangle tight",
    dek: "Sink, hob and fridge decide how many steps every meal takes.",
    tile: "draw", wide: true, cover: { art: "triangle" },
    related: { kind: "post", slug: "ply-by-zone", name: "Ply by zone" },
    sections: [
      { h: "The triangle", p: "Draw a line from the sink to the hob to the fridge. Each leg works best between 1.2 and 2.7 m.", v: { art: "triangle" } },
      { h: "Counter height", p: "Most counters sit between 850 and 900 mm. Set yours to the person who cooks most.", v: { art: "counter" } },
      { h: "Room to pass", p: "Leave 1,000 to 1,200 mm between facing counters, so two people can work without trading places.", v: { art: "aisle" } },
      { h: "Water and heat", p: "Keep the hob away from the fridge, and build the sink cabinet in BWP ply. Heat and water are what age a kitchen first.", v: { art: "zones" } }
    ] },
  { slug: "see-samples-in-your-own-light", cat: "Materials", title: "See samples in your own <em>light</em>.", name: "See samples in your own light",
    dek: "A laminate chosen under showroom lights is a different colour at home.",
    tile: "photo", cover: { img: "project-b115", x: 0.48, y: 0.35, z: 1.4 },
    related: { kind: "site", href: "/projects/", name: "See the projects" },
    sections: [
      { h: "Noon and night", p: "Hold the sample by your window at noon, then under your own lamps after dark. Choose the one you still like in both.", v: { img: "project-b115", x: 0.48, y: 0.35, z: 1.7 } },
      { h: "Warm or neutral bulbs", p: "Warm white pushes woods towards orange; neutral white makes greys look cooler. Test under the bulbs you will actually fit.", v: { art: "kelvin" } },
      { h: "Big enough to judge", p: "A thumb-sized chip hides the grain. Ask for a sample at least the size of an A4 sheet.", v: { art: "swatch" } },
      { h: "Matte or gloss", p: "Gloss shows every fingerprint on a kitchen shutter; matte hides them. Keep gloss for doors you rarely touch.", v: { img: "project-004", x: 0.12, y: 0.4, z: 1.8 } }
    ] },
  { slug: "what-48-48-means", cat: "Process", title: "What <em>48/48</em> means.", name: "What 48/48 means",
    dek: "Two numbers Form X holds itself to on every project.",
    tile: "fig", fig: "48<em>/</em>48", cover: { art: "timeline" },
    related: { kind: "site", href: "/#book-visit", name: "Book a free consultation" },
    sections: [
      { h: "48 hours to act", p: "Any service call, any time after handover, gets action within 48 hours.", v: { fig: "48<em>h</em>" } },
      { h: "48 days to handover", p: "From drawing sign-off to keys, for a standard 3BHK.", v: { art: "timeline" } },
      { h: "When the clock starts", p: "The count begins when you sign off the drawings. Scope is locked from there, which is what lets the date hold.", v: { art: "plan" } },
      { h: "Bigger scope, more days", p: "A villa or a larger flat adds days. The number is agreed with you before work starts.", v: { fig: "48<em>+</em>" } }
    ] },
  { slug: "spend-on-hinges-and-channels", cat: "Materials", title: "Spend on hinges and <em>channels</em>.", name: "Spend on hinges and channels",
    dek: "Boards sit still. Hinges and channels move every day, and that is where a cheap job shows first.",
    tile: "photo", cover: { img: "project-mbr", x: 0.95, y: 0.45, z: 1.5 },
    related: { kind: "site", href: "/projects/", name: "See the projects" },
    sections: [
      { h: "Soft-close hinges", p: "A damper in the hinge stops the shutter slamming and spares the board around the screws.", v: { img: "project-mbr", x: 0.95, y: 0.45, z: 2.0 } },
      { h: "Full-extension channels", p: "Drawers that open all the way, so the back of the drawer is as easy to reach as the front.", v: { art: "drawer" } },
      { h: "Rated for the load", p: "Kitchen drawers full of steel and crockery need channels rated for the weight. Ask for the rating as well as the brand.", v: { img: "project-001", x: 0.7, y: 0.5, z: 1.8 } },
      { h: "Named in the quote", p: "Brand and model for every hinge and channel, so what gets fitted is what you approved.", v: { art: "quote" } }
    ] },
  { slug: "read-a-quote-line-by-line", cat: "Process", title: "Read a quote line by <em>line</em>.", name: "Read a quote line by line",
    dek: "A single number per room hides the choices that decide how long your interiors last.",
    tile: "line", cover: { art: "quote" },
    related: { kind: "site", href: "/#cost-calculator", name: "See your number" },
    sections: [
      { h: "Every board named", p: "Brand, grade and thickness for each board. Ply on its own is not a specification.", v: { art: "stamp" } },
      { h: "Every finish named", p: "Laminate or veneer, with the brand and the catalogue code you approved.", v: { art: "swatch" } },
      { h: "Every fitting named", p: "Hinges, channels and handles, each by brand and model.", v: { img: "project-mbr", x: 0.95, y: 0.45, z: 2.0 } },
      { h: "What is left out", p: "Electrical work, painting, civil changes and appliances often sit outside the quote. Ask for the exclusions in writing.", v: { art: "quote" } },
      { h: "A drawing to match", p: "The quote should follow a measured drawing, so every line has a place on the plan.", v: { art: "plan" } }
    ] }
];

export const href = (p) => `/journal/${p.slug}/`;
export const plain = (html) => html.replace(/<[^>]+>/g, "");

// short, slow reads: a minute per ninety words, with time to look at each visual
export function readMin(p) {
  const words = (p.dek + " " + p.sections.map((s) => s.h + " " + s.p).join(" ")).split(/\s+/).length;
  return Math.max(2, Math.round(words / 90));
}

export function postBySlug(slug) {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const n = POSTS.length;
  return { p: POSTS[i], i, prev: POSTS[(i - 1 + n) % n], next: POSTS[(i + 1) % n] };
}

export function relatedHref(r) {
  return r.kind === "project" ? `/projects/${r.slug}/` : r.kind === "post" ? `/journal/${r.slug}/` : r.href;
}
