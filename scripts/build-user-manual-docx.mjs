/**
 * Builds USER_MANUAL.docx from USER_MANUAL.md using the docx library.
 * Run: node scripts/build-user-manual-docx.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mdPath = path.join(root, "USER_MANUAL.md");
const outPath = path.join(root, "USER_MANUAL.docx");

/** Turn markdown-ish inline **bold**, `code`, and [text](url) into TextRuns. */
function inlineRuns(text) {
  if (text == null || text === "") {
    return [new TextRun({ text: "" })];
  }
  let s = String(text);
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

  const runs = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: s.slice(last, m.index) }));
    }
    if (m[1] !== undefined) {
      runs.push(new TextRun({ text: m[1], bold: true }));
    } else {
      runs.push(new TextRun({ text: m[2], font: "Consolas" }));
    }
    last = re.lastIndex;
  }
  if (last < s.length) {
    runs.push(new TextRun({ text: s.slice(last) }));
  }
  return runs.length ? runs : [new TextRun({ text: s })];
}

function isTableSeparator(cells) {
  return cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s/g, "")));
}

function parseTableRow(line) {
  const parts = line.trim().split("|");
  if (parts.length < 2) return [];
  return parts.slice(1, -1).map((c) => c.trim());
}

function buildTable(tableLines) {
  const dataRows = [];
  let colCount = 0;
  for (const raw of tableLines) {
    const cells = parseTableRow(raw);
    if (!cells.length) continue;
    colCount = Math.max(colCount, cells.length);
    if (isTableSeparator(cells)) continue;
    dataRows.push(cells);
  }
  const widthTotal = 9000;
  const colW =
    colCount > 0
      ? Array.from({ length: colCount }, () => Math.floor(widthTotal / colCount))
      : [];

  const rows = dataRows.map(
    (cells) =>
      new TableRow({
        children: cells.map(
          (c) =>
            new TableCell({
              children: [new Paragraph({ children: inlineRuns(c) })],
            })
        ),
      })
  );

  return new Table({
    columnWidths: colW,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

function mdToDocChildren(lines) {
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "---") {
      children.push(new Paragraph({ text: "" }));
      i += 1;
      continue;
    }

    if (trimmed === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("# ") && !line.startsWith("##")) {
      children.push(
        new Paragraph({
          children: inlineRuns(line.slice(2).trim()),
          heading: HeadingLevel.TITLE,
        })
      );
      i += 1;
      continue;
    }

    if (line.startsWith("## ") && !line.startsWith("###")) {
      children.push(
        new Paragraph({
          children: inlineRuns(line.slice(3).trim()),
          heading: HeadingLevel.HEADING_1,
        })
      );
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          children: inlineRuns(line.slice(4).trim()),
          heading: HeadingLevel.HEADING_2,
        })
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      children.push(buildTable(tableLines));
      continue;
    }

    const bulletMatch = line.match(/^(\s*)-\s(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      const level = indent >= 2 ? 1 : 0;
      children.push(
        new Paragraph({
          children: inlineRuns(bulletMatch[2]),
          bullet: { level },
        })
      );
      i += 1;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      children.push(
        new Paragraph({
          children: inlineRuns(trimmed),
        })
      );
      i += 1;
      continue;
    }

    children.push(new Paragraph({ children: inlineRuns(line) }));
    i += 1;
  }

  return children;
}

const md = fs.readFileSync(mdPath, "utf8");
const lines = md.split(/\r?\n/);

const doc = new Document({
  title: "SquareScale User Manual",
  description: "End-user guide generated from USER_MANUAL.md",
  sections: [
    {
      properties: {},
      children: mdToDocChildren(lines),
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("Wrote", outPath);
