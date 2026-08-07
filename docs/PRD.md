# farmaz_ai_trainer_prd_v2.5.md

# Product Requirements Document (PRD)

## Product Name

**Farmaz Somu | AI Trainer — Website, AI Readiness Assessment and Lead Generation System**

## Document Status

- Version: 2.5 — Production-Ready Multi-Role Specification
- Product owner: Farmaz Somu
- Primary administrator: Farmaz Somu
- Delivery model: Phase 1 to Phase 3
- Initial deployment: Vercel temporary deployment URL
- Backend and database: Supabase
- Source control and delivery governance: GitHub
- Hosting, preview and production deployment: Vercel
- Phase 1 email provider: Gmail using `farmazai1502@gmail.com`
- Sender identity: **Farmaz Somu | AI Trainer**
- Launch languages: English and Bahasa Malaysia

---

# 1. Executive Summary

This product is a bilingual trainer website, AI competency and readiness assessment platform, lead-generation funnel, consultation-booking system and lightweight lead-management system.

The product is designed for:

- Companies
- Learning & Development (L&D) departments
- Talent Development / Talent Management teams
- HR / People & Culture teams
- Department heads
- Individual professionals
- Students
- Independent learners
- Training providers
- Consultants assessing clients

The platform must do more than present training programmes. It must diagnose the visitor's current AI capability, identify pain points and preferred outcomes, create a credible picture of the future state they could achieve through the right training, and convert qualified visitors into proposal requests and consultation calls.

A primary commercial use case is for **Learning & Development (L&D), Talent Development / Talent Management, HR / People & Culture and organisational capability teams** to use the platform as a structured front-end diagnostic for identifying AI capability gaps, prioritising learner groups, generating an HRD Corp-structured TNA, recommending suitable learning interventions and creating evidence for internal training discussions and budget decisions.

The platform must not publish pricing. Commercial discussions happen only after the system has established value, captured the customer's desired outcomes and created a personalised training opportunity narrative.

Phase 1 must be operational but commercially sequenced. Phase 1A launches the revenue engine: website, progressive lead capture, separate diagnostics, deterministic instant results, opportunity framing, recommendations and discovery conversion. Phase 1B adds the operator engine: richer admin tooling, deeper report workflows, lead management, reminders and expanded analytics.

---

# 2. Problem Statement

The trainer currently lacks one integrated system to:

- Present training programmes and modules professionally
- Establish trainer credibility
- Capture customer contact and qualification data
- Assess individual, team and organisational AI competency
- Identify customer pain points and desired outcomes
- Recommend relevant programmes and modules
- Build urgency and perceived value without using manipulative or unsupported claims
- Generate qualified enquiries
- Track assessment takers, leads, reports and follow-up actions
- Book consultation calls
- Retain customer and assessment data for future promotions and sales activity

A standard brochure website would not solve this problem. The system must act as a guided diagnostic and conversion funnel.

---

# 3. Product Vision

Create a premium bilingual AI training platform that helps visitors understand where they are today, what better AI capability could look like, and which training pathway can help them move forward.

The product should become a reliable lead-generation machine that continuously:

1. Attracts visitors.
2. Captures qualified data.
3. Diagnoses AI competency or readiness.
4. Identifies pain points and outcomes.
5. Builds a personalised future-state narrative.
6. Recommends relevant training.
7. Converts the user into a proposal request or consultation.
8. Stores and tracks the entire journey.

---

# 4. Product Goals

## 4.1 Primary Goals

- Generate 1 to 5 qualified leads per week during early operation.
- Provide credible and useful AI competency assessments.
- Convert assessment takers into training enquiries.
- Capture structured KYC, commercial-intent and capability data.
- Enable the trainer to review, edit, approve and send customer reports.
- Build a growing database of industries, departments, pain points, readiness levels and preferred outcomes.

## 4.2 Phase 1 Proof Requirements

Phase 1 must prove all three of the following equally:

- The website can generate qualified leads.
- The assessments and scoring are credible.
- Visitors can discover training programmes and convert.

Phase 1 must also:

- Track and record all relevant data.
- Store leads, KYC profiles, assessment results and customer actions in Supabase.
- Calculate and display the primary diagnostic result immediately after KYC unlock.
- Notify the trainer of qualified and high-priority leads.
- Support a deeper trainer-reviewed report workflow in Phase 1B without delaying the customer's primary result.
- Send acknowledgement, result-summary, booking and report emails where applicable.

---

# 5. Non-Goals

## Phase 1 exclusions

- No customer accounts or customer portal
- No team admin accounts
- No role-based internal permissions
- No native mobile application
- No published pricing
- No virtual or hybrid training offer
- No public testimonial-submission workflow
- No peer benchmarking at launch
- No WhatsApp API alert integration
- No external CRM integration
- No automatic delivery of the **deeper trainer-reviewed final report** without trainer approval; the free Instant Diagnostic Report is generated automatically after KYC
- No built-in Word-to-PDF conversion
- No automatic report editing by an autonomous agent
- No Google Drive backup
- No saved assessment progress across sessions

---

# 6. User Types

## 6.1 Public Users

- Individual professional
- Student
- Independent learner
- Team or department representative
- Organisation representative
- Learning & Development (L&D) representative
- Talent Development / Talent Management representative
- HR / People & Culture representative
- Manager or decision-maker
- Training provider
- Consultant assessing a client

### Primary Organisational Buyer Personas

