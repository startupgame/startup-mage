// Default funding types for random selection
export const DEFAULT_FUNDING_TYPES = [
  { type: "Equity", format: "$%amount% for %stake%% Equity in the Company" },
  { type: "Convertible Notes", format: "$%amount% via Convertible Notes" },
  {
    type: "SAFE",
    format: "$%amount% through a SAFE (Simple Agreement for Future Equity)",
  },
  { type: "Revenue-Based", format: "$%amount% in Revenue-Based Financing" },
  { type: "Venture Debt", format: "$%amount% in Venture Debt" },
  { type: "Crowdfunding", format: "$%amount% via Equity Crowdfunding" },
  { type: "Angel", format: "$%amount% from Angel Investors" },
  { type: "P2P", format: "$%amount% through Peer-to-Peer Lending" },
  {
    type: "Incubator",
    format: "$%amount% from an Incubator or Accelerator Program",
  },
  { type: "Corporate VC", format: "$%amount% via Corporate Venture Capital" },
  { type: "ICO", format: "$%amount% through an Initial Coin Offering (ICO)" },
  { type: "IEO", format: "$%amount% via an Initial Exchange Offering (IEO)" },
  { type: "Strategic", format: "