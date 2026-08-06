import type { ProposalDraft } from "@/lib/types/proposal-draft";

/**
 * Default draft used when the user starts a brand-new proposal. The
 * content mirrors the proposal template (proposal template.pdf) so the
 * Live Preview shows realistic copy out of the gate.
 */
export function createEmptyProposalDraft(): ProposalDraft {
  return {
    id: `draft-${Date.now()}`,
    validityDays: 14,
    headline: "",
    shortDescription: "",
    about: {
      enabled: false,
      imageUrl: "",
      whoWeAre: "",
      ourMission: "",
      ourVision: "",
      coreValues: [
        {
          id: "cv-1",
          icon: "innovation",
          headline: "Innovation & Leadership",
          description:
            "We lead with forward-thinking ideas that drive progress and create long-term value.",
        },
        {
          id: "cv-2",
          icon: "excellence",
          headline: "Excellence and Quality",
          description:
            "We lead with forward-thinking ideas that drive progress and create long-term value.",
        },
        {
          id: "cv-3",
          icon: "relationships",
          headline: "Strategic Relationships",
          description:
            "We build trusted partnerships based on transparency, collaboration, and shared success.",
        },
      ],
      keyFacts: [
        { id: "kf-1", value: "6+", label: "Years of Experience" },
        { id: "kf-2", value: "120+", label: "Partners Across Industries" },
        { id: "kf-3", value: "300+", label: "Tech Experts" },
        { id: "kf-4", value: "300+", label: "Successful Projects" },
      ],
      certifications: [
        {
          id: "cert-1",
          title: "ISO 9001 Award for Quality of Service",
          issuer: "ISO Associations",
          date: "Jan 2025",
          visible: true,
        },
        {
          id: "cert-2",
          title: "ISO 9001 Award for Quality of Service",
          issuer: "ISO Associations",
          date: "Jan 2025",
          visible: true,
        },
        {
          id: "cert-3",
          title: "ISO 9001 Award for Quality of Service",
          issuer: "ISO Associations",
          date: "Jan 2025",
          visible: true,
        },
      ],
      experts: [
        {
          id: "ex-1",
          name: "Mohamed Mahmoud",
          role: "Chief Executive Officer",
          expertise: [
            "Product & Business Strategy Design",
            "Web Applications, Mobile Apps & SaaS Platforms",
            "Websites, Dashboards, ERP & CRM System Design",
            "Scalable Design Systems & High-Performance Digital Product",
          ],
          selected: true,
        },
        {
          id: "ex-2",
          name: "Matt Scott",
          role: "Head of Programming",
          expertise: ["Backend Architecture", "Cloud Infrastructure", "CI/CD"],
          selected: true,
        },
        {
          id: "ex-3",
          name: "Mohamed Mahmoud",
          role: "Project Manager",
          expertise: ["Roadmaps", "Stakeholder Alignment"],
          selected: true,
        },
        {
          id: "ex-4",
          name: "Mohamed Mahmoud",
          role: "Lead Designer",
          expertise: ["UX Research", "Visual Identity"],
          selected: false,
        },
      ],
      brands: [
        { id: "b-1", name: "Constell" },
        { id: "b-2", name: "Coro Tre" },
        { id: "b-3", name: "MFN" },
        { id: "b-4", name: "Constell" },
        { id: "b-5", name: "Coro Tre" },
        { id: "b-6", name: "MFN" },
      ],
      partners: [
        { id: "p-1", name: "TikTok" },
        { id: "p-2", name: "swill" },
        { id: "p-3", name: "INSTOW" },
        { id: "p-4", name: "OpenAI" },
        { id: "p-5", name: "ALLINTECH" },
        { id: "p-6", name: "OpenAI" },
        { id: "p-7", name: "ALLINTECH" },
        { id: "p-8", name: "INSTOW" },
        { id: "p-9", name: "TikTok" },
        { id: "p-10", name: "swill" },
      ],
    },
    serviceDetails: {
      enabled: false,
      serviceName: "",
      serviceIcon: "Artificial_Intelligence_icon.svg",
      imageUrl: "",
      showImage: true,
      overview: "",
      keyDeliverables: "",
      technologies: [
        {
          id: "t-1",
          name: "Frontend",
          technologies: ["React", "Next.js", "Vue.js", "HTML5"],
        },
        {
          id: "t-2",
          name: "Backend",
          technologies: ["Node.js", "Laravel", "PHP", "Python"],
        },
        {
          id: "t-3",
          name: "DevOps",
          technologies: ["AWS", "Vercel", "Cloudflare"],
        },
      ],
      moreDetails: "",
    },
    why: {
      enabled: false,
      whyChooseAlMaster: "",
      whyPerfectFit: [
        {
          id: "wpf-1",
          title: "Proven Experience in Similar Projects",
          description:
            "Our team has successfully delivered projects in the same industry and scope, giving us a deep understanding of your functional and technical needs.",
        },
        {
          id: "wpf-2",
          title: "Tailored Approach",
          description:
            "We don't rely on generic templates. Every element — from backend structure to interface design — is customized to your goals and workflows.",
        },
        {
          id: "wpf-3",
          title: "Technical Precision",
          description:
            "We use the latest frameworks and clean coding standards to ensure fast, secure, and scalable performance.",
        },
      ],
      whatOthersDont: "",
      distinctAdvantages: [
        {
          id: "da-1",
          title: "Industry Insight",
          description:
            "We've worked on similar-scope projects, allowing us to anticipate challenges and provide tested, efficient solutions.",
        },
        {
          id: "da-2",
          title: "Revisions Until Satisfaction",
          description:
            "We're committed to refining every detail until you're 100% satisfied with the final output.",
        },
        {
          id: "da-3",
          title: "Fast Turnaround Time",
          description:
            "Our agile workflow ensures you get high-quality results within tight deadlines.",
        },
      ],
      similarProjects: [
        {
          id: "sp-1",
          name: "Maiyah App",
          details:
            "To become the most trusted and innovative technology partner in the Middle East and beyond, a company recognized for its ability to blend creativity, reliability, and cutting-edge technology into every project we deliver.",
          link: "https://almaster.tech/about-us",
          gallery: [],
          feedbackAuthor: "Times-egy",
          feedbackBody:
            "I would like to express my deep appreciation to AL Master Technology for their outstanding work in designing and developing El Times Newspaper website.",
          feedbackRating: 5,
          signatureLink: "https://almaster.tech/about-us",
        },
      ],
    },
    scope: {
      enabled: false,
      projectScope: "",
      includedInScope: "",
      excludedFromScope: "",
      phases: [
        {
          id: "ph-1",
          label: "Discovery & Planning",
          description: "Project briefing, goal alignment, sitemap & wireframes",
          duration: "3-4 Days",
        },
        {
          id: "ph-2",
          label: "UI/UX Design",
          description: "Homepage + key inner pages design mockups",
          duration: "10-14 Days",
        },
        {
          id: "ph-3",
          label: "Development",
          description: "Frontend & backend integration, CMS setup",
          duration: "10-14 Days",
        },
        {
          id: "ph-4",
          label: "Testing & Review",
          description: "Quality assurance, speed & device testing",
          duration: "9-10 Days",
        },
        {
          id: "ph-5",
          label: "Launch & Support",
          description: "Final deployment, client walkthrough, post-launch fixes",
          duration: "2-3 Days",
        },
      ],
      estimatedTotalDuration: "",
    },
    quotation: {
      enabled: false,
      mode: "quotation",
      lineItems: [
        {
          id: "li-1",
          service: "UI/UX Design",
          description: "Web & Mobile layouts, and interactive prototypes",
          price: 1800,
        },
        {
          id: "li-2",
          service: "Frontend Development",
          description: "React/TypeScript application with responsive design",
          price: 1600,
        },
        {
          id: "li-3",
          service: "Backend Development",
          description: "RESTful API, Database Design, and server infrastructure",
          price: 1600,
        },
        {
          id: "li-4",
          service: "Deployment & DevOps",
          description: "Web & Mobile layouts, and interactive prototypes",
          price: 1200,
        },
        {
          id: "li-5",
          service: "Testing",
          description: "Web & Mobile layouts, and interactive prototypes",
          price: 800,
        },
      ],
      packages: [
        {
          id: "pk-1",
          name: "Workflow Automation Starter",
          price: 8000,
          cadence: "per month",
          description:
            "Perfect for small teams looking to save time and eliminate manual drudgery.",
          includes: [
            "1 custom automation (3-5 connected tasks) built with n8n or Make.",
            "Setup of up to 3 workflows integrated with your existing tools (Gmail, Slack, Notion, etc.).",
            "Conditional logic & error handling for reliable automation.",
            "Saves 10-15 work hours weekly.",
            "Optional Add-ons: extra workflow + AI integration.",
          ],
          timeline: "3-5 business days.",
        },
        {
          id: "pk-2",
          name: "Workflow Automation Growth",
          price: 12000,
          cadence: "per month",
          description:
            "For growing teams that need deeper integrations and ongoing optimization.",
          includes: [
            "Up to 3 custom automations across your core business tools.",
            "Setup of up to 8 workflows with multi-step conditional logic.",
            "Priority error monitoring & monthly optimization review.",
            "Saves 25-40 work hours weekly.",
            "Optional Add-ons: AI agents + custom dashboards.",
          ],
          timeline: "1-2 weeks.",
        },
        {
          id: "pk-3",
          name: "Workflow Automation Enterprise",
          price: 5000,
          cadence: "per month",
          description:
            "Tailored, end-to-end automation for organizations operating at scale.",
          includes: [
            "Unlimited custom automations scoped to your operations.",
            "Dedicated integration with internal & third-party systems/APIs.",
            "Advanced AI workflows, analytics & SLA-backed support.",
            "Saves 60+ work hours weekly.",
            "Optional Add-ons: on-prem deployment + training.",
          ],
          timeline: "2-4 weeks.",
        },
      ],
      subtotal: 7400,
      applyDiscount: true,
      discountPercent: 10,
      paymentTerms: [
        {
          id: "pt-1",
          label: "1st Payment",
          amount: 4440,
          percentage: 60,
        },
        {
          id: "pt-2",
          label: "Final Payment",
          amount: 2960,
          percentage: 40,
        },
      ],
      notes: "",
    },
    support: {
      enabled: false,
      afterSaleBenefits: [
        {
          id: "ab-1",
          icon: "shield",
          title: "PRIORITY SUPPORT",
          description: "Dedicated expert team to resolve issues quickly and effectively",
        },
        {
          id: "ab-2",
          icon: "refresh",
          title: "UPDATES & FIXES",
          description: "Regular bug fixes and updates to keep your system secure and up-to-date",
        },
        {
          id: "ab-3",
          icon: "monitor",
          title: "SYSTEM MONITORING",
          description: "Proactive monitoring to ensure optimal performance, security, and uptime",
        },
        {
          id: "ab-4",
          icon: "lock",
          title: "SECURE BACKUPS",
          description: "Secure and automated backups to safeguard your valuable data",
        },
        {
          id: "ab-5",
          icon: "chart",
          title: "ANALYTICS & REPORTING",
          description: "Actionable insights and reports to help you make data-driven decisions",
        },
        {
          id: "ab-6",
          icon: "users",
          title: "ACCOUNT MANAGEMENT",
          description: "Dedicated account manager to ensure your needs are met",
        },
      ],
      supportPromise: {
        uptime: "99.9% Uptime Guarantee",
        response: "< 2 Hrs Response Time",
        warranty: "30 Days Warranty Period",
        satisfaction: "100% Human Support",
      },
      supportTeam: [
        { id: "st-1", name: "Ahmed Hassan", role: "IT Customer Service" },
        { id: "st-2", name: "Maryam Ahmed", role: "Account Manager" },
      ],
    },
    whatWeNeed: {
      enabled: false,
      projectAssets: "",
      accessDetails: "",
      technicalReferences: "",
    },
    completedSteps: [],
    arOverrides: {},
    updatedAt: new Date().toISOString(),
  };
}
