export function formatOrderNumber(sequence: bigint, year = new Date().getUTCFullYear()) { return `DIG-${year}-${sequence.toString().padStart(6, "0")}`; }
