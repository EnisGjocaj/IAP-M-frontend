import { StyleSheet } from "@react-pdf/renderer";

export const aiPdfStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0b1220",
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingBottom: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  brandText: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: 12,
    fontWeight: 700,
  },
  brandTagline: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  docSubtitle: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 3,
  },
  meta: {
    marginTop: 6,
    fontSize: 9,
    color: "#64748b",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
  },
  transcriptRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  transcriptRole: {
    width: 68,
    fontSize: 10,
    fontWeight: 700,
    color: "#334155",
  },
  transcriptContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
  },
  referenceItem: {
    marginBottom: 6,
  },
  referenceLabel: {
    fontSize: 10,
    color: "#0b1220",
  },
  referenceMeta: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#64748b",
  },
});