The product must explicitly support the needs of the following primary organisational buyers and internal champions:

- **Learning & Development (L&D):** needs evidence of capability gaps, learner groups, recommended learning interventions, training priorities, success measures and a defensible TNA for programme planning.
- **Talent Development / Talent Management:** needs visibility into future AI competencies, capability development priorities, role-based skill gaps, learning pathways, workforce readiness and post-training capability movement.
- **HR / People & Culture:** needs workforce capability insight, development priorities, governance/change considerations and training-planning evidence.
- **Department Heads / Functional Leaders:** need role-specific gaps, operational pain points, practical capability requirements and relevant training recommendations.
- **CEO / Executive / Business Decision-Maker:** needs a concise view of organisational capability, major risks, strategic gaps, investment utilisation and recommended next action.

The platform must not treat these personas as interchangeable. The same underlying assessment data may be presented differently according to the user's role and decision need.

## 6.2 Administrator

There is one administrator only:

**Farmaz Somu**

The administrator has access to all website content, leads, assessment data, reports, bookings, scoring configuration, recommendation rules, notes, reminders and exports.

---

# 7. Core User Journey

## 7.1 Homepage Journey

The homepage must balance:

- Trainer credibility
- Training programme discovery
- AI assessment promotion

### Locked Homepage Conversion Direction

The homepage must use the **Design 3 Hybrid** conversion model:

- **Base:** dark, sleek, premium executive design
- **Conversion energy:** borrow the stronger FREE-value emphasis and human visual cues from the modern/energetic concept
- **CTA architecture:** borrow the repeated CTA density, process clarity and supporting conversion sections from the professional/trustworthy concept

The page must feel premium enough for CEOs, HRD, L&D, Talent Development, HR / People & Culture and organisational decision-makers while remaining inviting to individual professionals and students.

The primary CTA is:

**Start My FREE Assessment**

Approved equivalent variants may include:

- **Assess My AI Capability — FREE**
- **Get My FREE AI Diagnostic**
- **See My AI Capability for FREE**
- BM equivalents using **Percuma**

Secondary CTAs:

- Explore Training Programmes
- Discuss My Results
- Request a Tailored Proposal
- Book a Consultation
- Submit an Enquiry
- Contact via WhatsApp

### CTA Density Rule

The assessment CTA must appear at multiple natural decision points rather than only in the hero. At minimum:

1. Hero section — **Start My FREE Assessment**
2. After the **What You Get Free** section — **Unlock My FREE Results**
3. After the **How It Works** section — **Take the FREE Assessment Now**
4. After the **Why Take This Assessment?** section — **See My AI Capability for FREE**
5. Final conversion strip / footer CTA — **Get My FREE AI Diagnostic**

Repeated CTAs must not feel spammy. Each repetition must follow a relevant value or trust section and use consistent destination behaviour.

### Premium-Free Positioning

The assessment must repeatedly communicate that it is free without making the brand look cheap or discount-led. Use a controlled combination of:

- **100% FREE** / **100% Percuma** badge
- **No payment. No obligation.**
- **5–7 minutes**
- **Instant results**
- A single informal human annotation near the primary hero CTA such as **“It’s completely FREE!”** with an arrow pointing toward the CTA
- A **Your Free Gift Includes** section explaining the actual value received

Do not flood the interface with discount stickers, sale-style graphics or excessive FREE badges. FREE communicates access to a high-value diagnostic, not low value.

### Homepage Content Order

The preferred Phase 1 homepage structure is:

1. Hero — premium dark executive design, value proposition, FREE CTA and result-preview card
2. **What You Get Free** — value tiles for score, dimension analysis, strengths/gaps, LLM review, TNA Snapshot, Opportunity Horizon and recommendations
3. **How It Works** — Answer → Unlock → Get Results → Take Action
4. **Why Take This Assessment?** — decision clarity, training-fit confidence, time/resource efficiency and next-step planning
5. Result preview — representative diagnostic/result layout without fabricating customer data
6. Trainer credibility / evidence / testimonials
7. Privacy and confidentiality reassurance
8. Training programme discovery
9. Final FREE assessment CTA
10. Footer

A homepage video is not required in Phase 1. The design should allow one to be inserted later without restructuring the page.

## 7.2 Assessment Entry Flow — Progressive Conversion Model

The assessment journey must minimise perceived sales friction while still ensuring usable KYC data is captured before results are released.

### Stage 1 — Lightweight Entry

After the assessment overview, capture only:

- Full name
- Contact number
- Consent to continue and to process the submitted data

Primary CTA:

**Start My Free Assessment**

Supporting conversion copy:

- **Free AI Readiness Assessment** / **Penilaian Kesediaan AI Percuma**
- **5–7 minutes**
- **No payment required**
- **No obligation to purchase training**
- **Receive your AI Readiness / Capability result, key gaps, Instant TNA Snapshot and recommended next steps at no cost**

Do not ask for the full corporate profile at this point.

### Stage 2 — Assessment

1. Load the appropriate assessment entry path.
2. Keep the assessment within 5–7 minutes.
3. Capture capability responses, pain points, constraints and desired outcomes naturally as part of the diagnostic.
4. Use a progress bar, question count and section milestones.
5. Do not reveal the final score during the assessment.

### Stage 3 — KYC Unlock Gate

When the assessment is complete, do not reveal the result until the user completes the KYC unlock step.

Position this as:

**Your free assessment is complete. Tell us a little more about your context to unlock your free personalised results, Instant TNA Snapshot and recommendations.**

The KYC unlock must capture the data defined in Section 8.

### Stage 4 — Instant Results

Immediately after valid KYC submission:

1. The application calculates the score using deterministic, protected scoring logic.
2. The application identifies the relevant capability/readiness stage.
3. The application maps strengths, gaps, pain points, desired outcomes and training pathways.
4. The user is shown the result immediately in the website/app.
5. The result is stored in Supabase together with the KYC profile and assessment responses.
6. The user may also receive the result summary by email where an email address has been captured.

The customer must not wait for trainer review before seeing the primary diagnostic result.

### Stage 5 — Commercial Progression

After the result is shown:

1. Explain the current-state diagnosis.
2. Present the Opportunity Horizon / future-state picture.
3. Map identified gaps to relevant training interventions and intended capabilities.
4. Offer the primary CTA to **Discuss My Results / Explore My Training Recommendation**.
5. Offer **Request a Tailored Proposal** as a secondary high-intent CTA.

A deeper trainer-reviewed report, proposal or custom recommendation may be created later without delaying the initial customer result.


---

# 8. Progressive KYC and Lead Capture

The platform must use progressive profiling rather than presenting a long lead form before the user receives any value.

## 8.1 Stage 1 — Required Before Assessment

Capture only:

- Full name
- Contact number
- Consent to data processing

This is intentionally lightweight to maximise assessment starts.

## 8.2 Stage 2 — Required Before Results Are Unlocked

After assessment completion, the user must complete the KYC unlock gate.

Mandatory fields:

- User context: Individual / representing a company or organisation
- Email address
- Industry
- Country or operating region
- Position or job title
- Training intent
- Decision authority

Conditional fields:

- Organisation or company name — mandatory when representing a company, team, organisation or client
- Department or function — mandatory when the assessment or intended training involves a team, organisation or client
- Organisation size — mandatory only for organisation assessments
- Client organisation details — mandatory for consultant/training-provider client routes

For students, independent users or unemployed users, the system must support appropriate classifications without forcing a fictional company name.

## 8.3 Diagnostic / Commercial Data Captured During Assessment

The assessment itself should capture, where relevant:

- Main operational pain points
- Current AI challenges
- Desired training outcomes
- Priority use cases
- Urgency or target timeframe
- Current AI adoption or usage patterns

These should feel like legitimate diagnostic questions, not a disguised sales form.

## 8.4 Result Unlock Rule

The result may only be displayed once:

1. The assessment is completed; and
2. The required KYC unlock fields are validly submitted.

KYC is therefore the value exchange: the visitor provides usable profile data in return for immediate personalised results.

## 8.5 Lead Metadata

Automatically record:

- Initial submission timestamp
- KYC completion timestamp
- Selected language
- Source page
- Campaign or referral parameters, where available
- Assessment type
- Training-intent route
- Decision authority
- Department or function
- Lead priority
- Lead status
- Result-view timestamp
- CTA actions
- Booking / proposal activity


---

# 9. Routing Checkpoints

## 9.1 Checkpoint 1 — Assessment Subject

**Who are you completing this assessment for?**

- Myself
- My team or department
- My organisation
- My client

## 9.2 Checkpoint 2 — Training Intent

**Who are you looking for training for?**

- Myself
- My team or department
- My organisation
- My client
- I am only assessing for now
- I am not sure yet

## 9.3 Client Sub-Route

When **My client** is selected, ask:

**Who is being assessed?**

- An individual client
- A client's team or department
- A client's organisation

The assessor's data and the assessed client's data must remain separate.

## 9.4 Decision Authority Checkpoint

**Are you involved in deciding or approving AI training?**

- I am the final decision-maker
- I influence or recommend the decision
- I am researching for the decision-maker
- This is for my own development
- I am not sure

Decision authority affects lead priority, not assessment scoring.

## 9.5 Department or Function Checkpoint

Required when the assessment or training involves a team, organisation or client.

Options:

- Organisation-wide or multiple departments
- Finance and Accounting
- Human Resources / People & Culture
- Learning and Development (L&D)
- Talent Development / Talent Management
- Shared Services or Operations
- Sales and Business Development
- Marketing and Communications
- Customer Service
- Information Technology
- Procurement and Supply Chain
- Project Management
- Leadership or Management
- Other — specify

Phase 1 uses core route assessments with department-specific sections and recommendations.

For respondents from **L&D, Talent Development / Talent Management or HR / People & Culture**, the platform must prioritise TNA-relevant interpretation, including target learner groups, future competencies, current capability gaps, learning priorities, intervention recommendations and evidence of successful capability transfer. This is a presentation and recommendation layer; it must not distort the underlying deterministic assessment score.

Fully separate department assessments may be introduced later only for departments with demonstrated demand.

## 9.6 Organisation Size

Mandatory only for organisation assessments.

Options:

- 1–10 employees
- 11–50
- 51–200
- 201–500
- 501–1,000
- 1,001–5,000
- More than 5,000
- Not sure

---

# 10. Assessment Architecture

## 10.1 Separate Diagnostic Products and Terminology

Phase 1 must distinguish between three different diagnostic concepts rather than using one generic "AI assessment" label:

- **Individual AI Capability Profile** — measures personal AI competency and practical application capability.
- **Team AI Capability Assessment** — measures shared capability, adoption, consistency and workflow use within a team or department.
- **Organisation AI Readiness Snapshot** — measures perceived organisational readiness, maturity, governance, adoption, skills, processes and change readiness from the respondent's perspective.
- **Client Assessment Route** — allows consultants or training providers to assess an individual client, client team or client organisation using the corresponding framework.

The Phase 1 organisation route must be explicitly described as a **Snapshot**, not a definitive enterprise-wide audit, because one respondent cannot credibly represent every function in a complex organisation. The result page must state that it reflects the respondent's current view and is intended as an initial diagnostic.

For client assessments, the client route must branch into the appropriate individual, team or organisation framework.

Each route must have its own:

- Questionnaire
- Scoring model
- Competency framework
- Dimension definitions
- Maturity thresholds
- Results language
- Recommendation logic
- Future-state narrative logic

## 10.2 Duration

Every route must take approximately **5–7 minutes**.

Target:

- Approximately 12–15 core diagnostic interactions, with conditional sub-questions only when relevant
- **At least 85–90% of customer inputs must be structured**: single-select, multi-select, scale, yes/no or ranked-choice
- **Maximum 2–3 short free-text questions across the entire assessment journey**
- Free-text responses are context enrichers and must **not** be required for deterministic scoring
- No repeated questions
- No unnecessary demographic questions
- The customer should be able to complete most of the assessment by clicking/tapping rather than typing

## 10.3 Assessment UX

Include:

- Progress bar
- Question count, for example **6 of 12**
- Section milestones
- Card-based questions
- Short transition messages
- Subtle professional animations
- Session autosave only
- Warning before leaving or refreshing
- Completion confirmation

Do not include childish gamification, points, confetti or distracting effects.

## 10.4 Question Management

Phase 1 uses a hybrid content-management model:

Editable through the admin dashboard:

- Question wording
- Answer wording
- Help text
- EN and BM translations
- Programme and module content

Protected from casual editing:

- Scoring logic
- Weighting
- Competency thresholds
- Recommendation rules
- Lead-priority rules

The assessment framework and Phase 1 question bank are specified below. Question wording may be refined only through controlled Product Owner testing using synthetic or manually entered test data. Phase 1 does **not** depend on pilot-user data. Any change that affects scoring intent, thresholds, TNA logic or recommendations must be versioned, rerun against the golden diagnostic test set and explicitly approved by the Product Owner before release.


## 10.4A Assessment Response Design Standard

The system must optimise for answer completion, consistency and analysable data rather than long written responses.

### Structured-response rule

- Default every question to a structured answer format wherever a credible option set can be defined.
- Use single-select for mutually exclusive maturity states.
- Use multi-select for tools, pain points, outcomes, departments and use cases.
- Use limited ranked-choice only when priority order materially improves the TNA.
- Do not ask users to type information that can be captured reliably through a structured option.
- Include **Not sure / Not applicable** where forcing an inaccurate answer would damage data quality.

### Free-text limit

The complete assessment journey may contain **no more than three short free-text prompts**. Recommended Phase 1 prompts are:

1. **Success statement — required, short:** “In one sentence, what would make AI training worthwhile for you?” Maximum 200 characters.
2. **Work-context example — optional:** “Name one recurring task or process where AI could help most.” Maximum 200 characters.
3. **Additional context — optional:** “Is there anything important we have not covered?” Maximum 250 characters.

These responses may personalise the Opportunity Horizon, TNA narrative and discovery discussion, but they must never directly alter the deterministic readiness score.

### Data-quality principle

The assessment should prioritise clean, comparable structured answers. Free text is supporting evidence, not the foundation of scoring. The application must store both the selected option codes and the user-facing answer labels so future reporting remains understandable even if wording changes.

## 10.5 Assessment Design Principle

The readiness assessment and the Training Needs Analysis (TNA) must operate as **one diagnostic system**, not as two disconnected questionnaires.

The assessment must gather enough evidence to answer five commercial and learning questions:

1. **Where is the respondent / team / organisation now?**
2. **What AI capability is required for the future state they want?**
3. **What is preventing them from getting there?**
4. **Which gaps are actually trainable?**
5. **Which learning intervention should be prioritised first?**

The same answers must feed:

- AI Readiness / Capability score
- Maturity stage
- LLM / AI-tool investment analysis
- Pain-point analysis
- Risk and constraint analysis
- Instant TNA Snapshot
- Training recommendation logic
- Opportunity Horizon narrative
- Lead qualification
- Pre-training baseline
- Future post-training reassessment

Do not ask the customer the same fact twice unless a later question is explicitly validating an earlier answer.

## 10.6 Phase 1 AI Readiness / Capability Dimensions

The diagnostic must cover all of the following dimensions. The labels presented to users may vary by route, but the underlying data model must remain consistent enough for analytics and later benchmarking.

| Code | Dimension | What it measures |
| --- | --- | --- |
| D1 | AI Understanding & Practical Competency | Understanding of generative AI / LLMs, prompting, iteration, verification and appropriate use |
| D2 | LLM / AI Tool Access & Investment | Whether suitable tools are available, licensed, approved, accessible and fit for work |
| D3 | Adoption & Actual Usage | Frequency, breadth and consistency of real-world AI use rather than awareness alone |
| D4 | Workflow & Process Integration | Whether AI is applied to repeatable tasks, workflows, handoffs, analysis or process improvement |
| D5 | Responsible Use, Data & Governance | Awareness and practice relating to confidentiality, verification, privacy, policy, permissions and risk |
| D6 | Leadership / Direction / Enablement | Organisational or team direction, sponsorship, expectations and support; for individuals, self-directed development and access to support |
| D7 | Workforce Capability & Change Readiness | Skills coverage, confidence, willingness to learn, knowledge sharing and ability to adopt new working methods |
| D8 | Measurement, Value & Scale | Whether AI use is measured, connected to outcomes, standardised and ready to scale |

