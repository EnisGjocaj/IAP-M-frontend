import { StyleSheet, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ]
});

export const cvStyles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 46,
    paddingHorizontal: 34,
    fontFamily: 'Open Sans',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  watermark: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.04,
  },
  watermarkLogo: {
    width: 380,
    height: 380,
  },
  topBar: {
    height: 4,
    backgroundColor: '#2563EB',
    borderRadius: 999,
    marginBottom: 16,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
  sidebar: {
    width: 190,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    borderRightStyle: 'solid',
  },
  main: {
    flex: 1,
    paddingLeft: 2,
  },
  brandBlock: {
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  brandLogo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0B1220',
  },
  brandTagline: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  profileBlock: {
    marginTop: 8,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB', // Blue-600
    paddingBottom: 20,
  },
  profileImageContainer: {
    width: 120,
    marginRight: 20,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'solid',
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1220',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#475569',
  },
  title: {
    fontSize: 18,
    color: '#2563EB',
    marginBottom: 10,
  },
  sidebarSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    borderTopStyle: 'solid',
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#2563EB',
    marginBottom: 6,
  },
  sidebarText: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 3,
    lineHeight: 1.45,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactItem: {
    fontSize: 10,
    color: '#475569', // Slate-600
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    fontSize: 11,
    color: '#334155', // Slate-700
    lineHeight: 1.6,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#F1F5F9', // Slate-100
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'solid',
  },
  skillPillText: {
    fontSize: 9,
    color: '#334155',
  },
  skillItem: {
    backgroundColor: '#F1F5F9', // Slate-100
    padding: '6 10',
    borderRadius: 4,
  },
  skillText: {
    fontSize: 10,
    color: '#334155',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0B1220',
  },
  mainMeta: {
    fontSize: 9,
    color: '#64748B',
  },
  bodyText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 1.55,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0B1220',
    marginBottom: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  sectionRule: {
    height: 1,
    flexGrow: 1,
    backgroundColor: '#EEF2F7',
  },
  educationItem: {
    marginBottom: 15,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  educationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  trainingDetails: {
    fontSize: 10,
    color: '#64748B',
  },
  itemCard: {
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0B1220',
    flexShrink: 1,
    maxWidth: '70%',
  },
  itemMeta: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'right',
    maxWidth: '30%',
  },
  itemSub: {
    fontSize: 9.5,
    color: '#475569',
    lineHeight: 1.4,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    marginTop: 5,
  },
  achievementItem: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    fontSize: 8,
    color: '#94A3B8', // Slate-400
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#64748B',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    borderBottomStyle: 'solid',
  },
  tableHeaderRow: {
    backgroundColor: '#F8FAFC',
  },
  tableCellName: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 9.5,
    color: '#0B1220',
    fontWeight: 700,
    paddingRight: 8,
  },
  tableCellMeta: {
    width: 70,
    fontSize: 9,
    color: '#475569',
    textAlign: 'right',
  },
  tableCellMetaStrong: {
    width: 70,
    fontSize: 9,
    color: '#0B1220',
    textAlign: 'right',
    fontWeight: 700,
  },
});