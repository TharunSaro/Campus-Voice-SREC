# Campus Voice - SREC: Project Objectives & Requirements

## 📌 Executive Summary

**Campus Voice** is a full-stack AI-powered grievance redressal platform designed to transform how SREC handles student complaints and departmental responses. It replaces fragmented communication channels (emails, word-of-mouth, WhatsApp) with a centralized, transparent, and intelligent system that promotes a digital-first reporting culture.

---

## 🎯 Primary Objectives

### **1. Promote Digital Reporting Culture**
- Replace inefficient communication channels (emails, verbal complaints, word-of-mouth)
- Make reporting accessible, convenient, and mobile-first (responsive web app)
- Encourage students to report issues instead of suffering in silence
- Build trust through transparency and accountability
- Target: 80% of students actively using the platform within 6 months

### **2. Enable Anonymous & Safe Reporting**
- Allow students to report issues anonymously to peers (like Instagram posts without author ID)
- Maintain security by revealing identity to admins only
- Protect student identity from judgment or repercussions
- Enable fearless reporting without social consequences
- Result: Increased reporting of sensitive issues (harassment, discrimination, etc.)

### **3. Implement Intelligent Complaint Routing & Prioritization**
- Auto-categorize complaints using AI/NLP (Natural Language Processing)
- Route complaints to appropriate departments (HOD, Warden, Infrastructure, etc.)
- Enable dynamic priority escalation based on community support (upvotes)
- Prevent conflicts of interest (complaints against HOD not visible to HOD)
- Ensure faster resolution through smart assignment

### **4. Create Transparent Tracking & Accountability**
- Real-time complaint status tracking for students
- Department-wise dashboards for admins to view assigned complaints
- Timeline-based updates from complaint creation to resolution
- Analytics and insights on resolution rates, average resolution time, and bottlenecks
- Hold departments accountable through visible metrics

### **5. Build Community-Driven Escalation System**
- Enable students to upvote/support similar complaints
- Automatically increase priority when threshold upvotes reached
- Escalate to higher authorities if lower authorities don't act within SLA
- Feature unlock: After complaint age > X days, escalate to supervisor's boss
- Empower students through collective voice

### **6. Ensure Multi-Role Administration**
- Support 4 admin tiers: Student, HOD/Dept Head, Infrastructure AO, Warden, Deputy Warden, Principal
- Role-based dashboards with department-specific views
- Escalation chain: Dept Head → Principal for academic issues
- Escalation chain: Warden → Deputy Warden → Principal for hostel issues
- Role-specific actions (acknowledge, update, resolve, escalate)

### **7. Create Data-Driven Insights**
- Track complaint trends and patterns (food quality, infrastructure, academics, etc.)
- Identify recurring issues across departments
- Measure department performance (resolution time, completion rate)
- Generate actionable reports for college management
- Support data-driven policy decisions

### **8. Prepare Foundation for AI Integration**
- Design architecture to seamlessly integrate AI/ML components
- Implement NLP for auto-categorization and priority scoring
- Enable chatbot assistance for complaint submission
- Support future sentiment analysis and predictive insights
- Extensible design for advanced AI features

---

## 📋 Scope Definition

### **In Scope (Phase 1)**

#### **Frontend**
- ✅ Responsive web app (mobile-first)
- ✅ Student login (college email: @srec.ac.in)
- ✅ Admin login (4 roles: HOD, Warden, AO Infrastructure, Principal)
- ✅ Student complaint creation with image/text support
- ✅ Anonymous feed for students (no author names visible)
- ✅ Upvoting system for complaints
- ✅ Status tracking dashboard
- ✅ Notification system
- ✅ Profile & settings management

#### **Backend & Database**
- ✅ RESTful API (Node.js/Flask)
- ✅ PostgreSQL database schema
- ✅ Authentication (JWT tokens, role-based access)
- ✅ File upload (image storage - AWS S3 or Firebase)
- ✅ Notification service (email, in-app)

#### **AI/ML Components**
- ✅ NLP-based complaint categorization
- ✅ Priority scoring based on upvotes and keywords
- ✅ Smart routing to appropriate departments
- ✅ Escalation logic based on time & engagement

#### **Admin Features**
- ✅ Department-specific dashboards
- ✅ Complaint assignment & management
- ✅ Status updates & timeline
- ✅ Conflict of interest handling (hide complaints against own role)
- ✅ Analytics & reporting