### Route interpretation

- **Individual AI Capability Profile:** emphasise D1, D3, D4, D5 and personal development readiness.
- **Team AI Capability Assessment:** emphasise D3, D4, D6, D7 and team consistency.
- **Organisation AI Readiness Snapshot:** use all eight dimensions and explicitly state that results represent the respondent's informed view, not a full enterprise audit.
- **Client route:** use the framework matching the entity being assessed.

## 10.7 Phase 1 Core Question Bank

The final UX should use approximately **12–15 core diagnostic interactions**, with conditional sub-questions appearing only when relevant. The interaction design must follow the structured-response standard above: the overwhelming majority of answers are multiple choice / multi-select, with no more than 2–3 short free-text prompts in the entire journey. Wording must be available in EN and BM.

### Q1 — AI / LLM access and investment

**Which best describes the AI / LLM tools currently available to you or the people being assessed?**

- 0 — No AI / LLM tools are currently approved or provided
- 1 — People mainly use free or personally sourced public AI tools
- 2 — One or more tools are approved, but access is limited or inconsistent
- 3 — Licensed / enterprise AI tools are available to the relevant users
- 4 — Enterprise AI tools are broadly available and are intentionally embedded into work practices

Conditional multi-select profiling field:

**Which tools are currently used or available?**

- ChatGPT
- Microsoft Copilot
- Google Gemini
- Claude
- Perplexity
- Internal / custom LLM or AI assistant
- AI features built into business software
- Other — specify
- None

This profiling field is not scored directly. It must be stored for tool-specific recommendations and LLM-investment analysis.

### Q2 — Actual usage frequency

**How often is AI used for meaningful work or learning tasks?**

- 0 — Never
- 1 — Rarely / experimentation only
- 2 — A few times per month
- 3 — Weekly or several times per week
- 4 — Routinely as part of daily / recurring work

### Q3 — Breadth of use cases

**How broadly is AI being applied?**

- 0 — No practical use cases
- 1 — Mainly basic writing / rewriting / simple questions
- 2 — Several personal productivity tasks
- 3 — Multiple role-specific tasks such as analysis, research, planning, reporting or customer support
- 4 — Multiple repeatable workflows or cross-functional use cases

### Q4 — Prompting and interaction capability

**How confident are users in giving AI clear instructions, refining outputs and obtaining consistent results?**

- 0 — Do not know how to use AI effectively
- 1 — Mostly trial and error
- 2 — Can write basic prompts but results vary
- 3 — Can structure, refine and iterate prompts effectively
- 4 — Can create reusable prompting methods, templates or assistants for recurring work

### Q5 — Verification and judgement

**How consistently are AI outputs checked before being relied on?**

- 0 — Outputs may be accepted without checking
- 1 — Checking is inconsistent
- 2 — Important outputs are usually reviewed
- 3 — Users routinely verify facts, calculations, sources or assumptions where relevant
- 4 — Verification is built into defined working practices / quality controls

### Q6 — Data, privacy and governance

**How clear are the rules for what information may or may not be used with AI tools?**

- 0 — No awareness / no guidance
- 1 — People decide individually
- 2 — General guidance exists but is not consistently understood
- 3 — Approved tools and data-handling expectations are clear
- 4 — Governance, permissions and safe-use practices are embedded and reinforced

### Q7 — Workflow integration

**How integrated is AI into recurring work processes?**

- 0 — Not used in workflows
- 1 — Ad-hoc individual use only
- 2 — Useful tasks are repeated manually with AI
- 3 — Reusable prompts, templates, Gems / agents / copilots or defined AI-assisted steps are used
- 4 — AI-supported workflows are standardised, measured or connected across process steps

### Q8 — Pain / opportunity intensity

**Where is the biggest opportunity for improvement today?** Select up to three.

- Repetitive manual work
- Too much time spent drafting / rewriting
- Research and information gathering
- Reporting and analysis
- Data interpretation
- Customer / stakeholder communication
- Slow turnaround / SLA pressure
- Inconsistent quality or rework
- Prioritisation and task management
- Knowledge trapped with a few people
- Process handoffs / coordination
- Lack of AI confidence
- Low AI adoption
- Lack of clear AI governance
- Underused AI licences / tools
- Difficulty identifying practical use cases
- Other — specify

This question creates **pain-point evidence** and TNA priority inputs; it is not scored as a direct maturity question.

### Q9 — Leadership / enablement

Organisation / team wording:

**How actively does leadership enable practical AI adoption?**

- 0 — AI is not currently discussed or supported
- 1 — Interest exists but there is no clear direction
- 2 — Some encouragement / pilots exist
- 3 — Leaders actively support approved AI use and capability building
- 4 — AI adoption is connected to business priorities, ownership and measurable outcomes

Individual wording:

**How much support and direction do you have to develop and apply AI capability?**

Use the same 0–4 maturity scale adapted to the individual context.

### Q10 — Training and capability coverage

