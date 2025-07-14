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
    padding: 30,
    fontFamily: 'Open Sans',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    border: '2px solid #2563EB',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B', // Slate-800
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: '#2563EB',
    marginBottom: 10,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // Slate-200
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
  skillItem: {
    backgroundColor: '#F1F5F9', // Slate-100
    padding: '6 10',
    borderRadius: 4,
  },
  skillText: {
    fontSize: 10,
    color: '#334155',
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  educationDetails: {
    fontSize: 10,
    color: '#64748B', // Slate-500
  },
  trainingItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F8FAFC', // Slate-50
    borderRadius: 4,
  },
  trainingTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  trainingDetails: {
    fontSize: 10,
    color: '#64748B',
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
    marginRight: 8,
  },
  socialLinks: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
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
});