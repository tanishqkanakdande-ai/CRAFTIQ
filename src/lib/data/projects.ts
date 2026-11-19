import type { ProjectPlan } from "@/lib/types";

/**
 * Starter and community project catalogue. Prices are typical USD street prices
 * for generic parts (late 2026) and are converted to the user's currency for display.
 * The mock AI engine also uses these as templates.
 */

export const smartphoneProjector: ProjectPlan = {
  id: "proj_smartphone_projector",
  slug: "diy-low-cost-smartphone-projector",
  title: "DIY Low-Cost Smartphone Projector",
  tagline: "Turn a shoebox, a magnifying lens and your phone into a movie-night projector.",
  emoji: "📽️",
  categories: ["Low-Cost Alternatives", "Recycled Materials"],
  difficulty: "Beginner",
  overview:
    "Build a simple lens projector that throws your phone's screen onto a wall at roughly 40–80 inch size in a dark room. It uses a large magnifying lens (or a Fresnel sheet) fixed to the front of a light-tight box, and a sliding phone carriage inside for focusing. No soldering or mains electricity is needed. It will not match a commercial LED projector for brightness, but it is a great first optics project and costs a fraction of the price.",
  howItWorks:
    "A convex lens bends light from the bright phone screen so it converges into a large, sharp image on the wall. Moving the phone closer to or further from the lens changes where the image comes into focus. Because a single lens flips the picture both vertically and horizontally (a 180° rotation), you lock your phone's rotation and place it upside down so the projected image appears the right way up.",
  timeHours: 2.5,
  retailComparison: { product: "Entry-level mini LED projector", priceUSD: 89 },
  hazards: ["sharp-tools", "heat", "battery"],
  cover: ["#3b82f6", "#8b5cf6"],
  source: "starter",
  likes: 2841,
  builds: 1290,
  components: [
    {
      id: "c_lens",
      name: "Magnifying lens, 100 mm+ diameter (3–5×)",
      qty: 1,
      unitPriceUSD: 7,
      purpose: "Focuses the phone screen into a large image on the wall. Bigger lens means a brighter image.",
      alternatives: [
        { name: "A4 Fresnel magnifier sheet", priceUSD: 4, note: "Flat, light and cheap. Slightly softer image but brighter for the price." },
        { name: "Old reading magnifier from a drawer", note: "Works if it is at least 75 mm wide; check it has no scratches in the centre.", household: true },
      ],
      searchQuery: "100mm glass handheld magnifying lens",
    },
    {
      id: "c_box",
      name: "Shoebox or sturdy cardboard box (~30 × 18 × 12 cm)",
      qty: 1,
      unitPriceUSD: 0,
      purpose: "The light-tight projector body.",
      alternatives: [
        { name: "Delivery box cut to size", note: "Any rigid box works; longer boxes suit lenses with a longer focal length.", household: true },
        { name: "Thin plywood or foam board", priceUSD: 6, note: "Stronger and reusable if you want a permanent build." },
      ],
    },
    {
      id: "c_black",
      name: "Matte black paper, card or acrylic paint",
      qty: 1,
      unitPriceUSD: 3,
      purpose: "Lines the inside to stop stray reflections washing out the image.",
      alternatives: [
        { name: "Black construction paper or an old black T-shirt", note: "Anything matte and dark absorbs stray light.", household: true },
        { name: "Black permanent marker", priceUSD: 2, note: "Fine for small boxes; avoid glossy black tape, which reflects." },
      ],
    },
    {
      id: "c_holder",
      name: "Phone stand or large binder clips",
      qty: 2,
      unitPriceUSD: 1,
      purpose: "Holds the phone upright on the sliding carriage.",
      alternatives: [
        { name: "Folded cardboard stand", note: "Fold a strip into a triangle and tape it to the carriage.", household: true },
        { name: "Wooden clothes pegs", note: "Two pegs glued to a card base make a good cradle.", household: true },
      ],
    },
    {
      id: "c_carriage",
      name: "Cardboard carriage (inner box or folded card sled)",
      qty: 1,
      unitPriceUSD: 0,
      purpose: "Lets you slide the phone back and forth to focus.",
      alternatives: [{ name: "Smaller box that fits snugly inside", note: "A tissue box often slides perfectly inside a shoebox.", household: true }],
    },
    {
      id: "c_tape",
      name: "Strong tape and craft glue",
      qty: 1,
      unitPriceUSD: 3,
      purpose: "Seals light leaks and fixes the lens in place.",
      alternatives: [{ name: "Duct tape you already own", note: "Use black or dark tape on the inside.", household: true }],
    },
    {
      id: "c_fan",
      name: "5 V USB mini fan (40–60 mm)",
      qty: 1,
      unitPriceUSD: 4,
      purpose: "Optional: moves air through the box so your phone stays cool during long films.",
      alternatives: [{ name: "Extra vent holes only", note: "For films under an hour, two large vent holes are usually enough.", household: true }],
      optional: true,
      searchQuery: "5V USB mini cooling fan 50mm",
    },
    {
      id: "c_screen",
      name: "White wall, bedsheet or white poster board",
      qty: 1,
      unitPriceUSD: 0,
      purpose: "Projection surface. Smooth and matte white gives the brightest, sharpest image.",
      alternatives: [{ name: "Blackout-cloth backed white fabric", priceUSD: 8, note: "Absorbs less light than a thin sheet." }],
      optional: true,
    },
  ],
  tools: [
    { name: "Craft knife or box cutter", note: "Use a fresh blade and a cutting mat." },
    { name: "Steel ruler and pencil" },
    { name: "Scissors" },
    { name: "Hot glue gun", optional: true, note: "Fastest way to fix the lens. Tape works too." },
    { name: "Torch or desk lamp", note: "Used to find the lens focal length safely." },
  ],
  wiring: {
    summary:
      "The basic projector needs no wiring at all. If you add the optional cooling fan, it simply plugs into a USB power bank kept outside the box.",
    nodes: ["USB power bank", "5V USB fan"],
    connections: [
      { from: "USB power bank", fromPin: "USB 5V", to: "5V USB fan", toPin: "VCC (red)", wire: "red" },
      { from: "USB power bank", fromPin: "USB GND", to: "5V USB fan", toPin: "GND (black)", wire: "black" },
    ],
    notes: [
      "Keep the power bank outside the box so it never heats up next to the phone.",
      "Mount the fan to blow air out of the box at the back, with an intake hole near the front.",
    ],
  },
  steps: [
    {
      id: "s1",
      title: "Find your lens focal length",
      detail:
        "In a dim room, hold the lens between a lit lamp and a wall. Move it until a sharp image of the lamp appears on the wall. Measure the distance from the lens to the wall; that is roughly the focal length (usually 15–25 cm for a 3–5× lens). Your phone will sit a little further than this from the lens.",
      minutes: 10,
      warning: "Never test with sunlight. A magnifying lens can focus sunlight into a point hot enough to start a fire or damage eyes.",
    },
    {
      id: "s2",
      title: "Choose and prepare the box",
      detail:
        "Pick a box at least 1.3× the focal length long. Remove the lid and check for gaps in the corners. Tape any seams that let light through.",
      minutes: 10,
    },
    {
      id: "s3",
      title: "Cut the lens opening",
      detail:
        "Trace the lens on the centre of one short end, then cut the circle about 5 mm smaller than the lens so it has a lip to rest on. Cut slowly with multiple light passes.",
      minutes: 15,
      warning: "Always cut away from your body and fingers, on a cutting mat, and retract the blade when you put the knife down.",
    },
    {
      id: "s4",
      title: "Mount the lens",
      detail:
        "Place the lens flat against the opening from the inside and fix it with a ring of glue or tape around the rim, keeping the centre clean. Make sure it sits square to the box, not tilted.",
      minutes: 10,
      tip: "If you use a handheld magnifier, you can push the handle through a slot in the box wall and tape it, without removing it.",
    },
    {
      id: "s5",
      title: "Blacken the inside",
      detail:
        "Line every inner surface with matte black paper or paint. This greatly improves contrast by absorbing light that would otherwise bounce around and wash out the picture.",
      minutes: 20,
    },
    {
      id: "s6",
      title: "Build the sliding phone carriage",
      detail:
        "Make a sled from a strip of stiff card the width of the box, with a stand or binder clips to hold the phone upright facing the lens. It should slide smoothly but not wobble. Add a pencil scale along the box floor so you can repeat good focus positions.",
      minutes: 25,
    },
    {
      id: "s7",
      title: "Add ventilation",
      detail:
        "Cut two vent holes (about 3 cm) near the top rear and bottom front so warm air can escape. If you are adding the USB fan, fit it over the rear hole blowing outwards and run its cable out through a small notch.",
      minutes: 15,
      warning: "A phone running at full brightness inside a closed box gets warm. Ventilation is required, not optional.",
    },
    {
      id: "s8",
      title: "Prepare your phone",
      detail:
        "Set brightness to maximum, turn on Do Not Disturb, disable auto-lock while playing, and lock screen rotation. Start your video, then place the phone upside down (rotated 180°) on the carriage so the projected image appears the right way up.",
      minutes: 5,
      tip: "Turn off dark-mode auto-dimming and battery saver, which reduce brightness.",
    },
    {
      id: "s9",
      title: "Focus and test",
      detail:
        "Close the lid, aim the lens at a white wall 1–2.5 m away in a fully dark room, and slide the carriage until the picture is sharp. Mark the position. Moving the box further from the wall makes the image larger but dimmer.",
      minutes: 15,
    },
    {
      id: "s10",
      title: "Seal light leaks and finish",
      detail:
        "With the projector running, look for light escaping from the box and tape it. Cut a small door at the back so you can reach the phone without opening the lid. Decorate the outside if you like.",
      minutes: 15,
    },
  ],
  safety: [
    {
      level: "danger",
      hazard: "heat",
      title: "Lenses can focus sunlight into a fire",
      detail:
        "Never leave the lens or the finished projector in direct sunlight, including on a windowsill. A focused sun spot can ignite cardboard and paper in seconds and can permanently damage eyesight.",
      saferAlternative: "Store the projector lens-down or with a cardboard cap over the lens when not in use.",
    },
    {
      level: "caution",
      hazard: "battery",
      title: "Watch your phone's temperature",
      detail:
        "Lithium-ion phone batteries can be damaged by heat. Do not charge the phone inside the box, and stop if your phone shows a temperature warning or feels hot to the touch.",
      saferAlternative: "Use the vent holes plus the USB fan, and take a 10-minute break every hour.",
    },
    {
      level: "caution",
      hazard: "sharp-tools",
      title: "Craft knives cause most DIY injuries",
      detail: "Use a sharp, fresh blade (dull blades slip), a cutting mat and a steel ruler. Children should have an adult do the cutting.",
      saferAlternative: "Use safety scissors and a pre-cut hole template for younger makers.",
    },
    {
      level: "caution",
      hazard: "heat",
      title: "Hot glue burns",
      detail: "Hot glue guns reach 120–200 °C. Rest the gun on its stand and keep a bowl of cold water nearby for accidental drips.",
      saferAlternative: "Use strong tape or craft glue instead.",
    },
  ],
  testing: [
    "Project a test pattern (search “projector focus test pattern” image) and adjust until the centre text is crisp.",
    "Check that the edges are acceptably sharp. Some edge blur is normal with simple lenses.",
    "After 15 minutes of playback, check the phone. It may be warm, but should not be hot to the touch.",
    "Measure the image size at 1.5 m and 2.5 m to find your best balance of size and brightness.",
  ],
  troubleshooting: [
    { problem: "Image is blurry everywhere", fix: "Slide the carriage slowly in both directions; the sharp point can be within a 1 cm range. Make sure the phone is parallel to the lens." },
    { problem: "Image is too dim", fix: "Make the room completely dark, use maximum brightness, move the box closer to the wall, and line the inside better. A larger lens helps most." },
    { problem: "Picture is upside down or mirrored", fix: "Lock rotation and turn the phone 180°. If it is mirrored, you are projecting through a mirror; enable a mirrored video mode or remove the mirror." },
    { problem: "Bright haze or glow around the picture", fix: "Light is bouncing inside. Add more matte black lining and a cardboard hood around the lens." },
    { problem: "Edges are blurry but the centre is sharp", fix: "This is lens curvature. Keep the phone centred on the lens axis, or upgrade to a better glass lens." },
  ],
  upgrades: [
    "Swap to an A4 Fresnel lens and a longer box for a larger, brighter image.",
    "Add a 45° mirror to project onto the ceiling for bedtime films.",
    "Rebuild the body in 6 mm plywood with a threaded focusing rod.",
    "Pair a Bluetooth speaker (see the Bluetooth Speaker build) for better sound.",
    "Add a tripod mount using a 1/4-inch nut glued into the base.",
  ],
};

