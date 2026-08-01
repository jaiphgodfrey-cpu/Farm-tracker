<p align="center">
  <img src="bite-farm-logo.png" alt="Japhe Farm logo" width="420">
</p>

# Japhe Farm: Onion Tracker

A phone based farm activity tracker and agronomy advisor, built around one grower's onion crop in Tanzania and designed to work fully offline once it's on the phone.

Live app: https://jaiphgodfrey-cpu.github.io/Farm-tracker/

## The problem

Growing onions well depends on doing a long list of things at roughly the right time: preparing the nursery bed at the right rate, transplanting at the right spacing, top dressing on a schedule, watching for thrips and blotch before they spread, curing bulbs properly after harvest. None of that knowledge lives in one place for a smallholder. It's split across university extension PDFs, training decks from projects like KALRO or JICA's SHEP PLUS, product labels with instructions written for a different country's retail packaging, and whatever a farmer remembers from the last season or picked up from a neighbor.

The cost of that gap is not abstract. During this project the farmer mixed CAN with DAP and applied it to three week old onion seedlings in the nursery, based on what seemed like a reasonable combination at the time. It damaged the seedlings. The chemistry behind why that combination is risky, and why DAP itself is dangerous that close to germinating seed, is documented in places like Purdue's Vegetable Crops Hotline and Mosaic Crop Nutrition's own guidance, but that information was not in front of the farmer at the moment the decision got made. It was standing in a field, holding two bags, with no reference material and no memory aid.

The other half of the problem is more practical. This farmer works from an Android phone with an unreliable 3G connection and no laptop. Most farm management software assumes a desktop, a stable connection, and often a much larger commercial operation measured in hectares with GPS field mapping. None of that fits a smallholder with a handful of raised beds who needs something that opens fast, works when the signal drops, and doesn't burn through a phone battery that's often sitting well under twenty percent by mid morning.

## The solution

Japhe Farm is a single HTML file. There is no build step, no server, no account to create, and no dependency on a live connection once the page has loaded once. React is pulled in from a public CDN the first time the app opens, after which everything runs locally in the browser and all data is stored on the phone itself through localStorage. Install it to the home screen and it behaves like a normal app: full screen, its own icon, no browser address bar in the way.

The core idea is that the app should not just be a place to write things down. A plain logbook already exists in the farmer's head and on scraps of paper. What the app adds is a layer of reasoning sitting on top of the log: it watches what has actually been recorded, works out what stage the crop is genuinely at, and checks that against a body of sourced agronomy guidance to surface what matters right now. Every piece of guidance in the app traces back to a real, checkable source. Nothing is generated from general impressions of how onions probably grow. Where sources disagree, as they sometimes do between Kenyan and South African extension guides, the app shows both rather than silently picking one.

## What the app does and how

**Logging.** Two kinds of entries get recorded. Events are things that were done: sowing, transplanting, weeding, fertilizing, spraying, harvest. Observations are things that were seen: what growth stage the plant looks like it's at, leaf colour, soil moisture, any pest or disease symptoms. Some events are one time milestones that mark a season's shape, others are recurring actions that get logged again and again through the season.

**Home.** The first screen a farmer sees. A hero panel shows how many days it's been since sowing and what phase of growth that implies. Below it, once the Area Calculator has been used, a farm area summary shows total plots and square metres. Next Action cards rank the recurring jobs by how overdue they actually are, not by a fixed checklist order, so something genuinely neglected always surfaces above something done yesterday. The most recent field observation is shown directly. If the engine has detected something worth immediate attention, a threat card appears here too, though it fades on its own after a day or as soon as something new gets logged, so Home doesn't stay cluttered with an issue that's already been acted on.

**Why.** This is where the reasoning behind everything on Home is laid out in full: field health detail behind any threat, the current stage's advisory, the sourced guidance behind each routine action, and guardrail notes. Guardrails are a specific kind of feedback that only makes sense after the fact, for example flagging that fertilizer was applied unusually late relative to transplanting, based on the dates already logged. Nothing on this screen changes what's been recorded. It only explains it.

**History.** The full record: every event, every observation, laid out as a season timeline.

**Settings.** Where new entries get added, and where the Calculator suite and backup and restore live.

