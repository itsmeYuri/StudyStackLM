export const demoGroup = {
  id: "demo-biology",
  name: "Biology 11 — Cell Systems",
  subject: "General Biology",
  description: "Shared lessons and practice for our first-quarter coverage.",
  memberCount: 18,
};

export const demoSources = [
  { id: "cell-transport", title: "Cell Transport and Homeostasis.pptx", status: "ready", pages: 34, created_at: "2026-09-24T08:00:00Z" },
  { id: "membrane-review", title: "Membrane Structure Reviewer.pdf", status: "ready", pages: 12, created_at: "2026-09-25T08:00:00Z" },
];

export const demoMaterials = [
  { id: "demo-quiz", title: "Cell Transport Practice", type: "quiz", status: "published", itemCount: 8, updated_at: "2026-09-26T08:00:00Z" },
  { id: "demo-cards", title: "Membrane Terms", type: "flashcards", status: "published", itemCount: 16, updated_at: "2026-09-25T08:00:00Z" },
  { id: "demo-reviewer", title: "Homeostasis Reviewer", type: "reviewer", status: "draft", itemCount: 5, updated_at: "2026-09-26T08:00:00Z" },
];

export const demoQuestions = [
  { id: "q1", type: "multiple_choice", prompt: "Which process moves water across a selectively permeable membrane?", options: ["Active transport", "Osmosis", "Endocytosis", "Exocytosis"], answer: "Osmosis", explanation: "Osmosis is the passive movement of water through a selectively permeable membrane.", citation: "Cell Transport, slide 8" },
  { id: "q2", type: "true_false", prompt: "Active transport can move substances against their concentration gradient.", options: ["True", "False"], answer: "True", explanation: "Active transport uses cellular energy to move substances from lower to higher concentration.", citation: "Cell Transport, slide 15" },
  { id: "q3", type: "fill_blank", prompt: "The cell membrane is described as selectively ____.", options: [], answer: "permeable", explanation: "Selective permeability allows some substances to cross while restricting others.", citation: "Membrane Structure, page 3" },
  { id: "q4", type: "enumeration", prompt: "Name the three main forms of passive transport covered in the lesson.", options: [], answer: "diffusion, osmosis, facilitated diffusion", explanation: "All three move substances without direct cellular energy.", citation: "Cell Transport, slides 6–12" },
];