const bluetoothSpeaker: ProjectPlan = {
  id: "proj_bt_speaker",
  slug: "recycled-bluetooth-speaker",
  title: "Rechargeable Bluetooth Speaker",
  tagline: "A punchy stereo speaker built from cheap modules and a recycled enclosure.",
  emoji: "🔊",
  categories: ["Audio", "Recycled Materials", "Low-Cost Alternatives"],
  difficulty: "Intermediate",
  overview:
    "Combine a Bluetooth 5.0 audio receiver, a tiny stereo amplifier and two 3 W speakers inside a wooden box, tin or thick jar. A single 18650 cell with a protected USB-C charger gives several hours of play. Expect sound comparable to a budget portable speaker.",
  howItWorks:
    "Your phone streams audio to the Bluetooth receiver, which outputs a line-level stereo signal. The PAM8403 class-D amplifier boosts it to drive the speakers. A TP4056 charger board with protection charges the lithium cell safely and cuts power if it is over-discharged.",
  timeHours: 4,
  retailComparison: { product: "Budget portable Bluetooth speaker", priceUSD: 45 },
  hazards: ["battery", "heat", "sharp-tools", "small-parts"],
  cover: ["#8b5cf6", "#ec4899"],
  source: "starter",
  likes: 1630,
  builds: 744,
  components: [
    { id: "c_bt", name: "Bluetooth 5.0 audio receiver board (5 V)", qty: 1, unitPriceUSD: 4, purpose: "Receives audio wirelessly from your phone.", alternatives: [{ name: "Old Bluetooth car adapter (AUX type)", note: "Can be reused; power it from the 5 V line.", household: true }], searchQuery: "bluetooth 5.0 audio receiver board 5V" },
    { id: "c_amp", name: "PAM8403 2×3 W amplifier module", qty: 1, unitPriceUSD: 1.5, purpose: "Boosts the audio signal to drive the speakers.", alternatives: [{ name: "Amplifier from old computer speakers", note: "Often runs on 5 V USB power already.", household: true }], searchQuery: "PAM8403 amplifier module volume" },
    { id: "c_spk", name: "3 W 4 Ω speaker drivers (40–50 mm)", qty: 2, unitPriceUSD: 3, purpose: "Turn the amplified signal into sound.", alternatives: [{ name: "Speakers salvaged from an old laptop, TV or toy", note: "Check they are 4–8 Ω; 8 Ω is quieter but fine.", household: true }] },
    { id: "c_cell", name: "18650 Li-ion cell, protected, 2500 mAh+", qty: 1, unitPriceUSD: 5, purpose: "Rechargeable power source.", alternatives: [{ name: "3× AA battery holder (4.5 V)", priceUSD: 1, note: "Much safer for beginners, no charger needed. Shorter playtime." }], searchQuery: "protected 18650 cell 2600mAh" },
    { id: "c_chg", name: "TP4056 USB-C charger with protection (DW01)", qty: 1, unitPriceUSD: 1, purpose: "Charges the cell and protects it from over-discharge and short circuits.", alternatives: [{ name: "Ready-made USB power bank board", priceUSD: 3, note: "Includes a 5 V boost output too." }] },
    { id: "c_boost", name: "MT3608 or 5 V boost converter", qty: 1, unitPriceUSD: 1, purpose: "Raises 3.7 V to a stable 5 V for the modules.", alternatives: [{ name: "Skip it with the AA option", note: "4.5 V from 3× AA runs both modules directly." }] },
    { id: "c_sw", name: "Rocker or slide switch", qty: 1, unitPriceUSD: 0.5, purpose: "Turns the speaker on and off.", alternatives: [{ name: "Switch from a broken toy", note: "Any small on/off switch rated 1 A+ works.", household: true }] },
    { id: "c_box", name: "Enclosure: wooden box, tin or thick glass jar", qty: 1, unitPriceUSD: 0, purpose: "Holds everything and shapes the sound; sealed boxes give better bass.", alternatives: [{ name: "PVC pipe with end caps", priceUSD: 4, note: "Makes a neat cylindrical speaker." }, { name: "Old wooden jewellery or tea box", note: "Wood sounds warmer than metal.", household: true }] },
    { id: "c_wire", name: "Hook-up wire, heat-shrink, foam padding", qty: 1, unitPriceUSD: 3, purpose: "Connections and mounting.", alternatives: [{ name: "Wire from an old USB cable", note: "Strip and reuse the inner wires.", household: true }] },
  ],
  tools: [
    { name: "Soldering iron and solder", note: "A 30–60 W adjustable iron is ideal." },
    { name: "Wire strippers or sharp scissors" },
    { name: "Drill or hole saw", note: "For speaker and switch holes." },
    { name: "Multimeter", optional: true, note: "Very helpful for checking polarity and voltage." },
    { name: "Hot glue gun", optional: true },
  ],
  wiring: {
    summary: "Battery → charger/protection → switch → 5 V boost → Bluetooth receiver and amplifier power. Receiver audio out → amplifier input → speakers.",
    nodes: ["18650 cell", "TP4056 charger", "Switch", "5V boost", "BT receiver", "PAM8403 amp", "Speaker L", "Speaker R"],
    connections: [
      { from: "18650 cell", fromPin: "+", to: "TP4056 charger", toPin: "B+", wire: "red" },
      { from: "18650 cell", fromPin: "−", to: "TP4056 charger", toPin: "B−", wire: "black" },
      { from: "TP4056 charger", fromPin: "OUT+", to: "Switch", toPin: "IN", wire: "red" },
      { from: "Switch", fromPin: "OUT", to: "5V boost", toPin: "VIN+", wire: "red" },
      { from: "TP4056 charger", fromPin: "OUT−", to: "5V boost", toPin: "VIN−", wire: "black" },
      { from: "5V boost", fromPin: "VOUT+ 5V", to: "BT receiver", toPin: "5V", wire: "red" },
      { from: "5V boost", fromPin: "VOUT+ 5V", to: "PAM8403 amp", toPin: "5V", wire: "red" },
      { from: "BT receiver", fromPin: "L / R / GND", to: "PAM8403 amp", toPin: "L / R / GND", wire: "yellow", note: "Use a short twisted bundle to reduce hum." },
      { from: "PAM8403 amp", fromPin: "L+ / L−", to: "Speaker L", toPin: "+ / −", wire: "green" },
      { from: "PAM8403 amp", fromPin: "R+ / R−", to: "Speaker R", toPin: "+ / −", wire: "blue" },
    ],
    notes: [
      "Adjust the boost converter to 5.0 V with a multimeter before connecting the modules.",
      "Never connect amplifier speaker outputs (− terminals) to ground; PAM8403 outputs are bridged.",
      "Keep the cell away from the amplifier, which gets warm.",
    ],
  },
  steps: [
    { id: "s1", title: "Test the modules on the bench", detail: "Before building anything, connect the receiver, amp and one speaker to a USB 5 V supply and pair your phone. Confirm you hear audio.", minutes: 20 },
    { id: "s2", title: "Set the boost converter to 5 V", detail: "Power the boost from the cell via the charger board and turn its trim screw until the multimeter reads 5.0 V on the output.", minutes: 15, warning: "Check polarity twice. Reversing a lithium cell can destroy the board and overheat the cell." },
    { id: "s3", title: "Plan and drill the enclosure", detail: "Mark speaker holes slightly smaller than the speaker cones, plus holes for the switch, USB-C port and the amp's volume knob. Drill slowly.", minutes: 40, warning: "Clamp the box; never hold it in your hand while drilling." },
    { id: "s4", title: "Solder the power path", detail: "Solder cell → charger → switch → boost, using red for positive and black for negative. Cover every joint in heat-shrink.", minutes: 40 },
    { id: "s5", title: "Solder the audio path", detail: "Connect the receiver's L, R and GND to the amp input, and each amp output pair to a speaker. Mark speaker polarity so both move in phase.", minutes: 30 },
    { id: "s6", title: "Mount everything", detail: "Glue the speakers from the inside, mount the boards on foam pads so nothing shorts against metal, and secure the cell in a holder away from hot parts.", minutes: 30 },
    { id: "s7", title: "Close up and tune", detail: "Seal the box (a sealed box gives tighter bass), set the volume knob around 70 %, and test with music across low and high volumes.", minutes: 20 },
  ],
  safety: [
    { level: "danger", hazard: "battery", title: "Lithium cells can catch fire if mistreated", detail: "Short circuits, reversed polarity, crushing or charging without protection can make an 18650 cell overheat or ignite. Only use protected cells and a charger board with DW01 protection.", saferAlternative: "Use a 3× AA battery holder instead; it is far more forgiving for a first build." },
    { level: "caution", hazard: "heat", title: "Soldering irons reach 350 °C", detail: "Always return the iron to its stand, work in a ventilated space, and wash hands after handling solder.", saferAlternative: "Use screw-terminal modules and Wago-style connectors to avoid soldering." },
    { level: "caution", hazard: "sharp-tools", title: "Drilling", detail: "Wear eye protection and clamp the enclosure. Glass jars must be drilled with a diamond bit under water, or avoided.", saferAlternative: "Choose a wooden or cardboard box that is easy to cut." },
  ],
  testing: ["Measure 5.0 V at the boost output before connecting modules.", "Pair and play a test track at low volume, then increase.", "Charge from empty and confirm the charger LED turns from red to blue/green.", "After 30 minutes at high volume, check the cell is not warm."],
  troubleshooting: [
    { problem: "Buzzing or hum", fix: "Shorten audio wires, twist L/R/GND together, and keep them away from the boost converter." },
    { problem: "Sound cuts out at high volume", fix: "The cell is sagging. Use a higher-current cell or add a 470 µF capacitor across the amp's 5 V input." },
    { problem: "Only one speaker works", fix: "Check the amp output solder joints and the L/R input wire." },
    { problem: "Won't pair", fix: "Forget the device on your phone, power-cycle the receiver, and keep the phone within 2 m." },
  ],
  upgrades: ["Add a passive radiator for deeper bass.", "Use a 2S battery and a 2×15 W TPA3116 amplifier.", "Add an LED battery level indicator.", "Build a stereo pair with two speakers."],
  author: { name: "Priya Nair", handle: "@priyabuilds" },
};

