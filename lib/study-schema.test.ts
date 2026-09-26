import { describe, expect, it } from "vitest";
import { gradeAnswer, normalizeAnswer } from "./study-schema";

describe("study grading", () => {
  it("normalizes harmless formatting differences", () => { expect(normalizeAnswer("  Selectively Permeable! ")).toBe("selectively permeable"); });
  it("accepts configured fill-in variants", () => { expect(gradeAnswer("fill_blank", "semi permeable", "selectively permeable", ["semi-permeable"]).correct).toBe(true); });
  it("awards partial credit for enumeration", () => { expect(gradeAnswer("enumeration", "osmosis, diffusion", "diffusion, osmosis, facilitated diffusion").score).toBeCloseTo(2 / 3); });
  it("does not award duplicate enumeration credit", () => { expect(gradeAnswer("enumeration", "osmosis, osmosis", "diffusion, osmosis").score).toBe(.5); });
});