**How prepared are the relevant people to use AI effectively in their roles?**

- 0 — No structured capability exists
- 1 — A few self-taught users / champions only
- 2 — Basic awareness exists but practical skill varies significantly
- 3 — Relevant users have received practical role-based development
- 4 — Capability is continuously developed, shared and reinforced through workplace application

### Q11 — AI investment value realisation

Conditional when an approved / licensed LLM or AI platform exists:

**How much value is currently being realised from the organisation's AI-tool investment?**

- 0 — Tool is available but barely used
- 1 — Some logins / experimentation but little practical value
- 2 — Useful individual productivity gains are visible
- 3 — Multiple teams / roles use it for meaningful recurring work
- 4 — Usage is connected to standard workflows, capability plans and measured outcomes

Conditional when no approved tool exists:

**What best explains why no formal AI / LLM investment has been made yet?**

- Still exploring options
- Unclear business case
- Budget / commercial constraint
- Security / privacy concern
- IT / policy restriction
- Lack of internal capability
- Leadership has not prioritised it
- Current tools are considered sufficient
- Other — specify

This second version is diagnostic and does not penalise the user simply for not purchasing software.

### Q12 — Measurement of AI value

**How is the impact of AI use currently measured?**

- 0 — Not measured
- 1 — Anecdotal feedback only
- 2 — Individual examples / time saved are occasionally captured
- 3 — Selected use cases have defined success measures
- 4 — Capability, adoption and operational outcomes are reviewed systematically

### Q13 — Desired future state / business outcome

**What would make AI training worthwhile for you?** Select up to three.

- Improve individual productivity
- Improve team productivity
- Reduce repetitive manual effort
- Improve turnaround / SLA performance
- Improve quality / reduce rework
- Improve reporting and analysis
- Improve decision support
- Improve customer / stakeholder experience
- Build practical AI confidence
- Increase adoption of existing AI tools
- Get more value from licensed LLM / AI platforms
- Improve responsible / safe AI use
- Identify workflow automation opportunities
- Build internal AI champions
- Prepare managers / leaders to guide AI adoption
- Develop future-ready workforce capability
- Other — specify

**Short context prompt FT1 — required (not scored):**

**In one sentence, what would make AI training worthwhile for you?**

- Maximum 200 characters
- Used for TNA and Opportunity Horizon personalisation
- Never changes the readiness score

**Short context prompt FT2 — optional (not scored):**

**Name one recurring task or process where AI could help most.**

- Maximum 200 characters
- Used as qualitative evidence for task/process-level TNA interpretation

### Q14 — Priority learner group / affected population

**Who most needs capability development first?**

- Myself
- Frontline / operational employees
- Specialists / analysts
- Team leads / supervisors
- Managers
- Senior management / leadership
- L&D
- Talent Development / Talent Management
- HR / People & Culture
- Specific department — select
- Multiple levels / organisation-wide
- Not sure yet

### Q15 — Required Future Capability and Evidence of Gap Closure

This interaction exists specifically to support the HRD Corp TNA structure by establishing what capability is required in the future and how successful gap closure should be evidenced.

**Which capabilities should the relevant learner(s) be able to demonstrate after training?** Select up to four.

- Use an approved AI / LLM tool confidently for relevant work
- Give AI clear, structured instructions and refine outputs
- Verify AI outputs and apply appropriate human judgement
- Use AI safely within data, privacy and governance requirements
- Apply AI to role-specific recurring tasks
- Create reusable prompts, templates, Gems, copilots or assistants
- Identify suitable AI-assisted workflow opportunities
- Improve analysis, reporting, research or decision support with AI
- Improve customer / stakeholder communication using AI appropriately
- Managers / leaders can guide responsible AI adoption
- Teams can use AI more consistently across common work
- Measure whether AI adoption is producing useful workplace outcomes
- Other — specify

**What evidence would show that the training gap has been successfully reduced or closed?** Select all that matter.

- Participant demonstrates the required skill during training
- Participant produces a validated work-related prompt / template / assistant
- Participant applies at least one learning at work within 7–14 days
- Manager / supervisor confirms workplace application
- Pre-vs-post capability assessment improves
- Approved AI / LLM usage increases appropriately
- A defined recurring task is performed more effectively with AI
- At least one suitable workflow opportunity is identified and validated
- Quality / rework / turnaround improves where the organisation can measure it
- A role-specific AI use case is implemented
- Not sure yet — success measures should be agreed during discovery
- Other — specify

This question is not scored as readiness maturity. It provides the **required future competency** and **gap-closure evidence** needed by the TNA engine.

**Short context prompt FT3 — optional (not scored):**

**Is there anything important we have not covered?**

- Maximum 250 characters
- Used only to enrich the report or discovery discussion
- Must not create or alter a scored maturity dimension

### Commercial Timing Field — Moved Outside the TNA Diagnostic

The following remains useful for lead qualification but must be captured as KYC / commercial context rather than as a core TNA competency question:

**When would you ideally want to start improving this capability?**

- Immediately / within 30 days
- Within 1–3 months
- Within 3–6 months
- More than 6 months
- Exploring only / no timeline yet

Timing may influence lead priority and proposal planning, but it must not alter the readiness score or the competency-gap calculation.

## 10.8 Route-Specific Weighting

All scored maturity answers use a raw scale of **0–4**. Dimension scores are normalised to 0–100. The overall score is the weighted sum of dimension scores.

