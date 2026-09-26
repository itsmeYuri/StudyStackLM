---
name: StudyStackLM
description: A source-grounded study workspace shaped like a warm, precise shared ledger.
colors:
  paper: "#F5F1E8"
  sheet: "#FFFDF8"
  ink: "#172033"
  muted-ink: "#596273"
  rule: "#D9D3C7"
  cobalt: "#275DFF"
  cobalt-dark: "#1744CE"
  coral: "#FF6B57"
  mint: "#B9E6D3"
  quiet-fill: "#F1EEE6"
  blue-wash: "#DFE6FF"
  highlight: "#FFE49A"
  danger: "#D4382C"
  success-fill: "#DFF4EA"
  error-fill: "#FFE1DC"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5625rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.015em"
  control:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  mark: "4px"
  document: "7px"
  choice: "9px"
  control: "10px"
  feedback: "12px"
  surface: "14px"
  mobile-dock: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-dark}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  text-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "45px"
  badge-ready:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 9px"
    height: "25px"
  paper-panel:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: StudyStackLM

## Overview

**Creative North Star: "The Cited Study Ledger"**

StudyStackLM feels like a shared study desk prepared before a focused session: warm paper, precisely ruled sheets, stacked lesson pages, clear tabs, and confident ink. Its editorial asymmetry gives source material and generated study objects distinct physical presence while the interface remains fast to scan and easy to operate.

The visual system makes provenance tangible. Cobalt links actions and citations, coral flags attention and draft states, mint confirms ready or correct states, and ruled lines connect study content to its source. The result should feel academically responsible and encouraging, with the warmth of a notebook and the order of a ledger.

**Key Characteristics:**

- Warm paper canvas with brighter working sheets.
- Fraunces-led editorial hierarchy paired with compact Manrope controls.
- Asymmetric stacks, source tabs, ruled backgrounds, and restrained rotations.
- Cobalt actions, coral attention, and mint verification with text or icons reinforcing every state.
- Dense study tools framed by quiet margins and one dominant work area.

## Colors

The palette combines warm paper neutrals with crisp cobalt ink, coral highlighter, and mint verification tones.

### Primary

- **Cobalt Ink** (`#275DFF`): Primary actions, current location, progress, links, focus outlines, and citation affordances.
- **Deep Cobalt** (`#1744CE`): Hover state for primary actions and stronger blue emphasis.
- **Blue Wash** (`#DFE6FF`): Selected answers and source chips.

### Secondary

- **Coral Highlighter** (`#FF6B57`): Draft labels, active group markers, attention, and incorrect-answer emphasis.
- **Red Pen** (`#D4382C`): Destructive actions only.
- **Correction Wash** (`#FFE1DC`): Incorrect answer feedback and recoverable errors.

### Tertiary

- **Verified Mint** (`#B9E6D3`): Ready sources, correct answers, and reassuring completion states.
- **Study Highlight** (`#FFE49A`): Inline source excerpts and memory callouts that mimic a physical highlighter.
- **Correct Wash** (`#DFF4EA`): Positive answer feedback.

### Neutral

- **Desk Paper** (`#F5F1E8`): The page canvas and scrollbar track.
- **Fresh Sheet** (`#FFFDF8`): Panels, inputs, reading surfaces, and raised navigation states.
- **Ledger Ink** (`#172033`): Primary text, navigation rail, and strong dark surfaces.
- **Pencil Note** (`#596273`): Supporting copy and metadata.
- **Faint Rule** (`#D9D3C7`): Dividers, field borders, and table structure.
- **Quiet Fill** (`#F1EEE6`): Choice rows and grouped controls at rest.
- **Pure White** (`#FFFFFF`): Text and icons on cobalt and other dark surfaces.

### Named Rules

**The Ink Economy Rule.** Use cobalt for action, location, progress, and provenance; coral for attention; mint for verified or correct states. Their meaning depends on restraint.

**The Evidence Rule.** Never communicate correctness, error, readiness, or selection through color alone; pair color with direct copy, an icon, a border, or a state label.

## Typography

**Display Font:** Fraunces (with Georgia and serif fallbacks)  
**Body Font:** Manrope (with Arial and sans-serif fallbacks)