const plantWatering: ProjectPlan = {
  id: "proj_plant_water",
  slug: "smart-plant-watering-system",
  title: "Smart Plant Watering System",
  tagline: "An Arduino that waters your plant only when the soil is actually dry.",
  emoji: "🪴",
  categories: ["Home Automation", "Arduino", "Recycled Materials"],
  difficulty: "Beginner",
  overview:
    "A capacitive soil moisture sensor tells an Arduino Nano how dry the soil is. When it drops below your threshold, the Arduino switches on a small 5 V pump for a few seconds, pulling water from a recycled bottle reservoir. Great first Arduino project with a real, useful result.",
  howItWorks:
    "The capacitive sensor's output voltage rises as the soil dries. The Arduino reads it every few minutes. If it crosses the dry threshold, the Arduino turns on a logic-level MOSFET (or relay) that powers the pump for a short burst, then waits for the water to soak in before checking again.",
  timeHours: 3,
  retailComparison: { product: "Smart self-watering planter kit", priceUSD: 45 },
  hazards: ["small-parts"],
  cover: ["#22c55e", "#3b82f6"],
  source: "starter",
  likes: 2210,
  builds: 1508,
  components: [
    { id: "c_nano", name: "Arduino Nano (compatible)", qty: 1, unitPriceUSD: 6, purpose: "The brain that reads the sensor and controls the pump.", alternatives: [{ name: "Arduino Uno", priceUSD: 10, note: "Bigger but easier to plug wires into." }, { name: "ESP32", priceUSD: 6, note: "Adds Wi-Fi so you can get phone alerts." }], searchQuery: "Arduino Nano compatible USB-C" },
    { id: "c_sensor", name: "Capacitive soil moisture sensor v1.2", qty: 1, unitPriceUSD: 2.5, purpose: "Measures soil moisture without corroding like cheap resistive probes.", alternatives: [{ name: "Resistive fork probe", priceUSD: 1, note: "Cheaper but corrodes within weeks. Not recommended." }] },
    { id: "c_pump", name: "5 V mini submersible pump + 1 m silicone tube", qty: 1, unitPriceUSD: 3.5, purpose: "Moves water from the reservoir to the plant.", alternatives: [{ name: "Pump from an old aquarium or fountain (5–6 V DC only)", note: "Do not use mains-powered pumps for this build.", household: true }] },
    { id: "c_mosfet", name: "Logic-level MOSFET module (IRLZ44N) or 5 V relay module", qty: 1, unitPriceUSD: 1.5, purpose: "Lets the Arduino switch the pump on and off.", alternatives: [{ name: "5 V relay module", priceUSD: 1.5, note: "Clicks audibly but is very beginner-friendly." }] },
    { id: "c_diode", name: "1N4007 flyback diode", qty: 1, unitPriceUSD: 0.1, purpose: "Protects the circuit from the pump motor's voltage spikes.", alternatives: [{ name: "Diode salvaged from an old power supply", note: "Any 1N400x works.", household: true }] },
    { id: "c_psu", name: "5 V 2 A USB power adapter + cable", qty: 1, unitPriceUSD: 5, purpose: "Powers the Arduino and the pump.", alternatives: [{ name: "Old phone charger", note: "Any 5 V adapter rated 1.5 A or more.", household: true }] },
    { id: "c_jumper", name: "Jumper wires and mini breadboard", qty: 1, unitPriceUSD: 3, purpose: "Connections without soldering.", alternatives: [] },
    { id: "c_res", name: "Reservoir: 1.5–2 L plastic bottle", qty: 1, unitPriceUSD: 0, purpose: "Holds the water supply.", alternatives: [{ name: "Old food container with lid", note: "Lid keeps dust and mosquitoes out.", household: true }] },
  ],
  tools: [{ name: "Computer with Arduino IDE" }, { name: "Small screwdriver" }, { name: "Scissors or knife for the bottle" }, { name: "Zip ties or tape" }],
  wiring: {
    summary: "Sensor to analog pin A0, MOSFET gate to pin D7, pump powered from 5 V through the MOSFET, with a flyback diode across the pump.",
    nodes: ["Arduino Nano", "Moisture sensor", "MOSFET module", "5V pump", "5V USB supply"],
    connections: [
      { from: "Moisture sensor", fromPin: "VCC", to: "Arduino Nano", toPin: "5V", wire: "red" },
      { from: "Moisture sensor", fromPin: "GND", to: "Arduino Nano", toPin: "GND", wire: "black" },
      { from: "Moisture sensor", fromPin: "AOUT", to: "Arduino Nano", toPin: "A0", wire: "yellow" },
      { from: "Arduino Nano", fromPin: "D7", to: "MOSFET module", toPin: "SIG", wire: "blue" },
      { from: "5V USB supply", fromPin: "5V", to: "5V pump", toPin: "+ (red)", wire: "red" },
      { from: "5V pump", fromPin: "− (black)", to: "MOSFET module", toPin: "DRAIN / V−", wire: "black" },
      { from: "MOSFET module", fromPin: "GND", to: "Arduino Nano", toPin: "GND", wire: "black", note: "Common ground is essential." },
    ],
    notes: ["Place the 1N4007 diode across the pump terminals, stripe towards +.", "Keep electronics above and away from the reservoir; water and boards must not mix."],
  },
  steps: [
    { id: "s1", title: "Calibrate the sensor", detail: "Upload a sketch that prints analogRead(A0). Note the value in air (dry) and in a glass of water (wet). Your threshold will be about 60 % of the way towards dry.", minutes: 20 },
    { id: "s2", title: "Wire the pump circuit", detail: "Connect the MOSFET module, pump and diode as in the wiring diagram. Test by writing D7 HIGH for 2 seconds with the pump in a cup of water.", minutes: 25 },
    { id: "s3", title: "Upload the watering sketch", detail: "Use the sample logic: read moisture every 10 minutes; if drier than threshold, pump for 3 seconds, then wait 15 minutes before checking again.", minutes: 20, tip: "The long wait stops over-watering while the water soaks in." },
    { id: "s4", title: "Prepare the reservoir", detail: "Cut a hole in the bottle cap for the tube and cable, place the pump at the bottom, and fill with water.", minutes: 15 },
    { id: "s5", title: "Install at the plant", detail: "Push the sensor into the soil up to the line, and route the tube so it drips near the roots. Mount the Arduino in a small box above the water level.", minutes: 20 },
    { id: "s6", title: "Observe for a week", detail: "Check soil and reservoir daily and adjust the threshold and pump time to suit your plant.", minutes: 30 },
  ],
  safety: [
    { level: "caution", title: "Keep water away from electronics", detail: "Mount the Arduino and supply above and away from the reservoir, and use a drip loop on cables so water cannot run along them into the board.", saferAlternative: "Put electronics in a lidded plastic box." },
    { level: "info", hazard: "small-parts", title: "Small parts", detail: "Keep jumper wires and components away from young children and pets." },
    { level: "caution", hazard: "high-voltage", title: "Low voltage only", detail: "Only use 5–6 V DC pumps. Never connect a mains-powered pump to a relay unless you are qualified to work with mains electricity.", saferAlternative: "Stick to 5 V USB power; it is plenty for one or two plants." },
  ],
  testing: ["Serial monitor shows changing values when you squeeze the soil.", "Pump runs for exactly the set time when soil is dry.", "Pump does not run when the sensor is in wet soil.", "System recovers correctly after unplugging and re-plugging power."],
  troubleshooting: [
    { problem: "Pump never turns on", fix: "Check common ground between the pump supply and Arduino, and that D7 matches the sketch." },
    { problem: "Readings jump around", fix: "Average 10 readings, and make sure the sensor is pushed firmly into soil." },
    { problem: "Arduino resets when the pump starts", fix: "Add a 470 µF capacitor across 5 V and GND, and check the diode." },
    { problem: "Plant gets too much water", fix: "Reduce pump time to 1–2 seconds and increase the wait between checks." },
  ],
  upgrades: ["Swap to an ESP32 and get Wi-Fi notifications when the reservoir is low.", "Add a water level float switch.", "Water up to four plants with a 4-channel relay and multiple sensors.", "Log moisture to a small OLED screen."],
  author: { name: "Leo Martins", handle: "@leo.makes" },
};

