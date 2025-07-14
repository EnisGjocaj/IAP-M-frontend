import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { cvStyles } from './cv-styles';

const CVTemplate = ({ studentData }) => (
  <Document>
    <Page size="A4" style={cvStyles.page}>
      <View style={cvStyles.container}>
        <View style={cvStyles.header}>
          <View style={cvStyles.profileImageContainer}>
            {studentData.profileImage && (
              <Image
                src={studentData.profileImage}
                style={cvStyles.profileImage}
              />
            )}
          </View>
          <View style={cvStyles.headerInfo}>
            <Text style={cvStyles.name}>{studentData.name}</Text>
            <Text style={cvStyles.title}>{studentData.faculty} Student</Text>
            <View style={cvStyles.contactInfo}>
              <View style={cvStyles.contactItem}>
                <Text>📧 {studentData.email}</Text>
              </View>
              <View style={cvStyles.contactItem}>
                <Text>📱 {studentData.phone}</Text>
              </View>
              <View style={cvStyles.contactItem}>
                <Text>📍 {studentData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={cvStyles.section}>
          <Text style={cvStyles.sectionTitle}>About Me</Text>
          <Text style={cvStyles.content}>{studentData.bio}</Text>
        </View>

        <View style={cvStyles.section}>
          <Text style={cvStyles.sectionTitle}>Education</Text>
          <View style={cvStyles.educationItem}>
            <View style={cvStyles.educationHeader}>
              <Text style={cvStyles.educationTitle}>{studentData.university}</Text>
              <Text style={cvStyles.educationDetails}>GPA: {studentData.academicData.currentGPA}</Text>
            </View>
            <Text style={cvStyles.educationDetails}>
              {studentData.faculty} • Year {studentData.year}
            </Text>
          </View>
        </View>

        <View style={cvStyles.section}>
          <Text style={cvStyles.sectionTitle}>Skills & Expertise</Text>
          <View style={cvStyles.skillsGrid}>
            {studentData.skillsAndBadges.skills.map((skill, index) => (
              <View key={index} style={cvStyles.skillItem}>
                <Text style={cvStyles.skillText}>
                  {skill.name} • {skill.level}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={cvStyles.section}>
          <Text style={cvStyles.sectionTitle}>Training & Certifications</Text>
          {studentData.trainingData.completed.map((training, index) => (
            <View key={index} style={cvStyles.trainingItem}>
              <Text style={cvStyles.trainingTitle}>{training.title}</Text>
              <Text style={cvStyles.trainingDetails}>
                Instructor: {training.instructor}
              </Text>
              <Text style={cvStyles.trainingDetails}>
                Completed: {training.completionDate} • Duration: {training.hours} hours
              </Text>
            </View>
          ))}
        </View>

        <View style={cvStyles.section}>
          <Text style={cvStyles.sectionTitle}>Achievements</Text>
          {studentData.skillsAndBadges.badges.map((badge, index) => (
            <View key={index} style={cvStyles.achievementItem}>
              <View style={cvStyles.bullet} />
              <Text style={cvStyles.content}>
                {badge.name} ({badge.date})
              </Text>
            </View>
          ))}
        </View>

        <View style={cvStyles.socialLinks}>
          <Text style={cvStyles.sectionTitle}>Professional Links</Text>
          {studentData.socialLinks.linkedin && (
            <View style={cvStyles.socialLink}>
              <Text style={cvStyles.content}>LinkedIn: {studentData.socialLinks.linkedin}</Text>
            </View>
          )}
          {studentData.socialLinks.github && (
            <View style={cvStyles.socialLink}>
              <Text style={cvStyles.content}>GitHub: {studentData.socialLinks.github}</Text>
            </View>
          )}
          {studentData.socialLinks.portfolio && (
            <View style={cvStyles.socialLink}>
              <Text style={cvStyles.content}>Portfolio: {studentData.socialLinks.portfolio}</Text>
            </View>
          )}
        </View>

        <View style={cvStyles.footer}>
          <Text>Generated via IAP-M Student Profile • {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default CVTemplate;