**Character:** Fraunces gives lessons, questions, and scores the authority of an edited study guide. Manrope keeps navigation, metadata, labels, forms, and actions compact, contemporary, and immediately legible.

### Hierarchy

- **Display** (650, `clamp(2.5rem, 5vw, 4rem)`, 1): Page headings and primary study prompts; large landing statements may extend to `clamp(54px, 6vw, 88px)`.
- **Headline** (650, `2rem`, 1.08): Panel headings, section introductions, and editor titles.
- **Title** (650, `1.5625rem`, 1.2): Material titles, list headings, and compact editorial moments.
- **Body** (400, `1rem`, 1.7): Explanations and supporting copy; long study text expands to a 2.0 line-height and stays near 68 characters per line.
- **Label** (800, `0.8125rem`, `0.015em`): Field labels, badges, metadata, and compact status copy.
- **Control** (750, `0.875rem`, 1.2): Buttons and navigation actions.

### Named Rules

**The Two-Hand Rule.** Fraunces carries the lesson and the question; Manrope carries the interface around them.

**The Study-Text Rule.** Reading surfaces get generous line-height and controlled measure, while controls remain compact and weight-forward.

## Layout

The desktop application uses a three-part ledger: a 76px dark group rail, a 240px contextual navigation column, and a flexible work surface. At widths below 980px the contextual column collapses and the rail narrows to 68px. Below 680px both rails give way to a fixed bottom dock, the work surface becomes full width with 16px side padding, and stacked forms collapse to one column.

The landing page sits inside a 1180px maximum container and uses asymmetric two-column grids. Operational screens pair one dominant work area with a 290–320px supporting column; supporting columns become inline at 900px. Repeated gaps draw from an 8–32px rhythm, while major sections use 38–110px separation to preserve a calm study cadence.

Study modes deliberately remove the application shell. Quiz content is capped near 780px, reviewer content near 900px, and source citations open beside the work on wide screens or as a nearly full-height bottom sheet on small screens.

**The Quiet Margin Rule.** Dense controls may sit close together inside the active object, but the active object itself must retain clear space from navigation and neighboring work.

## Elevation & Depth

The system uses soft downward shadows to make sheets feel stacked on a desk. Depth is structural: it separates working papers, menus, drawers, and mobile navigation from the warm canvas. Ruled backgrounds, one-pixel dividers, rotations, and overlapping edges do as much work as shadows; avoid luminous halos or decorative glass effects.

### Shadow Vocabulary

- **Paper lift** (`0 16px 38px rgba(34, 40, 52, .12)`): Default raised sheet and panel.
- **Primary action** (`0 8px 18px rgba(39, 93, 255, .22)`): Cobalt buttons only.
- **Secondary action** (`0 7px 16px rgba(34, 40, 52, .10)`): Pale secondary buttons.
- **Navigation lift** (`0 5px 13px rgba(30, 35, 45, .08)`): Active or hovered contextual navigation.
- **Hero stack** (`0 24px 50px rgba(30, 35, 45, .16)`): Oversized overlapping lesson and practice sheets.
- **Drawer edge** (`-18px 0 42px rgba(23, 32, 51, .20)`): Desktop citation drawer separation.

### Named Rules

**The Soft-Lift Rule.** Raise complete sheets and active navigation; keep lists and controls flat until interaction gives them a reason to move.

## Shapes

The form language comes from clipped paper and soft notebook hardware. Content surfaces use 14px corners, controls use 10px, answer feedback uses 12px, and tags use full pills. Document icons and stacked sheets may use 7px corners or the asymmetric `8px 14px 14px 8px` silhouette. Small rotations from roughly -3 to 5 degrees are reserved for literal stacks of study material.

Rules and borders should explain structure: a divider separates rows, a dashed outline invites upload, and an inset cobalt stroke marks a selected answer. Avoid outlining every container. The three-layer logo mark uses 4px corners and offset, rotated slabs to establish the stacked-paper motif at the smallest scale.

**The Ledger Shape Rule.** Rounded rectangles should read as sheets, controls, or status labels; do not turn the interface into a field of interchangeable cards.

## Components

### Buttons