const lineRobot: ProjectPlan = {
  id: "proj_line_robot",
  slug: "line-following-robot",
  title: "Line Following Robot",
  tagline: "A fast little robot that follows a black tape track using infrared sensors.",
  emoji: "🤖",
  categories: ["Robotics", "Arduino"],
  difficulty: "Intermediate",
  overview:
    "Build a two-wheeled robot with an Arduino Uno, a TB6612 motor driver and an infrared sensor array. It reads the contrast between black tape and a light floor, and steers to keep the line centred. A classic robotics project that teaches sensors, motors and simple control loops.",
  howItWorks:
    "Infrared sensors see less reflected light over black tape. The Arduino compares the left and right sensors and slows the motor on the side the line has drifted to, steering back on course. A proportional (P) control loop makes the movement smooth instead of jerky.",
  timeHours: 5,
  retailComparison: { product: "Line-follower robot kit (pre-built)", priceUSD: 70 },
  hazards: ["battery", "small-parts", "heat"],
  cover: ["#06b6d4", "#39ff88"],
  source: "starter",
  likes: 1955,
  builds: 820,
  components: [
    { id: "c_uno", name: "Arduino Uno (compatible)", qty: 1, unitPriceUSD: 10, purpose: "Reads the sensors and drives the motors.", alternatives: [{ name: "Arduino Nano", priceUSD: 6, note: "Smaller; use a breadboard on the chassis." }] },
    { id: "c_driver", name: "TB6612FNG motor driver", qty: 1, unitPriceUSD: 3, purpose: "Lets the Arduino control motor speed and direction.", alternatives: [{ name: "L298N driver", priceUSD: 3, note: "Common but wastes battery as heat; robot will be slower." }] },
    { id: "c_motor", name: "TT gear motors with wheels", qty: 2, unitPriceUSD: 3, purpose: "Drive the robot.", alternatives: [{ name: "Motors from an old RC car", note: "Check they run at 3–6 V.", household: true }] },
    { id: "c_caster", name: "Ball caster wheel", qty: 1, unitPriceUSD: 1, purpose: "Third support point at the front.", alternatives: [{ name: "Smooth bead or bottle cap", note: "Glue a smooth plastic dome as a skid.", household: true }] },
    { id: "c_ir", name: "5-channel IR line sensor array (TCRT5000)", qty: 1, unitPriceUSD: 4, purpose: "Detects the black line.", alternatives: [{ name: "Two single TCRT5000 modules", priceUSD: 2, note: "Works for basic tracks with simpler code." }] },
    { id: "c_batt", name: "4× AA battery holder with switch + batteries", qty: 1, unitPriceUSD: 4, purpose: "Power for motors and Arduino.", alternatives: [{ name: "2× 18650 holder with protected cells", priceUSD: 12, note: "More power and rechargeable, but needs careful handling." }] },
    { id: "c_chassis", name: "Chassis: corrugated cardboard, foam board or acrylic plate", qty: 1, unitPriceUSD: 0, purpose: "Holds everything together.", alternatives: [{ name: "Old plastic food container lid", note: "Light and easy to drill.", household: true }] },
    { id: "c_track", name: "Black electrical tape (19 mm)", qty: 1, unitPriceUSD: 1.5, purpose: "Makes the track on a light floor or poster board.", alternatives: [] },
  ],
  tools: [{ name: "Screwdrivers" }, { name: "Soldering iron", optional: true, note: "Needed only if your motors come without wires." }, { name: "Hot glue gun or double-sided foam tape" }, { name: "Computer with Arduino IDE" }],
  wiring: {
    summary: "Motors connect to the TB6612 outputs; the driver's PWM and direction pins go to Arduino digital pins; the IR array outputs go to analog pins A0–A4.",
    nodes: ["Arduino Uno", "TB6612 driver", "Left motor", "Right motor", "IR sensor array", "AA battery pack"],
    connections: [
      { from: "AA battery pack", fromPin: "+6V", to: "TB6612 driver", toPin: "VM", wire: "red" },
      { from: "AA battery pack", fromPin: "+6V", to: "Arduino Uno", toPin: "VIN", wire: "red" },
      { from: "AA battery pack", fromPin: "GND", to: "Arduino Uno", toPin: "GND", wire: "black" },
      { from: "Arduino Uno", fromPin: "5V", to: "TB6612 driver", toPin: "VCC + STBY", wire: "orange" },
      { from: "Arduino Uno", fromPin: "D5 / D7 / D8", to: "TB6612 driver", toPin: "PWMA / AIN1 / AIN2", wire: "yellow" },
      { from: "Arduino Uno", fromPin: "D6 / D9 / D10", to: "TB6612 driver", toPin: "PWMB / BIN1 / BIN2", wire: "purple" },
      { from: "TB6612 driver", fromPin: "A01 / A02", to: "Left motor", toPin: "M+ / M−", wire: "green" },
      { from: "TB6612 driver", fromPin: "B01 / B02", to: "Right motor", toPin: "M+ / M−", wire: "blue" },
      { from: "IR sensor array", fromPin: "S1–S5", to: "Arduino Uno", toPin: "A0–A4", wire: "white" },
      { from: "IR sensor array", fromPin: "VCC / GND", to: "Arduino Uno", toPin: "5V / GND", wire: "red" },
    ],
    notes: ["All grounds must be connected together.", "Mount the IR array 5–10 mm above the floor for reliable readings."],
  },
  steps: [
    { id: "s1", title: "Build the chassis", detail: "Cut a 15 × 12 cm base, mount the motors at the rear with glue or brackets and the caster at the front.", minutes: 40 },
    { id: "s2", title: "Mount electronics", detail: "Fix the Arduino, driver and battery holder with foam tape, keeping the battery low and central for balance.", minutes: 25 },
    { id: "s3", title: "Wire motors and driver", detail: "Follow the wiring diagram. Test each motor with a simple forward/back sketch before adding sensors.", minutes: 40 },
    { id: "s4", title: "Mount and test the sensor array", detail: "Mount the array at the front, 5–10 mm above the floor. Print readings to the serial monitor and check each sensor changes over the tape.", minutes: 30 },
    { id: "s5", title: "Lay a test track", detail: "Make an oval with smooth curves (radius ≥ 15 cm) on a light floor or white poster board.", minutes: 20 },
    { id: "s6", title: "Code the P-controller", detail: "Calculate a line position from −2 to +2 from the five sensors; set motor speeds as base ± Kp × position. Start with base speed 120 and Kp 30.", minutes: 60 },
    { id: "s7", title: "Tune for speed", detail: "Raise base speed step by step; if the robot wobbles, reduce Kp. Add a derivative term (PD) for sharp turns.", minutes: 60 },
  ],
  safety: [
    { level: "caution", hazard: "battery", title: "Batteries and motors", detail: "Stalled motors draw high current and can heat wires. Switch off before handling, and never short battery terminals.", saferAlternative: "AA NiMH rechargeables are a safe, sturdy choice." },
    { level: "info", hazard: "small-parts", title: "Small parts", detail: "Screws and nuts are a choking hazard; keep a parts tray." },
  ],
  testing: ["Each motor spins in the correct direction on command.", "Serial monitor shows each IR sensor reading change over tape.", "Robot completes three laps of the oval without leaving the line.", "Robot recovers when nudged slightly off the line."],
  troubleshooting: [
    { problem: "Robot spins in circles", fix: "One motor is wired backwards; swap its two wires." },
    { problem: "Robot overshoots curves", fix: "Lower base speed or Kp, or add a derivative term." },
    { problem: "Sensors don't see the line", fix: "Lower the array closer to the floor and shield it from bright sunlight." },
    { problem: "Arduino resets when motors start", fix: "Batteries are weak, or add a 470 µF capacitor across the motor supply." },
  ],
  upgrades: ["Add an ultrasonic sensor to stop for obstacles.", "Bluetooth control with an HC-05 module.", "Full PID control and lap timing.", "Swap to N20 micro-metal gear motors for racing."],
  author: { name: "Kenji Watanabe", handle: "@kenjibots" },
};