### **Out of Scope (Future Phases)**
- ❌ Mobile app (native iOS/Android) - web app only
- ❌ Video uploads - image & text only for Phase 1
- ❌ Anonymous video calls with admins - future feature
- ❌ Integration with existing college ERP
- ❌ SMS/WhatsApp notifications - email & in-app only
- ❌ Offline-first functionality (requires internet for Phase 1)

---

## 👥 User Roles & Permissions

### **1. Student**
**Capabilities:**
- Login with college email (@srec.ac.in)
- Create complaint with title, description, category, image
- View all complaints (anonymously) in feed
- View own complaints with edit/delete
- Upvote complaints they support
- Track complaint status in real-time
- Receive notifications on complaint updates
- View department analytics (optional)

**Visibility:**
- Cannot see author names (anonymous posts)
- Cannot see other students' profiles
- Cannot access admin dashboard
- Can view overall platform stats

---

### **2. HOD (Department Head) / Faculty Admin**
**Scope:** Manages complaints related to their department (Academics, Curriculum, etc.)

**Capabilities:**
- View complaints assigned to their department
- Assign complaints to faculty members
- Update complaint status (Open → In Progress → Resolved)
- Add timeline updates & responses
- Escalate to Principal if needed
- View department analytics
- Cannot see complaints against themselves

**Dashboard:**
- Assigned complaints count
- Status distribution (Open, In Progress, Resolved)
- Average resolution time
- Pending actions & SLA tracking

---

### **3. Warden (Hostel Admin)**
**Scope:** Manages hostel-related complaints (mess food, facilities, curfew, etc.)

**Capabilities:**
- View complaints assigned to hostel
- Assign to deputy warden if needed
- Update complaint status & timeline
- Escalate to deputy warden / Principal
- View hostel analytics
- Cannot see complaints against themselves

**Escalation Chain:** Warden → Deputy Warden → Principal

---

### **4. Deputy Warden (Assistant Warden)**
**Scope:** Assists warden; handles escalated complaints

**Capabilities:**
- View assigned complaints
- View escalated complaints from warden
- Acknowledge & respond to escalations
- Escalate further to Principal if needed
- View analytics

---

### **5. Infrastructure AO (Administrative Officer)**
**Scope:** Manages infrastructure complaints (water, electricity, repairs, classrooms, etc.)

**Capabilities:**
- View assigned infrastructure complaints
- Assign work orders to maintenance team
- Update status & timeline
- Escalate to Principal
- View infrastructure analytics
- Cannot see complaints against themselves

---

### **6. Principal (Overall Admin)**
**Scope:** Access all complaints and analytics

**Capabilities:**
- View all complaints across campus (no restrictions)
- View all escalated complaints
- Can see complaints against other admins
- Manage all department dashboards
- View college-wide analytics
- Set SLA & escalation policies
- Generate comprehensive reports
- Override any admin decision

---

## 🔄 Complaint Lifecycle & Escalation Logic

### **Stage 1: Complaint Creation**
```
Student files complaint
  ↓
Title: "Food quality is poor at mess"
Description: "Rice is always undercooked and unhygienic"
Category: Hostel - Mess
Image: [Photo of meal]
  ↓
AI Categorization: "Hostel/Mess"
Priority Score: 3 (Low) - based on keywords
  ↓
Routed to: Warden
Status: Open
```

### **Stage 2: Initial Response (Warden)**
```
Warden receives complaint in dashboard
  ↓
Warden acknowledges within 24 hours
  ↓
Status: In Progress
Assigned to: Hostel Manager / Mess Contractor
Timeline: "We are investigating the issue"
```

### **Stage 3A: Community Escalation (Upvotes)**
```
Day 1: 1 complaint about mess food
  ↓
Day 2: 3 more students upvote the same complaint
  ↓
Day 3: 10 total upvotes (threshold reached)
  ↓
Automatic Priority Increase: 3 (Low) → 5 (High)
  ↓
Automatic Escalation: Warden + Deputy Warden assigned
Notification: "Your complaint gained support from 10 students!"
```

### **Stage 3B: Time-Based Escalation (SLA)**
```
Complaint created on: Day 1
No action taken for 3 days → Status still "Open"
  ↓
Automatic Escalation Trigger: Day 4
  ↓
If Warden hasn't acknowledged:
  → Escalate to Deputy Warden
  → Notify Principal of pending complaint
  → Increase priority
  ↓
If no update for 7 days total:
  → Escalate to Principal
  → Create incident report
  → Public notification: "This issue requires higher authority attention"
```