### Organisation AI Readiness Snapshot

| Dimension | Weight |
| --- | ---: |
| D1 AI Understanding & Practical Competency | 10% |
| D2 LLM / AI Tool Access & Investment | 10% |
| D3 Adoption & Actual Usage | 15% |
| D4 Workflow & Process Integration | 15% |
| D5 Responsible Use, Data & Governance | 15% |
| D6 Leadership / Direction / Enablement | 15% |
| D7 Workforce Capability & Change Readiness | 10% |
| D8 Measurement, Value & Scale | 10% |
| **Total** | **100%** |

### Team AI Capability Assessment

| Dimension | Weight |
| --- | ---: |
| D1 | 15% |
| D2 | 10% |
| D3 | 15% |
| D4 | 20% |
| D5 | 10% |
| D6 | 10% |
| D7 | 15% |
| D8 | 5% |
| **Total** | **100%** |

### Individual AI Capability Profile

| Dimension | Weight |
| --- | ---: |
| D1 | 25% |
| D2 | 5% |
| D3 | 15% |
| D4 | 20% |
| D5 | 15% |
| D6 | 5% |
| D7 | 10% |
| D8 | 5% |
| **Total** | **100%** |

Client assessments inherit the weighting of the entity being assessed.

## 10.9 Maturity / Capability Stages

| Score | Stage | Interpretation |
| ---: | --- | --- |
| 0–24 | Exploratory | AI capability is limited, informal or not yet enabled |
| 25–44 | Emerging | Early usage exists but capability, access or direction is inconsistent |
| 45–64 | Developing | Useful adoption exists, but repeatability, governance or role-specific capability remains uneven |
| 65–79 | Operational | AI is used meaningfully with growing consistency, controls and workflow relevance |
| 80–100 | Scaling / Strategic | AI capability is embedded, measured and positioned for broader scaling and advanced use |

The system must calculate the stage automatically. Stage descriptions must be route-aware so an individual is not described using enterprise-governance language and an organisation is not described as though it were one person.

## 10.10 LLM / AI Investment Diagnostic Logic

The report must explicitly evaluate **both investment and utilisation**. Purchasing an LLM licence must never automatically increase readiness unless the tool is actually used, governed and connected to capability.

The system must detect and report at least these states:

| Investment / access pattern | Usage / capability pattern | Diagnostic interpretation |
| --- | --- | --- |
| No approved tool | Low / no usage | **Not Yet Enabled** — capability building and tool-selection clarity may be required before scale |
| No approved tool | Meaningful public / personal-tool usage | **Unmanaged Adoption / Shadow-AI Exposure** — demand exists but governance and approved access may lag behind behaviour |
| Licensed enterprise tool | Low usage | **Underutilised AI Investment** — commercial investment exists but adoption / skill / use-case activation is weak |
| Licensed enterprise tool | Moderate usage, low workflow integration | **Adoption Opportunity** — users are active but value remains concentrated in basic productivity |
| Licensed enterprise tool | High usage, weak governance | **Value with Control Risk** — capability is developing faster than governance |
| Licensed enterprise tool | Strong capability + workflow + governance | **Value Realisation / Scale Ready** — focus may shift toward advanced workflows, measurement, champions and scale |
| Multiple tools | Fragmented use | **Tool Fragmentation** — duplicated capability, inconsistent standards or governance may require rationalisation |

Recommendations must distinguish between a **training need**, a **tool / access need**, a **policy / governance need**, a **process redesign need**, and a **leadership decision need**.

Training must not be prescribed as the solution when the evidence indicates that the primary constraint is non-training related.

---

# 11. Scoring and Results

## 11.1 Instant Result Requirement

Once KYC is completed, the website/application must calculate and display the result immediately.

The primary result must not depend on:

- Manual trainer review
- External document editing
- PDF upload
- Human approval

Core scoring must be deterministic and executed within protected application logic.

## 11.2 Result Components

Every result should include, where relevant:

- Overall score
- Dimension scores
- Capability or maturity stage
- Main strengths
- Main gaps
- Main risks or constraints
- Priority actions
- Main pain points captured
- Desired outcomes captured
- Recommended programme(s)
- Recommended modules
- Gap-to-training mapping
- Opportunity Horizon / future-state narrative
- Primary next-step CTA

## 11.3 Gap → Training → Intended Capability Mapping

Every recommended programme or module must be traceable to an identified need.

The result should show a structure similar to:

| Identified gap | Recommended training intervention | Intended capability |
| --- | --- | --- |
| Inconsistent AI use | Applied prompting and workflow module | More consistent, repeatable AI use |
| Manual repetitive work | AI workflow optimisation | Ability to identify AI-assisted workflow opportunities |
| Low confidence | Guided applied exercises | Greater practical confidence and safe usage |

Recommendations must not appear as arbitrary course promotion.

## 11.4 Business Outcome Chain

Where supported by the user's answers, the report should connect:

**Capability improvement → Operational relevance → Business relevance**

Example:

Stronger prompting capability → better first-draft quality → less rework and faster completion of recurring communication tasks.

Do not invent quantitative ROI.

## 11.5 Benchmarking

Benchmarking is not included in Phase 1.

Phase 2 may compare users against anonymous peer groups based on:

- Assessment type
- Industry
- Company size
- Department
- Role level
- Country or region

Benchmarks must only be shown when the available sample size is sufficiently large and representative to avoid misleading comparisons.


