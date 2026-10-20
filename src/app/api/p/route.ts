// Collection endpoint used by the script. Neutral path: ad blockers block `/api/collect` on third-party
// sites. `/api/collect` stays for scripts still cached by visitors.
export { POST } from "../collect/route";
