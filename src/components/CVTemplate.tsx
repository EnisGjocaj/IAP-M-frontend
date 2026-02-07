import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { cvStyles } from './cv-styles';

const formatDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
};

const CVTemplate = ({ studentData }) => {
  const logoSrc = "/iap-m-logo.jpg";
  const today = new Date();

  const formatMaybeDate = (value: any) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return formatDate(d);
  };

  return (
    <Document>
      <Page size="A4" style={cvStyles.page}>
        <View style={cvStyles.watermark} fixed>
          <Image src={logoSrc} style={cvStyles.watermarkLogo} />
        </View>

        <View style={cvStyles.topBar} />

        <View style={cvStyles.layout}>
          <View style={cvStyles.sidebar}>
            <View style={cvStyles.brandBlock}>
              <Image src={logoSrc} style={cvStyles.brandLogo} />
              <Text style={cvStyles.brandName}>IAP-M</Text>
              <Text style={cvStyles.brandTagline}>Curriculum Vitae</Text>
            </View>

            <View style={cvStyles.profileBlock}>
              {studentData.profileImage ? (
                <Image src={studentData.profileImage} style={cvStyles.profileImage} />
              ) : null}
              <Text style={cvStyles.name}>{studentData.name}</Text>
              <Text style={cvStyles.subtitle}>{studentData.faculty} • Viti {studentData.year}</Text>
            </View>

            <View style={cvStyles.sidebarSection}>
              <Text style={cvStyles.sidebarSectionTitle}>Kontakt</Text>
              <Text style={cvStyles.sidebarText}>Email: {studentData.email}</Text>
              {studentData.phone ? (
                <Text style={cvStyles.sidebarText}>Tel: {studentData.phone}</Text>
              ) : null}
              {studentData.location ? (
                <Text style={cvStyles.sidebarText}>Lokacion: {studentData.location}</Text>
              ) : null}
            </View>

            <View style={cvStyles.sidebarSection}>
              <Text style={cvStyles.sidebarSectionTitle}>Lidhje</Text>
              {studentData.socialLinks?.linkedin ? (
                <Text style={cvStyles.sidebarText}>LinkedIn: {studentData.socialLinks.linkedin}</Text>
              ) : null}
              {studentData.socialLinks?.facebook ? (
                <Text style={cvStyles.sidebarText}>Facebook: {studentData.socialLinks.facebook}</Text>
              ) : null}
              {studentData.socialLinks?.github ? (
                <Text style={cvStyles.sidebarText}>GitHub: {studentData.socialLinks.github}</Text>
              ) : null}
              {studentData.socialLinks?.portfolio ? (
                <Text style={cvStyles.sidebarText}>Portfolio: {studentData.socialLinks.portfolio}</Text>
              ) : null}
              {studentData.socialLinks?.cvPath ? (
                <Text style={cvStyles.sidebarText}>CV (Upload): {studentData.socialLinks.cvPath}</Text>
              ) : null}
              {studentData.cvPath ? (
                <Text style={cvStyles.sidebarText}>CV: {studentData.cvPath}</Text>
              ) : null}
            </View>

            <View style={cvStyles.sidebarSection}>
              <Text style={cvStyles.sidebarSectionTitle}>Aftësi</Text>
              <View style={cvStyles.skillsGrid}>
                {(studentData.skillsAndBadges?.skills || []).map((skill, index) => (
                  <View key={index} style={cvStyles.skillPill}>
                    <Text style={cvStyles.skillPillText}>
                      {skill.name} • {skill.level}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={cvStyles.main}>
            <View style={cvStyles.mainHeader}>
              <Text style={cvStyles.mainTitle}>Profil</Text>
              <Text style={cvStyles.mainMeta}>Gjeneruar: {formatDate(today)}</Text>
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Rreth meje</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              <Text style={cvStyles.bodyText}>{studentData.bio}</Text>
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Edukimi</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              <View style={cvStyles.itemCard}>
                <View style={cvStyles.rowBetween}>
                  <Text style={cvStyles.itemTitle}>{studentData.university}</Text>
                  <Text style={cvStyles.itemMeta}>GPA: {studentData.academicData?.currentGPA}</Text>
                </View>
                <Text style={cvStyles.itemSub}>{studentData.faculty} • Viti {studentData.year}</Text>
                <Text style={cvStyles.itemSub}>Kredite: {studentData.academicData?.totalCredits} • Pjesëmarrja: {studentData.academicData?.attendance}%</Text>
              </View>
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Lëndët (Performanca Akademike)</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              <View style={cvStyles.table}>
                <View style={[cvStyles.tableRow, cvStyles.tableHeaderRow]}>
                  <Text style={cvStyles.tableCellName}>Lënda</Text>
                  <Text style={cvStyles.tableCellMeta}>Sem.</Text>
                  <Text style={cvStyles.tableCellMeta}>Kred.</Text>
                  <Text style={cvStyles.tableCellMetaStrong}>Nota</Text>
                </View>
                {(studentData.academicData?.subjects || []).map((subject, index) => (
                  <View
                    key={index}
                    style={[
                      cvStyles.tableRow,
                      index === (studentData.academicData?.subjects || []).length - 1
                        ? { borderBottomWidth: 0 }
                        : null,
                    ]}
                  >
                    <Text style={cvStyles.tableCellName}>{subject.name}</Text>
                    <Text style={cvStyles.tableCellMeta}>{subject.semester}</Text>
                    <Text style={cvStyles.tableCellMeta}>{subject.credits}</Text>
                    <Text style={cvStyles.tableCellMetaStrong}>{subject.grade}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Trajnime të Përfunduara</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              {(studentData.trainingData?.completed || []).map((training, index) => (
                <View key={index} style={cvStyles.itemCard}>
                  <View style={cvStyles.rowBetween}>
                    <Text style={cvStyles.itemTitle}>{training.title}</Text>
                    <Text style={cvStyles.itemMeta}>{training.grade ? `Nota: ${training.grade}%` : ""}</Text>
                  </View>
                  <Text style={cvStyles.itemSub}>
                    {training.category ? `Kategoria: ${training.category}` : ""}
                    {training.category && training.level ? " • " : ""}
                    {training.level ? `Niveli: ${training.level}` : ""}
                  </Text>
                  <Text style={cvStyles.itemSub}>Instruktor: {training.instructor}</Text>
                  <Text style={cvStyles.itemSub}>
                    Përfunduar: {formatMaybeDate(training.completionDate)}
                    {training.totalHours ?? training.hours ?? training.duration ? " • " : ""}
                    {training.totalHours ?? training.hours ?? training.duration
                      ? `Kohëzgjatja: ${training.totalHours ?? training.hours ?? training.duration} orë`
                      : ""}
                  </Text>
                  {training.attendance ? (
                    <Text style={cvStyles.itemSub}>Pjesëmarrja: {training.attendance}%</Text>
                  ) : null}
                  {training.certificateUrl ? (
                    <Text style={cvStyles.itemSub}>Certifikata: {training.certificateUrl}</Text>
                  ) : null}
                  {training.feedback ? (
                    <Text style={cvStyles.itemSub}>Feedback: “{training.feedback}”</Text>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Trajnime në Vazhdim</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              {(studentData.trainingData?.ongoing || []).map((training, index) => (
                <View key={index} style={cvStyles.itemCard}>
                  <Text style={cvStyles.itemTitle}>{training.title}</Text>
                  <Text style={cvStyles.itemSub}>Progresi: {training.progress}% • Pjesëmarrja: {training.attendance}%</Text>
                  <Text style={cvStyles.itemSub}>Instruktor: {training.instructor}</Text>
                  <Text style={cvStyles.itemSub}>
                    Orë të mbetura: {training.remainingHours} nga {training.totalHours} • Përfundon: {formatMaybeDate(training.endDate)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Trajnime të Ardhshme</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              {(studentData.trainingData?.upcoming || []).map((training, index) => (
                <View key={index} style={cvStyles.itemCard}>
                  <Text style={cvStyles.itemTitle}>{training.title}</Text>
                  <Text style={cvStyles.itemSub}>
                    {training.category ? `Kategoria: ${training.category}` : ""}
                    {training.category && training.level ? " • " : ""}
                    {training.level ? `Niveli: ${training.level}` : ""}
                  </Text>
                  <Text style={cvStyles.itemSub}>Instruktor: {training.instructor}</Text>
                  <Text style={cvStyles.itemSub}>Fillon: {formatMaybeDate(training.startDate)} • Kohëzgjatja: {training.totalHours} orë</Text>
                  {training.maxParticipants ? (
                    <Text style={cvStyles.itemSub}>Maksimumi i pjesëmarrësve: {training.maxParticipants}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Arritje</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              {(studentData.skillsAndBadges?.badges || []).map((badge, index) => (
                <View key={index} style={cvStyles.bulletRow}>
                  <View style={cvStyles.bulletDot} />
                  <Text style={cvStyles.bodyText}>
                    {badge.name}{badge.date ? ` (${badge.date})` : ""}
                  </Text>
                </View>
              ))}
            </View>

            <View style={cvStyles.section}>
              <View style={cvStyles.sectionHeaderRow}>
                <Text style={cvStyles.sectionTitle}>Aktivitet</Text>
                <View style={cvStyles.sectionRule} />
              </View>
              <Text style={cvStyles.bodyText}>Nuk ka të dhëna specifike për aktivitetin.</Text>
            </View>

            <View style={cvStyles.footer} fixed>
              <Text style={cvStyles.footerText}>IAP-M • Student Profile CV Export</Text>
              <Text style={cvStyles.footerText}>
                {formatDate(today)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplate;