## 11.6 Professional Instant Results Report

Once KYC is complete, the app must render a polished **Instant Diagnostic Report** immediately. The same approved report structure must also be exportable as a branded downloadable PDF and may be emailed to the customer automatically. This instant report is distinct from the optional deeper trainer-reviewed report in Section 15. The Instant Diagnostic Report must be professional enough that an L&D leader, Talent Development leader, HR / People & Culture leader, department head or executive decision-maker could use it as an internal discussion and training-planning document.

Required sections:

1. **Executive Diagnostic Summary**
   - Assessment type
   - Overall score
   - Stage
   - One-paragraph interpretation

2. **Your AI Capability / Readiness Profile**
   - Dimension scores
   - Short interpretation of each dimension
   - Visual chart or score bars

3. **AI / LLM Investment & Utilisation Review**
   - Tools declared
   - Access / licence state
   - Usage level
   - Investment-utilisation diagnostic state
   - Underutilisation / shadow-AI / fragmentation / scale observations where triggered

4. **Key Strengths**
   - Top 2–4 evidence-backed strengths

5. **Priority Gaps / Risks / Constraints**
   - Top 2–4 evidence-backed gaps
   - Explicit distinction between training-solvable and non-training constraints

6. **Pain Points and Desired Outcomes**
   - Customer-selected pains
   - Customer-selected outcomes
   - Connection between the two

7. **Opportunity Horizon**
   - Current state
   - What stronger capability could enable
   - Business relevance without guaranteed ROI

8. **Instant Training Needs Analysis Snapshot**
   - Priority needs
   - Current vs required capability
   - Root cause
   - Training need classification
   - Learner group
   - Recommended intervention
   - Success evidence

9. **Training Prescription**
   - Gap → programme/module → intended capability
   - Recommended sequence
   - Why each recommendation is relevant

10. **Suggested Next 30–90 Day Capability Path**
    - Immediate foundations
    - Practical application
    - Reinforcement / transfer
    - Reassessment
    - This is a capability roadmap, not a guaranteed performance plan

11. **Methodology / Limitation Note**
    - Explain that the score is based on submitted responses
    - Organisation Snapshot is single-respondent unless Phase 2 multi-respondent mode is used
    - Results are diagnostic and do not constitute an audit, compliance certification or guaranteed ROI assessment

12. **Primary CTA**
    - **Discuss My Results / Explore My Training Recommendation**
    - Secondary CTA: **Request a Tailored Proposal**

## 11.7 Report Personalisation Rules

The report must personalise recommendations using, where available:

- Individual / team / organisation route
- Job position / decision authority
- Department
- Industry
- Country
- Organisation size
- Declared LLM / AI tools
- Licence / access status
- Usage frequency
- Lowest dimension scores
- Pain points
- Desired outcomes
- Urgency
- Learner group
- Existing training exposure

AI-generated narrative may explain and connect these facts, but deterministic application logic must remain the source of truth for scores, stages, diagnostic states and recommendation eligibility.

### L&D / Talent Development Interpretation Mode

When the respondent identifies as L&D, Talent Development / Talent Management or HR / People & Culture, the report should additionally surface a concise planning view containing:

- Target learner population / learner groups
- Priority capability gaps
- Future competencies required
- Current vs required competency
- Trainable vs non-training root causes
- Recommended programme / module sequence
- Suggested learning objectives
- Suggested evidence of competency acquisition and workplace transfer
- Suggested reassessment / follow-up point
- Organisational dependencies that training alone cannot solve

This view is intended to help the buyer move from **diagnosis → TNA → learning plan → internal approval / discovery discussion**. It must not claim that the platform has completed the customer's internal HR governance or budget-approval process.


---


# 11A. HRD Corp-Structured Training Needs Analysis (TNA) Engine

## 11A.1 Purpose and Positioning

The platform must automatically generate an **Instant Training Needs Analysis Snapshot** as part of the free value returned to every completed assessment taker.

The TNA must follow the structure reflected in published HRD Corp TNA material. It must not be a generic training recommendation, a sales-preference form, or a simple list of courses. It must be usable by **L&D and Talent Development teams as a structured training-planning input**, while remaining appropriately labelled as an automated diagnostic rather than a formal HRD Corp approval.

**Public / report wording rule:** use **"HRD Corp-structured TNA"** or **"TNA structured in alignment with HRD Corp published TNA principles."** Do not claim that the automated TNA itself is "HRD Corp approved", "HRD Corp certified" or formally endorsed unless HRD Corp has separately provided such approval.

For individual users, label the output **Personal AI Training Needs Analysis**.

For teams, label it **Team AI Training Needs Analysis**.

For single-respondent organisation assessments, label it **Indicative Organisation AI Training Needs Analysis** and state that it reflects the perspective of the respondent rather than a full organisation-wide audit.

Phase 2 multi-respondent diagnostics may produce a higher-confidence **Organisation AI Training Needs Analysis**.

## 11A.2 Mandatory HRD Corp TNA Backbone

Every generated TNA must explicitly cover the following HRD Corp TNA structure in this order. These headings are **mandatory output sections**, not optional narrative themes.

### 1. Key Organisational / Individual Goal or Objective

The TNA must identify the business, operational, role or development objective that creates the need for capability development.

Evidence may come from:

- Desired business outcomes selected in Q13
- Pain / opportunity areas selected in Q8
- Assessment ro