const smartLight: ProjectPlan = {
  id: "proj_smart_light",
  slug: "wifi-smart-home-light",
  title: "Wi-Fi Smart Home Light",
  tagline: "A phone-controlled RGB mood lamp with scenes, schedules and voice assistant support.",
  emoji: "💡",
  categories: ["Home Automation", "Lighting", "Low-Cost Alternatives"],
  difficulty: "Beginner",
  overview:
    "Use an ESP32 and a short strip of addressable WS2812B LEDs inside a frosted jar or lampshade, running the free open-source WLED firmware. You get a phone app, hundreds of effects, schedules and smart home integrations, all running from a safe 5 V USB supply.",
  howItWorks:
    "The ESP32 connects to your Wi-Fi and runs WLED, which drives each LED's colour individually over a single data wire. A level-safe resistor protects the data line and a capacitor smooths the power when LEDs change brightness quickly.",
  timeHours: 2,
  retailComparison: { product: "Smart RGB table lamp", priceUSD: 40 },
  hazards: ["high-voltage", "heat", "small-parts"],
  cover: ["#f59e0b", "#8b5cf6"],
  source: "starter",
  likes: 3120,
  builds: 2045,
  components: [
    { id: "c_esp", name: "ESP32 dev board (USB-C)", qty: 1, unitPriceUSD: 6, purpose: "Wi-Fi microcontroller running WLED.", alternatives: [{ name: "ESP8266 (Wemos D1 mini)", priceUSD: 3, note: "Also runs WLED; slightly fewer features." }] },
    { id: "c_strip", name: "WS2812B LED strip, 60 LED/m, 1 m", qty: 1, unitPriceUSD: 7, purpose: "Individually controllable colour LEDs.", alternatives: [{ name: "WS2812B ring (24 LEDs)", priceUSD: 4, note: "Neat for small lamps." }] },
    { id: "c_psu", name: "5 V 3 A USB-C power adapter", qty: 1, unitPriceUSD: 8, purpose: "Powers the ESP32 and LEDs safely at low voltage.", alternatives: [{ name: "Old 5 V 2 A phone charger", note: "Fine if you limit brightness in WLED to 1800 mA.", household: true }] },
    { id: "c_res", name: "330 Ω resistor", qty: 1, unitPriceUSD: 0.1, purpose: "Protects the first LED's data input.", alternatives: [] },
    { id: "c_cap", name: "1000 µF 10 V capacitor", qty: 1, unitPriceUSD: 0.3, purpose: "Smooths power spikes from the LEDs.", alternatives: [] },
    { id: "c_diffuser", name: "Diffuser: frosted glass jar, paper lantern or lampshade", qty: 1, unitPriceUSD: 0, purpose: "Softens the LED points into even glow.", alternatives: [{ name: "Clear jar + baking paper lining", note: "Instant DIY frosted look.", household: true }, { name: "Recycled milk bottle", note: "HDPE plastic diffuses beautifully.", household: true }] },
    { id: "c_wire", name: "Wire, heat-shrink, base (wood offcut or box)", qty: 1, unitPriceUSD: 2, purpose: "Connections and lamp base.", alternatives: [] },
  ],
  tools: [{ name: "Soldering iron", note: "Or use clip-on LED strip connectors." }, { name: "Computer with Chrome or Edge", note: "For the one-click WLED web installer." }, { name: "Scissors" }],
  wiring: {
    summary: "5 V supply feeds both the ESP32 and the strip. ESP32 GPIO16 sends data to the strip through a 330 Ω resistor.",
    nodes: ["5V USB-C supply", "ESP32", "LED strip", "1000µF capacitor"],
    connections: [
      { from: "5V USB-C supply", fromPin: "5V", to: "LED strip", toPin: "5V", wire: "red" },
      { from: "5V USB-C supply", fromPin: "5V", to: "ESP32", toPin: "5V / VIN", wire: "red" },
      { from: "5V USB-C supply", fromPin: "GND", to: "LED strip", toPin: "GND", wire: "black" },
      { from: "ESP32", fromPin: "GND", to: "LED strip", toPin: "GND", wire: "black" },
      { from: "ESP32", fromPin: "GPIO16", to: "LED strip", toPin: "DIN (via 330Ω)", wire: "green" },
      { from: "1000µF capacitor", fromPin: "+ / −", to: "LED strip", toPin: "5V / GND", wire: "white", note: "Watch the capacitor's stripe (−)." },
    ],
    notes: ["Data goes into the DIN end of the strip (arrows point away from it).", "Set WLED's brightness limiter to match your power supply current."],
  },
  steps: [
    { id: "s1", title: "Flash WLED", detail: "Plug the ESP32 into your computer, open the official WLED web installer in Chrome, and click Install. Connect to the WLED-AP hotspot to enter your Wi-Fi details.", minutes: 15 },
    { id: "s2", title: "Cut and prepare the strip", detail: "Cut the strip at the copper pads to fit around a cardboard tube or inside your jar (about 30–60 LEDs).", minutes: 10 },
    { id: "s3", title: "Wire it up", detail: "Solder or clip the connections as in the wiring diagram, with the resistor on the data line and the capacitor across the power at the strip.", minutes: 30 },
    { id: "s4", title: "Configure WLED", detail: "In the WLED app set LED count, GPIO 16, and the max current limit (e.g. 2500 mA for a 3 A supply).", minutes: 10 },
    { id: "s5", title: "Assemble the lamp", detail: "Wrap the strip around a cardboard tube, place it in the diffuser, and mount the ESP32 in the base with ventilation slots.", minutes: 30 },
    { id: "s6", title: "Set scenes and schedules", detail: "Create presets (reading, sunset, party) and a sunrise wake-up schedule. Optionally link to Home Assistant or Alexa.", minutes: 20 },
  ],
  safety: [
    { level: "danger", hazard: "high-voltage", title: "Never open or modify mains adapters", detail: "This build only uses the 5 V side of a sealed, certified USB adapter. Do not cut mains cables, open plug adapters or wire LEDs to household mains.", saferAlternative: "Buy a certified 5 V adapter with the right current rating." },
    { level: "caution", hazard: "heat", title: "LEDs at full white get warm", detail: "60 LEDs at full white can draw 3.6 A and heat the strip. Use WLED's current limiter and keep paper diffusers from touching the LEDs.", saferAlternative: "Limit brightness to 60 % and use glass or plastic diffusers." },
  ],
  testing: ["WLED app finds the lamp on your network.", "All LEDs show solid red, green and blue correctly.", "Run at full brightness for 20 minutes; the strip and supply should be warm at most.", "Schedules trigger at the right time."],
  troubleshooting: [
    { problem: "LEDs flicker or show random colours", fix: "Check the common ground and the 330 Ω resistor; keep the data wire short." },
    { problem: "Only the first LED lights", fix: "The strip is reversed; connect to the DIN end." },
    { problem: "ESP32 reboots at high brightness", fix: "Power supply too weak; lower the current limit in WLED." },
  ],
  upgrades: ["Add a microphone for sound-reactive effects (WLED-SR).", "Add a physical button for scenes.", "Build a multi-lamp sync group.", "Integrate with Home Assistant automations."],
  author: { name: "Amara Okafor", handle: "@amaralights" },
};

