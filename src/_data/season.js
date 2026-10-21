// The season. One file drives the hero card, the calendar and the ticker.
//
// `rounds` empty  -> the site shows a pre-season state and claims nothing.
// `rounds` filled -> the calendar renders and js/main.js works out which
//                    round is next, the countdown, and the round statuses.
//
// For 2027 the Trophy runs on the BRSCC MX-5 SuperCup grid, so these are
// the SuperCup dates. Paste them in as soon as BRSCC publish the calendar.
export default {
  year: 2027,
  rounds: [
    // { round: 1, circuit: "Snetterton",     county: "Norfolk",          start: "2027-04-17", end: "2027-04-18" },
    // { round: 2, circuit: "Oulton Park",    county: "Cheshire",         start: "2027-05-08", end: "2027-05-08" },
    // { round: 3, circuit: "Donington Park", county: "Leicestershire",   start: "2027-06-05", end: "2027-06-06" },
  ],
};
