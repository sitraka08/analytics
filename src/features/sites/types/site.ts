/** Fields safe to hand to the client: the owner's internal id stays on the server. */
export type SiteSummary = {
  id: string;
  name: string;
  domain: string;
  publicKey: string;
  createdAt: Date;
};