const jarLantern: ProjectPlan = {
  id: "proj_jar_lantern",
  slug: "recycled-jar-firefly-lantern",
  title: "Recycled Jar Firefly Lantern",
  tagline: "A no-solder LED decoration that turns an old jar into a glowing night light.",
  emoji: "✨",
  categories: ["Lighting", "Recycled Materials"],
  difficulty: "Beginner",
  overview:
    "A perfect first electronics project for kids and families. A battery-powered copper-wire fairy light string is coiled inside a frosted recycled jar to create a soft firefly glow. You'll learn basic circuits, switches and LED polarity with zero soldering.",
  howItWorks:
    "The fairy string contains tiny LEDs wired in parallel along thin copper wire. A battery pack with a switch completes the circuit. Frosting the jar spreads the light so it glows instead of sparkling.",
  timeHours: 1,
  retailComparison: { product: "Decorative LED jar lantern", priceUSD: 25 },
  hazards: ["battery", "small-parts"],
  cover: ["#facc15", "#f97316"],
  source: "community",
  likes: 980,
  builds: 1210,
  components: [
    { id: "c_fairy", name: "Copper wire fairy lights, 2 m, with 2×AA box", qty: 1, unitPriceUSD: 3, purpose: "The light source with built-in switch.", alternatives: [{ name: "Leftover holiday fairy lights", note: "Battery-powered types only.", household: true }] },
    { id: "c_jar", name: "Glass jar with lid", qty: 1, unitPriceUSD: 0, purpose: "The lantern body.", alternatives: [{ name: "Plastic bottle with the top cut off", note: "Shatter-proof option for young children.", household: true }] },
    { id: "c_frost", name: "Frosted glass spray or white tissue paper + PVA glue", qty: 1, unitPriceUSD: 4, purpose: "Diffuses light for a soft glow.", alternatives: [{ name: "Tissue paper and diluted school glue", note: "Brush on in thin layers.", household: true }] },
    { id: "c_aa", name: "AA batteries", qty: 2, unitPriceUSD: 0.5, purpose: "Power.", alternatives: [{ name: "Rechargeable NiMH AA", priceUSD: 2.5, note: "Better for the planet." }] },
    { id: "c_twine", name: "Twine or ribbon for a handle", qty: 1, unitPriceUSD: 0, purpose: "Decoration and hanging.", alternatives: [], optional: true },
  ],
  tools: [{ name: "Paintbrush" }, { name: "Scissors" }],
  wiring: {
    summary: "The fairy light string plugs directly into its battery box with a built-in switch. No wiring required.",
    nodes: ["2×AA battery box", "Fairy light string"],
    connections: [
      { from: "2×AA battery box", fromPin: "+3V", to: "Fairy light string", toPin: "Wire +", wire: "red" },
      { from: "2×AA battery box", fromPin: "GND", to: "Fairy light string", toPin: "Wire −", wire: "black" },
    ],
    notes: ["Keep the battery box outside or taped under the lid so you can switch it easily."],
  },
  steps: [
    { id: "s1", title: "Clean the jar", detail: "Wash and dry the jar, removing labels with warm soapy water.", minutes: 10 },
    { id: "s2", title: "Frost the jar", detail: "Brush tissue paper pieces onto the outside with diluted PVA glue in overlapping layers, or spray a frost coat outdoors.", minutes: 20, warning: "Use spray paints only outdoors, with a mask and away from flames." },
    { id: "s3", title: "Coil the lights", detail: "Loosely bunch the copper string and drop it into the jar, spreading the LEDs evenly.", minutes: 5 },
    { id: "s4", title: "Mount the battery box", detail: "Tape the box to the inside of the lid or tie it to the handle so the switch is reachable.", minutes: 10 },
    { id: "s5", title: "Decorate", detail: "Add a twine handle, paper stars or a painted pattern.", minutes: 15 },
  ],
  safety: [
    { level: "caution", hazard: "battery", title: "Button and AA batteries", detail: "Keep batteries away from small children; swallowed button cells are extremely dangerous. Remove batteries when storing the lantern.", saferAlternative: "Use a battery box with a screw-closed lid." },
    { level: "caution", hazard: "chemicals", title: "Spray frosting", detail: "Aerosol paints release fumes. Spray only outdoors with adult supervision and a mask.", saferAlternative: "Use tissue paper and school glue instead." },
  ],
  testing: ["Lights turn on and off with the switch.", "Glow looks even from all sides.", "Battery box stays cool after an hour."],
  troubleshooting: [
    { problem: "Lights don't turn on", fix: "Check battery orientation and try fresh batteries." },
    { problem: "Bright hot spots", fix: "Add another tissue layer or spread the LEDs more evenly." },
  ],
  upgrades: ["Add a light sensor so it turns on at dusk.", "Use a USB-powered string for permanent display.", "Make a matching set for a party."],
  author: { name: "Sofia Rossi", handle: "@sofia.crafts" },
};

