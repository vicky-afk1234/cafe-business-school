import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Admin User ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('GCBSadmin123!', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@gcbs.edu.sg' },
    update: {},
    create: {
      email: 'admin@gcbs.edu.sg',
      passwordHash,
      name: 'GCBS Administrator',
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✓ Admin user created — admin@gcbs.edu.sg / admin123!')

  // ─── Announcement ─────────────────────────────────────────────
  await prisma.announcement.upsert({
    where: { id: 'announce-1' },
    update: {},
    create: {
      id: 'announce-1',
      message: '🎓 January 2025 intake now open — Limited seats available!',
      ctaLabel: 'Apply Now',
      ctaUrl: '/admissions/apply',
      bgColor: '#c8860a',
      textColor: '#ffffff',
      isActive: true,
    },
  })
  console.log('✓ Announcement created')

  // ─── Hero Sections ────────────────────────────────────────────
  const heroes = [
    {
      page: 'home',
      badge: '☕ Professional Training Institute',
      headline: 'Professional',
      headlineAccent: 'DIPLOMA IN CAFÉ MANAGEMENT',
      subheadline: '& Barista Skills',
      bodyText: 'Learn the art and science of coffee from industry professionals. Our hands-on training prepares students for careers in cafés, restaurants, hotels, and coffee businesses.',
      ctaPrimary: 'Apply Now ☕',
      ctaPrimaryUrl: '/admissions/apply',
      ctaSecondary: 'View Course',
      ctaSecondaryUrl: '/courses',
      desktopImageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=768&q=85',
      overlayOpacity: 0.65,
      overlayColor: '#1a0d08',
      isActive: true,
    },
    {
      page: 'about',
      headline: 'About',
      headlineAccent: 'Global Café Business School',
      bodyText: 'Founded with a mission to elevate café culture through world-class education and industry mentorship.',
      desktopImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=768&q=85',
      overlayOpacity: 0.6,
      overlayColor: '#1a0d08',
      isActive: true,
    },
    {
      page: 'courses',
      headline: 'Our',
      headlineAccent: 'Programmes',
      bodyText: 'Industry-aligned diplomas and certificates designed for aspiring café professionals.',
      desktopImageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=768&q=85',
      overlayOpacity: 0.65,
      overlayColor: '#1a0d08',
      isActive: true,
    },
  ]

  for (const hero of heroes) {
    await prisma.heroSection.upsert({
      where: { page: hero.page },
      update: hero,
      create: hero,
    })
  }
  console.log('✓ Hero sections created')

  // ─── Banners ───────────────────────────────────────────────────
  await prisma.banner.upsert({
    where: { id: 'banner-1' },
    update: {},
    create: {
      id: 'banner-1',
      title: 'January 2025 Intake — Applications Open',
      subtitle: 'Secure your spot before December 31st',
      bodyText: 'Join over 500 graduates who have launched successful café careers with GCBS. Enrol now for our January cohort and get early bird pricing.',
      ctaLabel: 'Apply Now',
      ctaUrl: '/admissions/apply',
      desktopImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1440&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=768&q=80',
      placement: 'HOME_MID',
      bgColor: '#1a0d08',
      textColor: '#ffffff',
      isActive: true,
      sortOrder: 1,
    },
  })
  console.log('✓ Banners created')

  // ─── Course Categories ─────────────────────────────────────────
  const categories = [
    { name: 'Café Management', slug: 'cafe-management', description: 'Business and operations management for café owners' },
    { name: 'Barista Skills',  slug: 'barista-skills',  description: 'Coffee extraction, latte art, and barista fundamentals' },
    { name: 'Operations',      slug: 'operations',      description: 'Day-to-day café operations and team management' },
    { name: 'Roasting',        slug: 'roasting',        description: 'Green bean sourcing and coffee roasting science' },
    { name: 'Hospitality',     slug: 'hospitality',     description: 'Guest experience and hospitality management' },
    { name: 'Business',        slug: 'business',        description: 'Entrepreneurship and café business strategy' },
  ]

  const catMap: Record<string, string> = {}
  for (const cat of categories) {
    const c = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, sortOrder: categories.indexOf(cat) },
    })
    catMap[cat.slug] = c.id
  }
  console.log('✓ Course categories created')

  // ─── Courses ───────────────────────────────────────────────────
  const courses = [
    {
      categoryId: catMap['cafe-management'],
      title: 'Diploma in Café Management',
      slug: 'diploma-cafe-management',
      tagline: 'Master every aspect of running a profitable café business',
      description: `The Diploma in Café Management is our flagship programme designed for aspiring café owners and managers. Over 12 intensive months, students gain comprehensive skills across coffee science, business management, financial planning, staff management, and customer experience design.\n\nThis programme combines classroom learning with real-world practice sessions in our state-of-the-art coffee lab, producing graduates who are genuinely café-ready from their first day of work.`,
      duration: '12 months',
      durationWeeks: 52,
      level: 'DIPLOMA',
      localFee: 8500,
      intlFee: 12000,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
      bannerDesktop: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1440&q=80',
      bannerMobile: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=768&q=80',
      curriculum: [
        { module: 'Module 1: Coffee Fundamentals', topics: ['Coffee origins & varietals', 'Roast profiles', 'Sensory evaluation', 'Water chemistry'] },
        { module: 'Module 2: Espresso Mastery', topics: ['Espresso extraction', 'Milk steaming & texturing', 'Latte art basics', 'Machine maintenance'] },
        { module: 'Module 3: Café Operations', topics: ['Inventory management', 'Staff scheduling', 'Health & safety', 'SOP development'] },
        { module: 'Module 4: Business Management', topics: ['P&L management', 'Menu engineering', 'Cost control', 'Marketing basics'] },
        { module: 'Module 5: Industry Practicum', topics: ['6-week industry attachment', 'Live café project', 'Business plan presentation'] },
      ],
      outcomes: [
        'Operate and manage a profitable café business end-to-end',
        'Master all aspects of espresso extraction and milk texturing',
        'Develop and cost café menus for maximum profitability',
        'Lead and motivate a team of café staff',
        'Implement quality control and consistency systems',
        'Apply marketing and social media strategies for cafés',
        'Understand café financial management and P&L',
        'Design exceptional customer experiences',
      ],
      careerPaths: ['Café Owner', 'Café Manager', 'F&B Operations Manager', 'Coffee Consultant', 'Barista Trainer', 'Hotel F&B Manager'],
      highlights: ['SCA certified modules', 'Real café practicum', 'Industry mentorship', 'Business plan project'],
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
      metaTitle: 'Diploma in Café Management | Global Café Business School',
      metaDescription: 'Professional 12-month Diploma in Café Management. Learn coffee science, business management, and hospitality. Industry-recognised certification in Singapore.',
    },
    {
      categoryId: catMap['barista-skills'],
      title: 'Barista Certification Programme',
      slug: 'barista-certification',
      tagline: 'Professional barista skills recognised worldwide',
      description: `Our Barista Certification Programme is the perfect starting point for coffee enthusiasts who want to turn their passion into a profession. Over 6 intensive months, students learn the complete spectrum of barista skills from green bean selection to advanced latte art.\n\nAligned with SCA (Specialty Coffee Association) standards, graduates earn an internationally recognised certification that opens doors across Asia, Europe, and beyond.`,
      duration: '6 months',
      durationWeeks: 26,
      level: 'CERTIFICATE',
      localFee: 4500,
      intlFee: 6500,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400&q=80',
      curriculum: [
        { module: 'Module 1: Coffee Origins', topics: ['World coffee regions', 'Processing methods', 'Green bean grading'] },
        { module: 'Module 2: Espresso Science', topics: ['Extraction theory', 'Grind adjustment', 'Espresso diagnosis', 'Blending'] },
        { module: 'Module 3: Milk & Alternative Milks', topics: ['Milk chemistry', 'Steaming techniques', 'Oat, almond, soy texturing'] },
        { module: 'Module 4: Latte Art', topics: ['Basic pours', 'Rosette & tulip', 'Advanced designs', 'Competition prep'] },
        { module: 'Module 5: Café Service', topics: ['Bar workflow', 'Speed & consistency', 'Customer interaction', 'Barista competitions'] },
      ],
      outcomes: [
        'Dial in espresso to professional competition standards',
        'Steam and texture milk for all hot and cold drinks',
        'Create advanced latte art designs consistently',
        'Understand and apply coffee sensory evaluation',
        'Operate all common commercial espresso equipment',
      ],
      careerPaths: ['Head Barista', 'Barista Trainer', 'Coffee Educator', 'Café Supervisor', 'Competition Barista'],
      isFeatured: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      categoryId: catMap['operations'],
      title: 'Advanced Café Operations',
      slug: 'advanced-cafe-operations',
      tagline: 'Take your café from good to exceptional',
      description: 'Designed for experienced café professionals who want to level up, this 9-month programme dives deep into advanced operations, quality systems, and leadership. Students tackle real-world challenges with mentorship from successful café operators.',
      duration: '9 months',
      durationWeeks: 39,
      level: 'ADVANCED_DIPLOMA',
      localFee: 7200,
      intlFee: 10500,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80',
      outcomes: ['Advanced quality management systems', 'Multi-outlet operations management', 'Leadership and people development', 'Supply chain and procurement optimisation'],
      careerPaths: ['Operations Director', 'Regional Manager', 'Quality Control Manager', 'Group F&B Manager'],
      isFeatured: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      categoryId: catMap['roasting'],
      title: 'Coffee Roasting & Sourcing',
      slug: 'coffee-roasting-sourcing',
      tagline: 'From bean to cup — the complete journey',
      description: 'An intensive 3-month deep-dive into the world of specialty coffee sourcing and roasting. Students visit origin farms (virtually and in-person), learn green bean evaluation, and master drum and air roasting on commercial equipment.',
      duration: '3 months',
      durationWeeks: 13,
      level: 'CERTIFICATE',
      localFee: 3200,
      intlFee: 4800,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
      outcomes: ['Green bean evaluation and grading', 'Roast profile development', 'Cupping and sensory analysis', 'Roastery business fundamentals'],
      careerPaths: ['Coffee Roaster', 'Green Coffee Buyer', 'Sensory Analyst', 'Roastery Manager'],
      isFeatured: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      categoryId: catMap['business'],
      title: 'Postgraduate Diploma in Café Business',
      slug: 'postgraduate-diploma',
      tagline: 'Executive-level training for café entrepreneurs',
      description: 'Our most comprehensive programme for aspiring café entrepreneurs and senior F&B professionals. The 18-month postgraduate diploma covers the full spectrum from product development to multi-outlet expansion strategy.',
      duration: '18 months',
      durationWeeks: 78,
      level: 'POSTGRADUATE_DIPLOMA',
      localFee: 12000,
      intlFee: 17500,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
      outcomes: ['Café concept development and branding', 'Financial modelling and investor pitching', 'Franchise and multi-outlet expansion', 'Digital marketing for café brands'],
      careerPaths: ['Café Group Founder', 'F&B Director', 'Coffee Brand Manager', 'Hospitality Entrepreneur'],
      isFeatured: true,
      isActive: true,
      sortOrder: 5,
    },
    {
      categoryId: catMap['hospitality'],
      title: 'Hospitality & Café Service',
      slug: 'hospitality-cafe-service',
      tagline: 'Delivering memorable guest experiences',
      description: 'A 6-month programme focused on the human side of café operations — creating exceptional guest experiences, handling service challenges with grace, and building loyal customer communities.',
      duration: '6 months',
      durationWeeks: 26,
      level: 'DIPLOMA',
      localFee: 5800,
      intlFee: 8500,
      currency: 'SGD',
      thumbnailDesktop: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      thumbnailMobile: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80',
      outcomes: ['Hospitality service excellence standards', 'Customer relationship management', 'Handling complaints and difficult situations', 'Building and retaining loyal customers'],
      careerPaths: ['Café Supervisor', 'Guest Relations Manager', 'Hospitality Trainer', 'Customer Experience Manager'],
      isFeatured: true,
      isActive: true,
      sortOrder: 6,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course as any,
    })
  }
  console.log('✓ Courses created')

  // ─── Testimonials ─────────────────────────────────────────────
  const testimonials = [
    {
      name: 'Sarah Chen', role: 'Café Owner, Singapore',
      courseTitle: 'Diploma in Café Management', rating: 5,
      quote: 'GCBS gave me the complete package — from espresso extraction science to P&L management. I opened my own café 6 months after graduating and we\'re already turning a profit!',
      photoDesktop: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 1,
    },
    {
      name: 'Marcus Tan', role: 'Head Barista, The Coffee Bean',
      courseTitle: 'Barista Certification Programme', rating: 5,
      quote: 'The hands-on training at GCBS is unmatched. Our instructors are actual competitors and café owners. I landed my dream job before I even graduated.',
      photoDesktop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 2,
    },
    {
      name: 'Priya Nair', role: 'F&B Manager, Marriott Hotels',
      courseTitle: 'Advanced Café Operations', rating: 5,
      quote: 'The curriculum is incredibly practical. Every module had real-world projects. My employer noticed the difference immediately — I was promoted within my first year.',
      photoDesktop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 3,
    },
    {
      name: 'James Lim', role: 'Café Entrepreneur',
      courseTitle: 'Postgraduate Diploma in Café Business', rating: 5,
      quote: 'I came in knowing nothing about coffee. GCBS transformed me into a confident café owner. The business modules alone are worth the entire programme.',
      photoDesktop: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 4,
    },
    {
      name: 'Aisha Mohammed', role: 'Barista Trainer, TWG Tea',
      courseTitle: 'Barista Certification Programme', rating: 5,
      quote: 'The SCA certification I earned through GCBS opened doors I never expected. I now train baristas across Southeast Asia.',
      photoDesktop: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 5,
    },
    {
      name: 'Wei Hao', role: 'Café Chain Director',
      courseTitle: 'Diploma in Café Management', rating: 5,
      quote: 'GCBS understands what the industry needs. Every lecturer brought fresh real-world experience. The network I built at GCBS is still invaluable to my business today.',
      photoDesktop: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      isFeatured: true, isActive: true, sortOrder: 6,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {})
  }
  console.log('✓ Testimonials created')

  // ─── Team Members ─────────────────────────────────────────────
  const team = [
    {
      name: 'Chef David Lim', title: 'Academic Director', department: 'Faculty',
      bio: 'Former World Barista Championship finalist with 20 years of industry experience across Singapore and Japan.',
      qualifications: ['SCA Professional', 'Certified Q Grader', 'MBA Hospitality Management'],
      specializations: ['Espresso Science', 'Sensory Analysis', 'Business Strategy'],
      photoDesktop: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      photoMobile: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
      isActive: true, sortOrder: 1,
    },
    {
      name: 'Ms. Rachel Wong', title: 'Head of Barista Training', department: 'Faculty',
      bio: 'Regional barista champion and certified SCA trainer with expertise in latte art and competition preparation.',
      qualifications: ['SCA Barista Skills Professional', 'Latte Art Champion 2022', 'Diploma in Culinary Arts'],
      specializations: ['Latte Art', 'Milk Texturing', 'Competition Coaching'],
      photoDesktop: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      photoMobile: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
      isActive: true, sortOrder: 2,
    },
    {
      name: 'Mr. Ahmad Rashid', title: 'Business & Entrepreneurship Lecturer', department: 'Faculty',
      bio: 'Serial café entrepreneur who has founded and scaled three café brands across Singapore, Malaysia, and Indonesia.',
      qualifications: ['MBA (NUS)', 'BA Business Administration', 'Certified Business Coach'],
      specializations: ['Café Business Planning', 'Financial Management', 'Franchise Development'],
      photoDesktop: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      photoMobile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
      isActive: true, sortOrder: 3,
    },
    {
      name: 'Ms. Lisa Tan', title: 'Admissions & Student Services', department: 'Administration',
      bio: 'Dedicated to helping every student find the right programme and supporting their journey from enquiry to graduation.',
      photoDesktop: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80',
      photoMobile: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=300&q=80',
      isActive: true, sortOrder: 4,
    },
  ]

  for (const member of team) {
    await prisma.teamMember.create({ data: member as any }).catch(() => {})
  }
  console.log('✓ Team members created')

  // ─── Stats ────────────────────────────────────────────────────
  const stats = [
    { label: 'Graduates Placed', value: '500+', icon: '🎓', sortOrder: 1, isActive: true },
    { label: 'Years of Excellence', value: '15+', icon: '⭐', sortOrder: 2, isActive: true },
    { label: 'Employment Rate', value: '98%', icon: '💼', sortOrder: 3, isActive: true },
    { label: 'Industry Partners', value: '30+', icon: '🤝', sortOrder: 4, isActive: true },
  ]

  for (const stat of stats) {
    await prisma.stat.create({ data: stat }).catch(() => {})
  }
  console.log('✓ Stats created')

  // ─── Partners ─────────────────────────────────────────────────
  const partners = [
    { name: 'SkillsFuture Singapore', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=SkillsFuture', type: 'ACCREDITATION', isActive: true, sortOrder: 1 },
    { name: 'Specialty Coffee Association', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=SCA', type: 'ACCREDITATION', isActive: true, sortOrder: 2 },
    { name: 'Lavazza', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=Lavazza', type: 'INDUSTRY', isActive: true, sortOrder: 3 },
    { name: 'The Coffee Bean & Tea Leaf', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=CBTL', type: 'PLACEMENT', isActive: true, sortOrder: 4 },
    { name: 'Marriott Hotels', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=Marriott', type: 'PLACEMENT', isActive: true, sortOrder: 5 },
    { name: 'EduTrust', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=EduTrust', type: 'ACCREDITATION', isActive: true, sortOrder: 6 },
  ]

  for (const partner of partners) {
    await prisma.partner.create({ data: partner as any }).catch(() => {})
  }
  console.log('✓ Partners created')

  // ─── Gallery ──────────────────────────────────────────────────
  const gallery = [
    {
      title: 'Coffee Lab', category: 'COFFEE_LAB',
      desktopUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
      mobileUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      altText: 'Students training in the GCBS coffee lab',
      isActive: true, sortOrder: 1,
    },
    {
      title: 'Latte Art Training', category: 'TRAINING',
      desktopUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=80',
      mobileUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
      altText: 'Barista creating latte art',
      isActive: true, sortOrder: 2,
    },
    {
      title: 'Campus Facilities', category: 'CAMPUS',
      desktopUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&q=80',
      mobileUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&q=80',
      altText: 'GCBS training facility',
      isActive: true, sortOrder: 3,
    },
    {
      title: 'Coffee Roasting', category: 'COFFEE_LAB',
      desktopUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80',
      mobileUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
      altText: 'Coffee roasting class in session',
      isActive: true, sortOrder: 4,
    },
    {
      title: 'Student Barista', category: 'STUDENTS',
      desktopUrl: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=1200&q=80',
      mobileUrl: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=600&q=80',
      altText: 'Student practising barista skills',
      isActive: true, sortOrder: 5,
    },
  ]

  for (const img of gallery) {
    await prisma.galleryImage.create({ data: img as any }).catch(() => {})
  }
  console.log('✓ Gallery images created')

  // ─── Site Settings ─────────────────────────────────────────────
  const settings = [
    { key: 'contact_phone',       value: '+65 0000 0000',                    group: 'contact', label: 'Phone Number' },
    { key: 'contact_email',       value: 'enquiry@gcbs.edu.sg',              group: 'contact', label: 'Email' },
    { key: 'contact_address',     value: '123 Orchard Road, Singapore 238858', group: 'contact', label: 'Address' },
    { key: 'contact_hours',       value: 'Mon–Fri 9am–6pm, Sat 10am–2pm',   group: 'contact', label: 'Hours' },
    { key: 'school_reg_no',       value: '202000001X',                        group: 'school',  label: 'PEI Reg No' },
    { key: 'school_edutrust_no',  value: 'EDU-3-XXXX',                        group: 'school',  label: 'EduTrust No' },
    { key: 'school_intake_dates', value: 'January 2025, July 2025',           group: 'school',  label: 'Intake Dates' },
    { key: 'social_instagram',    value: 'https://instagram.com/gcbs',        group: 'social',  label: 'Instagram' },
    { key: 'social_facebook',     value: 'https://facebook.com/gcbs',         group: 'social',  label: 'Facebook' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { ...s, type: 'text' },
    })
  }
  console.log('✓ Site settings created')

  console.log('\n🎉 Seed complete!')
  console.log('\n📋 Admin credentials:')
  console.log('   Email:    admin@gcbs.edu.sg')
  console.log('   Password: admin123!')
  console.log('\n🌐 Access admin at: http://localhost:3000/admin')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