### **Stage 4: Admin Escalation (Conflict of Interest)**
```
Complaint Against: "Warden is unfair in hostel policy"
  ↓
AI detects: Complaint is about Warden
  ↓
Warden's View: BLOCKED - "Complaint against you"
Notification to Warden: "There is a complaint about you. Check with your supervisor."
  ↓
Automatically Routed to: Deputy Warden / Principal
  ↓
Warden has NO access to this complaint
Deputy Warden handles the complaint
```

### **Stage 5: Resolution & Feedback**
```
Admin marks complaint as: Resolved
  ↓
Timeline: "Food quality improved. New vendor brought in."
  ↓
Student receives notification
  ↓
Student can:
  - Rate the resolution (satisfied/unsatisfied)
  - Add feedback comment
  - Close the complaint
```

---

## 🎯 Key Features Specification

### **Feature 1: Anonymous Post Feed**
```
Student A creates complaint → Appears in feed as "Anonymous Student"
Student B views → Sees complaint without knowing author
Admin views → Sees "By: Student A (ID: 12345)" in admin dashboard

Benefit: Focuses discussion on issue, not judgment of person
Enables students to discuss sensitive issues freely
```

### **Feature 2: Smart Complaint Routing**
```
Input: "Classroom air conditioner not working"
  ↓
AI Categorizes: Infrastructure → HVAC
  ↓
Routed to: Infrastructure AO
  ↓
Assigned to: AC maintenance team
  ↓
Priority: Medium (affects learning)
```

### **Feature 3: Dynamic Priority System**
```
Initial Priority: 3/10 (Low)

Priority Increases Based On:
+ 1 point per 10 upvotes
+ 2 points if complaint age > 3 days (no action)
+ 3 points if complaint age > 7 days (no action)
+ 1 point per similar complaint in category

Final Priority: 3 + 2 + 0 + 1 = 6/10 (Medium-High)
```

### **Feature 4: Escalation Unlock**
```
Day 1-3: Can report to Warden only
Day 4-7: Unlock escalation to Deputy Warden
Day 8+: Unlock escalation to Principal

Benefit: Gives initial authority time to act
Prevents bypass of chain of command initially
Ensures higher authorities aware of unresolved issues
```

### **Feature 5: Conflict of Interest Protection**
```
Complaint against: HOD of CSE Department
  ↓
HOD's View: RESTRICTED
HOD Message: "This complaint involves you. It has been escalated."
  ↓
Visible to: Principal only
  ↓
Resolution: Principal or external HR handles
```

### **Feature 6: Department Dashboard**
```
Warden Dashboard:
├─ Assigned to me: 15 complaints
├─ Status breakdown:
│  ├─ Open: 5
│  ├─ In Progress: 7
│  └─ Resolved: 3
├─ Average Resolution Time: 4.2 days
├─ SLA Status: ⚠️ 2 complaints overdue
├─ Priority Distribution: 📊 Chart
└─ Recent Escalations: 1 escalated to Deputy
```

### **Feature 7: Student Engagement Metrics**
```
Student Dashboard:
├─ My Complaints: 3
│  ├─ Open: 1
│  ├─ In Progress: 1
│  └─ Resolved: 1
├─ Upvotes I Gave: 12
├─ Impact Score: 24 (my complaints helped 24 students)
└─ Campus Voice Score: Gold 🏆 (Top Reporter)
```

---

## 📊 Success Metrics & KPIs

### **User Adoption**
- ✅ 80% student registration within 3 months
- ✅ 50% monthly active users (MAU) within 6 months
- ✅ 1000+ complaints filed in first semester

### **Complaint Resolution**
- ✅ Average resolution time: < 7 days
- ✅ Resolution rate: 90%+ within 30 days
- ✅ SLA compliance: 95%+ for first response
- ✅ Student satisfaction: > 4/5 rating

### **Platform Engagement**
- ✅ Average upvotes per complaint: > 5
- ✅ Repeat complaint ratio: < 10% (issue resolution working)
- ✅ Student feedback completion: > 70%
- ✅ Admin response time: < 24 hours

### **Impact Metrics**
- ✅ Reduction in email complaints: 80%
- ✅ Increase in reported issues: 300% vs previous
- ✅ Campus culture shift: Digital-first reporting
- ✅ Department accountability: Visible metrics