const retroConsole: ProjectPlan = {
  id: "proj_retro_console",
  slug: "raspberry-pi-retro-console",
  title: "Raspberry Pi Retro Game Console",
  tagline: "A pocket-sized TV console for classic games you own, from a Pi Zero 2 W.",
  emoji: "🕹️",
  categories: ["Raspberry Pi", "Low-Cost Alternatives"],
  difficulty: "Intermediate",
  overview:
    "Set up a Raspberry Pi Zero 2 W with open-source retro gaming software, two USB controllers and a custom case. It plugs into any TV with HDMI. A fun intro to Linux and single-board computers.",
  howItWorks:
    "The Pi runs a Linux-based emulation front-end that loads game ROMs you legally own and maps them to USB controllers. HDMI carries video and sound to the TV.",
  timeHours: 3,
  retailComparison: { product: "Licensed mini retro console", priceUSD: 99 },
  hazards: ["heat", "small-parts"],
  cover: ["#ef4444", "#8b5cf6"],
  source: "community",
  likes: 2710,
  builds: 960,
  components: [
    { id: "c_pi", name: "Raspberry Pi Zero 2 W", qty: 1, unitPriceUSD: 15, purpose: "The computer.", alternatives: [{ name: "Raspberry Pi 4 / 5 you already own", note: "Faster, plays more systems.", household: true }] },
    { id: "c_sd", name: "32 GB microSD card (A1)", qty: 1, unitPriceUSD: 6, purpose: "Stores the OS and games.", alternatives: [] },
    { id: "c_pad", name: "USB game controllers", qty: 2, unitPriceUSD: 6, purpose: "Players' input.", alternatives: [{ name: "Bluetooth controllers you own", note: "Pair them in settings.", household: true }] },
    { id: "c_otg", name: "Micro-USB OTG hub", qty: 1, unitPriceUSD: 5, purpose: "Connects two controllers to the Zero.", alternatives: [] },
    { id: "c_hdmi", name: "Mini-HDMI to HDMI cable", qty: 1, unitPriceUSD: 4, purpose: "Video to the TV.", alternatives: [] },
    { id: "c_psu", name: "5 V 2.5 A micro-USB power supply", qty: 1, unitPriceUSD: 8, purpose: "Stable power.", alternatives: [{ name: "Good-quality phone charger (2 A+)", note: "Weak chargers cause random crashes.", household: true }] },
    { id: "c_case", name: "Case: cardboard, tin, or 3D-printed shell", qty: 1, unitPriceUSD: 0, purpose: "Protects the board.", alternatives: [{ name: "Old cassette tape case", note: "Fits a Pi Zero perfectly with a little trimming.", household: true }] },
    { id: "c_heatsink", name: "Small aluminium heatsink", qty: 1, unitPriceUSD: 1, purpose: "Keeps the processor cool.", alternatives: [] },
  ],
  tools: [{ name: "Computer with SD card reader" }, { name: "Craft knife", note: "For case cut-outs." }],
  wiring: {
    summary: "No wiring: everything plugs in via USB and HDMI.",
    nodes: ["Power supply", "Raspberry Pi Zero 2 W", "OTG hub", "Controllers", "TV"],
    connections: [
      { from: "Power supply", fromPin: "Micro-USB 5V", to: "Raspberry Pi Zero 2 W", toPin: "PWR IN", wire: "red" },
      { from: "Raspberry Pi Zero 2 W", fromPin: "USB data", to: "OTG hub", toPin: "Upstream", wire: "blue" },
      { from: "OTG hub", fromPin: "USB ports", to: "Controllers", toPin: "USB", wire: "white" },
      { from: "Raspberry Pi Zero 2 W", fromPin: "Mini-HDMI", to: "TV", toPin: "HDMI", wire: "purple" },
    ],
    notes: ["Use the port labelled USB (not PWR) for the hub."],
  },
  steps: [
    { id: "s1", title: "Flash the OS", detail: "Use Raspberry Pi Imager to write a retro gaming OS image to the microSD card and set your Wi-Fi.", minutes: 20 },
    { id: "s2", title: "Fit the heatsink", detail: "Stick the heatsink onto the processor chip.", minutes: 5 },
    { id: "s3", title: "First boot", detail: "Insert the card, connect HDMI, the hub and controllers, then power on. Configure controller buttons when prompted.", minutes: 20 },
    { id: "s4", title: "Add your games", detail: "Copy ROM backups of games you own over Wi-Fi to the roms folder, or use homebrew titles that are free to play.", minutes: 30 },
    { id: "s5", title: "Build the case", detail: "Cut openings for HDMI, power and USB, and vent holes over the heatsink.", minutes: 40 },
  ],
  safety: [
    { level: "caution", hazard: "heat", title: "Ventilation", detail: "The processor can reach 70 °C under load. Keep vent holes clear and avoid sealed plastic cases.", saferAlternative: "Use a metal tin case which spreads heat." },
    { level: "info", title: "Respect copyright", detail: "Only use ROMs of games you legally own, or free homebrew games. CraftIQ does not provide or link to game files." },
  ],
  testing: ["Console boots to the menu in under a minute.", "Both controllers work independently.", "A 30-minute session runs without slowdowns or a thermometer icon."],
  troubleshooting: [
    { problem: "Rainbow screen or reboots", fix: "Use a stronger 2.5 A power supply and a shorter cable." },
    { problem: "No sound on TV", fix: "Set audio output to HDMI in settings." },
  ],
  upgrades: ["Add a power button with safe shutdown.", "Build a handheld with a small screen and battery.", "Arcade stick with buttons and a joystick."],
  author: { name: "Marcus Lee", handle: "@retromarcus" },
};

