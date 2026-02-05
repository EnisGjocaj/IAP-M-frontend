import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { aiPdfStyles } from "./aiPdfStyles";

export type AiPdfMessage = {
  role: "USER" | "ASSISTANT" | "SYSTEM" | string;
  content: string;
};

export type AiPdfSection = {
  title: string;
  content: string;
};

export type AiPdfReference = {
  sourceNo: number;
  chunkId?: number;
  materialTitle: string;
  pageStart?: number | null;
  pageEnd?: number | null;
};

export type IapmAIDocumentProps = {
  title: string;
  subtitle?: string | null;
  generatedAt?: Date;
  logoSrc?: string | null;
  sections?: AiPdfSection[];
  transcript?: AiPdfMessage[];
  references?: AiPdfReference[];
};

const formatDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
};

const pagesLabel = (r: AiPdfReference) => {
  const s = r.pageStart ?? null;
  const e = r.pageEnd ?? null;
  if (s && e) return s === e ? `Faqja ${s}` : `Faqet ${s}–${e}`;
  if (s) return `Faqja ${s}`;
  return "Faqet —";
};

const renderMarkdown = (raw: string, keyPrefix: string) => {
  const text = String(raw || "");
  const lines = text.split(/\r?\n/);

  const nodes: React.ReactNode[] = [];
  let inCode = false;
  let codeBuf: string[] = [];

  const flushCode = () => {
    if (codeBuf.length === 0) return;
    nodes.push(
      <Text key={`${keyPrefix}-code-${nodes.length}`} style={aiPdfStyles.codeBlock}>
        {codeBuf.join("\n")}
      </Text>
    );
    codeBuf = [];
  };

  const renderList = (items: Array<{ bullet: string; content: string }>) => {
    nodes.push(
      <View key={`${keyPrefix}-list-${nodes.length}`} style={aiPdfStyles.list}>
        {items.map((it, idx) => (
          <View key={`${keyPrefix}-li-${nodes.length}-${idx}`} style={aiPdfStyles.listItem}>
            <Text style={aiPdfStyles.listBullet}>{it.bullet}</Text>
            <Text style={aiPdfStyles.listContent}>{it.content}</Text>
          </View>
        ))}
      </View>
    );
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        inCode = true;
      }
      i += 1;
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      i += 1;
      continue;
    }

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <Text key={`${keyPrefix}-h3-${nodes.length}`} style={aiPdfStyles.mdH3}>
          {trimmed.replace(/^###\s+/, "")}
        </Text>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <Text key={`${keyPrefix}-h2-${nodes.length}`} style={aiPdfStyles.mdH2}>
          {trimmed.replace(/^##\s+/, "")}
        </Text>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      nodes.push(
        <Text key={`${keyPrefix}-h1-${nodes.length}`} style={aiPdfStyles.mdH1}>
          {trimmed.replace(/^#\s+/, "")}
        </Text>
      );
      i += 1;
      continue;
    }

    const isUnordered = /^[-*]\s+/.test(trimmed);
    const isOrdered = /^\d+\.[)\]]?\s+/.test(trimmed);
    if (isUnordered || isOrdered) {
      const listItems: Array<{ bullet: string; content: string }> = [];
      while (i < lines.length) {
        const t = (lines[i] ?? "").trim();
        if (!t) {
          i += 1;
          break;
        }
        const u = /^[-*]\s+/.test(t);
        const o = /^\d+\.[)\]]?\s+/.test(t);
        if (!u && !o) break;

        if (u) {
          listItems.push({ bullet: "•", content: t.replace(/^[-*]\s+/, "") });
        } else {
          const m = t.match(/^(\d+)\.[)\]]?\s+(.*)$/);
          listItems.push({ bullet: `${m?.[1] ?? ""}.`, content: m?.[2] ?? t });
        }
        i += 1;
      }
      renderList(listItems);
      continue;
    }

    nodes.push(
      <Text key={`${keyPrefix}-p-${nodes.length}`} style={aiPdfStyles.paragraph}>
        {line}
      </Text>
    );
    i += 1;
  }

  if (inCode) {
    flushCode();
  }

  return nodes;
};

