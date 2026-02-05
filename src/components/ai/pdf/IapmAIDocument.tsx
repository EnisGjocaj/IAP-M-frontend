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
  if (s && e) return s === e ? `Page ${s}` : `Pages ${s}–${e}`;
  if (s) return `Page ${s}`;
  return "Pages —";
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
      <Page size="A4" style={aiPdfStyles.page}>
        <View style={aiPdfStyles.header}>
          <View style={aiPdfStyles.brandLeft}>
            {logoSrc ? <Image src={logoSrc} style={aiPdfStyles.logo} /> : null}
            <View style={aiPdfStyles.brandText}>
              <Text style={aiPdfStyles.brandName}>IAP-M</Text>
              <Text style={aiPdfStyles.brandTagline}>AI Study Tools</Text>
            </View>
          </View>

          <View style={aiPdfStyles.headerRight}>
            <Text style={aiPdfStyles.docTitle}>{title}</Text>
            {subtitle ? <Text style={aiPdfStyles.docSubtitle}>{subtitle}</Text> : null}
            <Text style={aiPdfStyles.meta}>Generated: {formatDate(date)}</Text>
          </View>
        </View>

        {Array.isArray(sections) && sections.length > 0
          ? sections.map((s, idx) => (
              <View key={`${s.title}-${idx}`} style={aiPdfStyles.section}>
                <Text style={aiPdfStyles.sectionTitle}>{s.title}</Text>
                <Text style={aiPdfStyles.bodyText}>{s.content || ""}</Text>
              </View>
            ))
          : null}

        {Array.isArray(transcript) && transcript.length > 0 ? (
          <View style={aiPdfStyles.section}>
            <Text style={aiPdfStyles.sectionTitle}>Conversation</Text>
            {transcript.map((m, idx) => (
              <View key={`${m.role}-${idx}`} style={aiPdfStyles.transcriptRow}>
                <Text style={aiPdfStyles.transcriptRole}>{String(m.role).toUpperCase()}</Text>
                <Text style={aiPdfStyles.transcriptContent}>{m.content || ""}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {Array.isArray(references) && references.length > 0 ? (
          <View style={aiPdfStyles.section}>
            <Text style={aiPdfStyles.sectionTitle}>References</Text>
            {references.map((r) => (
              <View key={`${r.sourceNo}-${r.chunkId ?? "x"}`} style={aiPdfStyles.referenceItem}>
                <Text style={aiPdfStyles.referenceLabel}>
                  Source {r.sourceNo}: {r.materialTitle}
                </Text>
                <Text style={aiPdfStyles.referenceMeta}>{pagesLabel(r)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={aiPdfStyles.footer}>
          <Text style={aiPdfStyles.footerText}>IAP-M • Academic Export</Text>
          <Text
            style={aiPdfStyles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            fixed
          />
        </View>
      </Page>
    </Document>
  );
};

export default IapmAIDocument;