const robotArm: ProjectPlan = {
  id: "proj_robot_arm",
  slug: "cardboard-robotic-arm",
  title: "Cardboard Robotic Arm",
  tagline: "A 4-axis servo arm made from cardboard, controlled by knobs or your laptop.",
  emoji: "🦾",
  categories: ["Robotics", "Arduino", "Recycled Materials"],
  difficulty: "Intermediate",
  overview:
    "Four SG90 micro servos and an Arduino bring a recycled cardboard arm to life. Four potentiometers act as joysticks for each joint, and you can record and replay movements. Teaches mechanics, servos and analog input.",
  howItWorks:
    "Each potentiometer gives a voltage the Arduino reads and maps to an angle from 0° to 180°. The Arduino sends matching signals to each servo, so the arm copies the knob positions.",
  timeHours: 6,
  retailComparison: { product: "Desktop robotic arm kit", priceUSD: 60 },
  hazards: ["sharp-tools", "heat", "small-parts"],
  cover: ["#14b8a6", "#6366f1"],
  source: "community",
  likes: 1420,
  builds: 530,
  components: [
    { id: "c_servo", name: "SG90 micro servos", qty: 4, unitPriceUSD: 2, purpose: "Move each joint.", alternatives: [{ name: "MG90S metal-gear servos", priceUSD: 3.5, note: "Stronger and longer lasting." }] },
    { id: "c_nano", name: "Arduino Nano", qty: 1, unitPriceUSD: 6, purpose: "Reads knobs and drives servos.", alternatives: [] },
    { id: "c_pot", name: "10 kΩ potentiometers", qty: 4, unitPriceUSD: 0.5, purpose: "Control knobs.", alternatives: [{ name: "Joystick modules", priceUSD: 1.5, note: "Two joysticks control four axes." }] },
    { id: "c_psu", name: "5 V 2 A USB supply (separate from Arduino USB)", qty: 1, unitPriceUSD: 5, purpose: "Servos need more current than USB from a laptop can give.", alternatives: [{ name: "Old phone charger", note: "2 A or more.", household: true }] },
    { id: "c_cardboard", name: "Corrugated cardboard, skewers, bottle caps", qty: 1, unitPriceUSD: 0, purpose: "Arm structure and joints.", alternatives: [{ name: "Popsicle sticks", priceUSD: 2, note: "Stiffer links." }] },
    { id: "c_bb", name: "Breadboard and jumper wires", qty: 1, unitPriceUSD: 4, purpose: "Connections.", alternatives: [] },
  ],
  tools: [{ name: "Craft knife and cutting mat" }, { name: "Hot glue gun" }, { name: "Ruler and pencil" }, { name: "Computer with Arduino IDE" }],
  wiring: {
    summary: "Servo signals on D3, D5, D6, D9; potentiometer wipers on A0–A3; servos powered from a separate 5 V supply with a common ground.",
    nodes: ["Arduino Nano", "Servos ×4", "Potentiometers ×4", "5V supply"],
    connections: [
      { from: "5V supply", fromPin: "5V", to: "Servos ×4", toPin: "V+ (red)", wire: "red" },
      { from: "5V supply", fromPin: "GND", to: "Arduino Nano", toPin: "GND", wire: "black" },
      { from: "Arduino Nano", fromPin: "D3 / D5 / D6 / D9", to: "Servos ×4", toPin: "Signal (orange)", wire: "orange" },
      { from: "Potentiometers ×4", fromPin: "Wipers", to: "Arduino Nano", toPin: "A0–A3", wire: "yellow" },
      { from: "Arduino Nano", fromPin: "5V / GND", to: "Potentiometers ×4", toPin: "Outer pins", wire: "white" },
    ],
    notes: ["Never power four servos from the Arduino 5 V pin; it will brown out."],
  },
  steps: [
    { id: "s1", title: "Cut the arm parts", detail: "Print or draw the template: base, shoulder, elbow link, and gripper jaws. Double-layer the cardboard for stiffness.", minutes: 60, warning: "Cut on a mat, away from fingers, with a sharp blade." },
    { id: "s2", title: "Centre the servos", detail: "Upload a sketch that sets all servos to 90°, then attach horns in the neutral position.", minutes: 15 },
    { id: "s3", title: "Assemble joints", detail: "Glue servos into the base and links, using skewers as hinge pins where needed.", minutes: 90 },
    { id: "s4", title: "Wire controls", detail: "Wire the potentiometers and servos on the breadboard per the diagram.", minutes: 40 },
    { id: "s5", title: "Upload control code", detail: "Map each analogRead (0–1023) to a safe angle range for each joint, e.g. gripper 20–90°.", minutes: 30 },
    { id: "s6", title: "Record and replay", detail: "Add a button that stores positions in an array and plays them back for a pick-and-place demo.", minutes: 60 },
  ],
  safety: [
    { level: "caution", hazard: "sharp-tools", title: "Lots of cutting", detail: "Take breaks, keep blades sharp, and let an adult handle cuts for younger makers.", saferAlternative: "Use pre-cut foam board pieces." },
    { level: "caution", hazard: "heat", title: "Hot glue", detail: "Hot glue guns burn. Keep the gun on its stand and cold water nearby." },
  ],
  testing: ["Each knob moves its joint smoothly.", "Gripper can pick up a bottle cap.", "Servos don't buzz constantly at rest (if they do, narrow the angle range)."],
  troubleshooting: [
    { problem: "Servos jitter", fix: "Use the separate supply, add a 470 µF capacitor across servo power, and check grounds." },
    { problem: "Arm sags", fix: "Shorten links, add counterweights, or upgrade the shoulder to an MG90S." },
  ],
  upgrades: ["Control from a web page with an ESP32.", "Add a camera for colour sorting.", "Replace cardboard with laser-cut plywood."],
  author: { name: "Noor Haddad", handle: "@noorrobotics" },
};

export const projects: ProjectPlan[] = [
  smartphoneProjector,
  plantWatering,
  smartLight,
  bluetoothSpeaker,
  lineRobot,
  jarLantern,
  retroConsole,
  robotArm,
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function planCostUSD(plan: Pick<ProjectPlan, "components">, includeOptional = true) {
  return plan.components
    .filter((c) => includeOptional || !c.optional)
    .reduce((sum, c) => sum + c.unitPriceUSD * c.qty, 0);
}

export function planMinutes(plan: Pick<ProjectPlan, "steps">) {
  return plan.steps.reduce((s, st) => s + st.minutes, 0);
}