**The engine.** Underneath the screens is the part that does the actual reasoning. It works out what season phase the crop is in by walking the chronological sequence of milestones rather than trusting a single date, which matters because a leftover harvest record from a previous season shouldn't be able to seal a new one shut. It checks whether the criteria for moving into the next growth stage have genuinely all been recorded and satisfied, not just some of them, and never claims something is complete on partial evidence. It tracks one time actions, like removing nursery shade after sun scorch, as small sequences across multiple observations so a skipped step still resolves correctly later. It runs a threat map that matches logged symptoms against a set of pest and disease rules, each one checked directly against its original source text before being added, with one candidate disease dropped entirely after its supporting citation turned out to be fabricated. And it runs a fertilizer safety check that is deliberately written to be crop agnostic, because the chemistry behind why urea is dangerous near germinating seed, or why calcium containing and phosphate containing fertilizers shouldn't be mixed, doesn't change between onions and whatever gets planted next.

**The Calculator suite.** Three tools live under Settings. The Area Calculator lets a farmer build up a total land area by adding individual plots, rectangles, trapezoids, right triangles or scalene triangles, one at a time, which matters because real beds are rarely uniform and a single land shaped like one shape almost never happens. The Foliar, Herbicide and Insecticide calculator turns a product's dilution rate and a farmer's own sprayer coverage into a tank count and a number of bottles to buy, and includes a calibration tool that has the farmer spray a small measured test patch with plain water so the app can work out real coverage instead of asking for a guess. The Granular Fertilizer calculator works out how many kilograms to buy either from an area based rate or from a plant count derived from row and plant spacing, and offers suggested rates only for the specific fertilizer type they were actually measured for, since twenty grams of DAP and twenty grams of CAN put very different amounts of nitrogen into the soil.

## The bridge it connects

Most of the knowledge this app relies on already exists. KALRO has published it. JICA's SHEP PLUS project has published it. University extension services in Oregon and Washington have published detailed sprayer calibration methods. None of that writing was produced with a specific smallholder's Tuesday afternoon in mind. It sits in PDFs, written for a general audience, assuming a reader who has time to cross reference a spacing table against their own field before deciding what to do.

What this app does is sit between that body of research and the specific, dated, located facts of one person's crop. It takes a spacing recommendation written for onions in general and turns it into a plant count for this farmer's actual measured beds. It takes a dilution rate printed for a research trial's per hectare application and turns it into a number of bottles to buy for a sprayer this farmer actually owns, calibrated against water this farmer actually measured. It takes a nitrogen top dress schedule from a training deck and ties it to the exact day count since this farmer's own transplanting date, logged by this farmer, on this phone.

It also runs the other direction. A record of what actually happened in this field, the mistakes included, becomes something the engine can reason about without ever being allowed to treat those mistakes as a new normal to recommend. The CAN and DAP incident that started the fertilizer safety work is now permanently the reason that check exists, but the check itself is written from the underlying chemistry, not from that one afternoon.

The result is meant to be a short distance between reading and doing. The research existed before this app did. What didn't exist was a way to carry it into a specific field, on a specific phone, on a day with a weak signal and a bag of fertilizer already in hand.

## Files in this project

- `index.html`: the entire app, markup, styles, and the React based logic, engine, and calculators, all in one file with no build step
- `manifest.json`: describes the app to the phone's operating system so it can be installed to the home screen (see below)
- `sw.js`: service worker, handles offline caching so the app keeps working without a connection once installed
- `icon-192.png`, `icon-512.png`: home screen and splash icons, favicon, the bite-ring mark with no text
- `bite-farm-logo.svg`, `bite-farm-logo.png`: the full lockup, six-ring mark with the Apple-style bite through the outer five rings, "FARM" nested in the bite, used as this README's header image and the app's loading splash
- `README.md`: this file
- `CALCULATOR_README.md`: a detailed explanation of how the Area, Spray and Fertilizer calculators work, including the sourcing behind every suggested rate

## What manifest.json actually does

A plain website opened in a phone browser stays a website: address bar, browser menu, a bookmark icon if you're lucky. `manifest.json` is what turns it into something the phone treats like a real app. It tells the browser what to call the app on the home screen, which icon to use, what colour to show behind the status bar and on the splash screen while it loads, and crucially, that it should open in standalone display mode with none of the browser's own interface showing. Without it, "Add to Home Screen" either doesn't offer the proper install prompt at all or drops the app onto the home screen as a bare bookmark with a generic icon and the browser chrome still wrapped around it every time it opens. It's a small file, but it's the difference between Japhe Farm feeling like an app and feeling like a link.

The icons referenced in this version use the bite-ring mark, six concentric onion-inspired rings with an Apple-style bite cut through the outer five, the innermost ring left whole. Built from proportions measured directly off a real onion cross-section rather than guessed. The same mark appears three places outside the manifest: the browser tab favicon, a splash screen shown for the moment before the app finishes loading, and the header of this README.
