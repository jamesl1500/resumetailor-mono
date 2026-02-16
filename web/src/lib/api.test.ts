import { describe, expect, it } from "vitest";
import { buildOutputFiles, buildPreviewOutputFiles } from "./api";

describe("api helpers", () => {
  it("buildOutputFiles maps file paths to downloadable file objects", () => {
    const outputs = buildOutputFiles([
      "tailored/abc123/My Resume-tailored.pdf",
      "tailored/abc123/My Resume-tailored.docx",
    ], "abc123");

    expect(outputs).toHaveLength(2);
    expect(outputs[0].name).toBe("My Resume-tailored.pdf");
    expect(outputs[0].url).toContain("/tailor/download/abc123/");
    expect(outputs[0].url).toContain("My%20Resume-tailored.pdf");
  });

  it("buildPreviewOutputFiles adds preview URLs", () => {
    const outputs = buildPreviewOutputFiles([
      "tailored/xyz789/Resume-tailored.pdf",
    ], "xyz789");

    expect(outputs).toHaveLength(1);
    expect(outputs[0].url).toContain("/tailor/download/xyz789/");
    expect(outputs[0].previewUrl).toContain("/tailor/preview/xyz789/");
  });
});