---

## 📱 Technology Stack

### **Frontend**
- **React 18** (functional components, hooks)
- **React Router DOM** (SPA routing)
- **Tailwind CSS** (responsive design)
- **Lucide React** (icons)
- **Vite** (build tool)

### **Backend**
- **Node.js + Express** OR **Flask + Python** (REST API)
- **PostgreSQL** (relational database)
- **JWT** (authentication & authorization)
- **Cloudinary/AWS S3** (image storage)
- **Redis** (caching, real-time notifications)

### **AI/ML**
- **spaCy / NLTK** (NLP for categorization)
- **TensorFlow / scikit-learn** (priority scoring)
- **Gensim / Word2Vec** (complaint similarity)
- **OpenAI API** (optional: chatbot assistance)

### **DevOps & Deployment**
- **Docker** (containerization)
- **GitHub** (version control & CI/CD)
- **GitHub Actions** (automated testing & deployment)
- **Heroku / AWS / DigitalOcean** (hosting)
- **Sentry** (error tracking)
- **DataDog / New Relic** (monitoring)

---

## 📅 Project Phases & Timeline

### **Phase 1: MVP (3-4 weeks)**
- Basic student & admin login
- Complaint creation & viewing
- Anonymous feed
- Manual routing
- Status tracking
- **Deliverable:** Working full-stack app

### **Phase 2: AI & Automation (3-4 weeks)**
- NLP categorization
- Auto-routing to departments
- Priority scoring
- Escalation logic
- Upvote system
- **Deliverable:** Intelligent complaint management

### **Phase 3: Analytics & Insights (2-3 weeks)**
- Department dashboards
- Analytics reports
- Performance metrics
- Data visualization
- **Deliverable:** Data-driven insights

### **Phase 4: Optimization & Scaling (2 weeks)**
- Performance tuning
- Load testing
- Security hardening
- User feedback integration
- **Deliverable:** Production-ready platform

---

## 🔒 Security & Privacy

### **Student Privacy**
- ✅ Complaints anonymous to peers (no author ID in feed)
- ✅ Admin access restricted by role
- ✅ Complaint content encrypted at rest
- ✅ Secure image upload (virus scan)
- ✅ GDPR compliance (data retention policy)

### **Admin Security**
- ✅ Role-based access control (RBAC)
- ✅ Audit trail (who accessed what, when)
- ✅ Conflict of interest prevention (can't view own complaints)
- ✅ Session management (auto-logout)
- ✅ Strong password policy (college email verification)

### **Platform Security**
- ✅ HTTPS only
- ✅ Rate limiting (prevent spam)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 🎓 Academic & Institutional Impact

### **Aligns With:**
- ✅ NAAC accreditation criteria (student feedback mechanisms)
- ✅ Quality Improvement Framework (IQAC)
- ✅ Student welfare & grievance redressal
- ✅ Transparent governance

### **Expected Outcomes:**
- ✅ Better campus environment (issues resolved faster)
- ✅ Improved student satisfaction (voice heard)
- ✅ Better institutional decision-making (data-driven)
- ✅ Enhanced college reputation (modern, tech-forward)

---

## 📝 Success Criteria (Definition of Done)

✅ Platform is live and accessible to all students & faculty  
✅ 500+ complaints processed in first month  
✅ Average resolution time < 7 days  
✅ Student satisfaction rating > 4/5  
✅ Admin adoption > 90% for assigned roles  
✅ AI categorization accuracy > 85%  
✅ Zero unresolved SLA breaches  
✅ Platform uptime > 99.5%  
✅ User feedback integrated & roadmap updated  
✅ Documentation & training completed  

---

## 📞 Contact & Support

**Development Team:**
- Tharun S (Frontend & Architecture)
- Sudharsh M (Backend & AI)
- Suriya Prakash M (UI/UX & Integration)

**Faculty Advisor:**
- [To be filled]

**Support & Feedback:**
- In-app feedback form
- Email: campusvoice@srec.ac.in
- Issue tracker: GitHub Issues

---

## ✅ Sign-Off

- [ ] Project Lead Approval
- [ ] Faculty Advisor Approval
- [ ] Department Heads Agreement
- [ ] Principal Authorization

**Version:** 1.0  
**Date:** December 16, 2025  
**Last Updated:** December 16, 2025