export const IapmAIDocument: React.FC<IapmAIDocumentProps> = ({
  title,
  subtitle,
  generatedAt,
  logoSrc,
  sections,
  transcript,
  references,
}) => {
  const date = generatedAt ?? new Date();

  return (
    <Document>
      <Page size="A4" style={aiPdfStyles.coverPage}>
        {logoSrc ? (
          <View style={aiPdfStyles.coverWatermark} fixed>
            <Image src={logoSrc} style={aiPdfStyles.coverWatermarkLogo} />
          </View>
        ) : null}
        <View style={aiPdfStyles.coverCenter}>
          {logoSrc ? <Image src={logoSrc} style={aiPdfStyles.coverLogo} /> : null}
          <Text style={aiPdfStyles.coverInstitute}>IAP-M</Text>
          <Text style={aiPdfStyles.coverDocType}>{title}</Text>
          <View style={aiPdfStyles.coverDivider} />
          {subtitle ? <Text style={aiPdfStyles.coverMeta}>{subtitle}</Text> : null}
          <Text style={aiPdfStyles.coverMeta}>Gjeneruar: {formatDate(date)}</Text>
        </View>
      </Page>

      <Page size="A4" style={aiPdfStyles.page}>
        {logoSrc ? (
          <View style={aiPdfStyles.watermark} fixed>
            <Image src={logoSrc} style={aiPdfStyles.watermarkLogo} />
          </View>
        ) : null}

        <View style={[aiPdfStyles.header, aiPdfStyles.headerFixed]} fixed>
          <View style={aiPdfStyles.brandLeft}>
            {logoSrc ? <Image src={logoSrc} style={aiPdfStyles.logo} /> : null}
            <View style={aiPdfStyles.brandText}>
              <Text style={aiPdfStyles.brandName}>IAP-M</Text>
              <Text style={aiPdfStyles.brandTagline}>Mjete studimi me AI</Text>
            </View>
          </View>

          <View style={aiPdfStyles.headerRight}>
            <Text style={aiPdfStyles.docTitle}>{title}</Text>
            {subtitle ? <Text style={aiPdfStyles.docSubtitle}>{subtitle}</Text> : null}
            <Text style={aiPdfStyles.meta}>Gjeneruar: {formatDate(date)}</Text>
          </View>
        </View>

        <View style={aiPdfStyles.content}>
          {Array.isArray(sections) && sections.length > 0
            ? sections.map((s, idx) => (
                <View
                  key={`${s.title}-${idx}`}
                  style={aiPdfStyles.section}
                  minPresenceAhead={160}
                >
                  <Text style={aiPdfStyles.sectionTitle} wrap={false}>
                    {s.title}
                  </Text>
                  <View>{renderMarkdown(s.content || "", `sec-${idx}`)}</View>
                </View>
              ))
            : null}

          {Array.isArray(transcript) && transcript.length > 0 ? (
            <View style={aiPdfStyles.section} minPresenceAhead={180}>
              <Text style={aiPdfStyles.sectionTitle} wrap={false}>
                Biseda
              </Text>
              {transcript.map((m, idx) => (
                <View
                  key={`${m.role}-${idx}`}
                  style={aiPdfStyles.transcriptRow}
                  wrap={false}
                  minPresenceAhead={110}
                >
                  <Text style={aiPdfStyles.transcriptRole}>{String(m.role).toUpperCase()}</Text>
                  <View style={{ flex: 1 }}>{renderMarkdown(m.content || "", `msg-${idx}`)}</View>
                </View>
              ))}
            </View>
          ) : null}

          {Array.isArray(references) && references.length > 0 ? (
            <View style={aiPdfStyles.section} minPresenceAhead={220}>
              <Text style={aiPdfStyles.sectionTitle} wrap={false}>
                Referencat
              </Text>
              <View style={aiPdfStyles.referencesTable}>
                {references.map((r, idx) => (
                  <View
                    key={`${r.sourceNo}-${r.chunkId ?? "x"}`}
                    style={{
                      ...aiPdfStyles.referenceRow,
                      ...(idx === references.length - 1 ? aiPdfStyles.referenceRowLast : {}),
                    }}
                    minPresenceAhead={60}
                  >
                    <View style={aiPdfStyles.referenceRowTop}>
                      <Text style={aiPdfStyles.sourceBadge}>#{r.sourceNo}</Text>
                      <Text style={aiPdfStyles.referenceTitle}>{r.materialTitle}</Text>
                    </View>
                    <Text style={aiPdfStyles.referenceMeta}>{pagesLabel(r)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={[aiPdfStyles.footer, aiPdfStyles.footerFixed]} fixed>
          <Text style={aiPdfStyles.footerText}>IAP-M • Eksport akademik</Text>
          <Text
            style={aiPdfStyles.footerText}
            render={({ pageNumber, totalPages }) => `Faqja ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export default IapmAIDocument;
