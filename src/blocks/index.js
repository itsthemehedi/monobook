// Block registry: the "type" in content/pages/*.json picks the component here.
import * as H from './home.jsx';
import * as G from './general.jsx';
import * as W from './work.jsx';
import { StartHere, FaqAll } from './faq.jsx';
import { ContactForm } from './ContactForm.jsx';

export const BLOCKS = {
  hero: H.Hero,
  credstrip: H.CredStrip,
  statement: H.Statement,
  parts: H.Parts,
  pathstrip: H.PathStrip,
  pace: H.Pace,
  checklist: H.ChecklistBlock,
  proof: H.Proof,
  sixq: H.SixQ,
  fitblock: H.FitBlock,
  faqpick: H.FaqPick,
  finalcta: H.FinalCta,
  pagehead: G.PageHead,
  text: G.Text,
  partsdetail: G.PartsDetail,
  steps: G.Steps,
  sprint: G.TimedList,
  pacelist: G.TimedList,
  facts: G.FactsBlock,
  contact: G.Contact,
  contactform: ContactForm,
  backhome: G.BackHome,
  notfound: G.NotFound,
  casehead: W.CaseHead,
  casefacts: W.CaseFacts,
  caseimage: W.CaseImage,
  casegallery: W.CaseGallery,
  beforeafter: W.BeforeAfterBlock,
  changes: W.Changes,
  mayfairimage: W.MayfairImage,
  quote: W.QuoteBlock,
  starthere: StartHere,
  faqall: FaqAll,
};