- **Shape:** Compact, gently rounded controls (10px) with a 44px minimum height and 18px horizontal padding.
- **Primary:** Cobalt fill with white text and a controlled blue shadow; reserve it for the next meaningful action.
- **Hover / Focus:** Hover darkens to Deep Cobalt and lifts by 1px over 180ms. Keyboard focus uses a 3px cobalt outline with a 3px offset.
- **Secondary / Quiet / Danger:** Secondary buttons use Fresh Sheet with Ledger Ink and a neutral shadow. Quiet buttons begin transparent with Pencil Note text. Danger uses Red Pen and appears only for destructive actions.
- **Disabled:** Reduce opacity to 50%, remove lift, and use the not-allowed cursor.

### Chips

- **Style:** Status badges are 25px-high pills with 2px by 9px padding, 12px bold labels, and a subtle tracking increase.
- **State:** Neutral marks categories, blue marks source context, mint marks ready or correct, and coral marks drafts or attention. Citation chips use Blue Wash, a book icon, and under-44px compact sizing only when embedded inside a larger accessible target region.

### Cards / Containers

- **Corner Style:** Paper surfaces use a 14px radius; document tiles use 7–12px depending on scale.
- **Background:** Fresh Sheet on Desk Paper, with blue or coral washes used only when a material or status calls for them.
- **Shadow Strategy:** Use Paper lift for raised sheets and no shadow for table-like row groups.
- **Border:** Prefer one-pixel Faint Rule dividers inside lists; use dashed borders only for upload zones.
- **Internal Padding:** Compact rows use 17–23px; working panels use 24–38px; dedicated reading sheets may use 60px on wide screens and 22–30px on small screens.

### Inputs / Fields

- **Style:** Fresh Sheet fill, one-pixel Faint Rule border, 10px corners, 45px minimum height, and 10px by 12px padding.
- **Focus:** The global 3px cobalt focus outline remains visible outside the field.
- **Error / Disabled:** Error containers use Correction Wash with direct recovery copy. Disabled controls remain readable at 50% opacity.

### Navigation

The group rail is solid Ledger Ink with 44px square group controls. The contextual column uses translucent Desk Paper over blur, 14px Manrope labels, and a Fresh Sheet lift for active or hovered links. At mobile width, navigation becomes a 16px-radius dark bottom dock offset 12px from the viewport edges; labels stay visible beneath their icons.

### Answer Options

Answer options are substantial 62px-minimum rows on Quiet Fill. Their letter keys sit on small Fresh Sheet tiles. Selection changes the row to Blue Wash and adds a 2px inset cobalt stroke, so selection remains visible without relying on fill alone.

### Citation Drawer

Citation triggers are compact blue source chips embedded beside generated content. The desktop drawer is a 480px side sheet with a strong leftward shadow; mobile turns it into a full-width bottom sheet with 18px top corners. The preview itself uses ruled paper, a cobalt source tab, and inline Study Highlight behind the supporting excerpt. Motion lasts 240ms with a responsive ease and is removed in reduced-motion mode.

### Upload Zone

The uploader is a 210px-minimum dashed sheet with centered icon, direct instruction, accepted formats, and size guidance. Success shifts to a mint wash and green border; failure shifts to a pale coral wash and pairs the state with recovery text.

## Do's and Don'ts

### Do:

- **Do** keep source references visible and open them without making the student lose their place.
- **Do** use one dominant work area with supporting columns, quiet margins, and clear row structure.
- **Do** reserve cobalt for action, navigation, progress, and provenance; reserve coral and mint for their established meanings.
- **Do** pair every status color with explicit copy, an icon, a border, or a label.
- **Do** preserve 44px minimum targets, visible focus, keyboard flow, and reduced-motion behavior.
- **Do** use Fraunces for lesson authority and Manrope for operational clarity.

### Don't:

- **Don't** replace the study ledger with a uniform dashboard of interchangeable cards.
- **Don't** add glassy halos, heavy outlines, or decorative shadows that compete with the paper stack.
- **Don't** use coral or mint as arbitrary decoration; their semantic meaning must remain stable.
- **Don't** rotate ordinary panels; rotations belong to literal stacks of lesson or material sheets.
- **Don't** hide navigation labels on mobile or make a state legible only by color.
