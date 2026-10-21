// One source for the car. The spec table and the ticker both read from
// here, so they can never disagree with each other.
export default {
  spec: [
    { k: "Chassis",     v: "Mazda MX-5 Mk4, ND" },
    { k: "Engine",      v: "Sealed" },
    { k: "Gearbox",     v: "ZF sequential" },
    { k: "Driver aids", v: "ABS and traction control" },
    { k: "Tyres",       v: "Goodyear hard compound slick and wet" },
    { k: "Allocation",  v: "Six sets of slicks per season" },
  ],
  // short form, for the scrolling strip
  ticker: [
    "Mazda MX-5 Mk4 ND",
    "Sealed engine",
    "ZF sequential",
    "ABS",
    "Traction control",
    "Goodyear control slicks",
    "Six sets a season",
  ],
};
