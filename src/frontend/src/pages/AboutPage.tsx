import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FlaskConical, GraduationCap } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. G. Kannan",
    initials: "GK",
    role: "Principal Investigator",
    title: "Associate Professor, Department of Statistics",
    description:
      "Dr. G. Kannan is a distinguished statistician specialising in reliability theory, survival analysis, and probability distributions. He has authored numerous research papers on Birnbaum-Saunders, Fréchet, and Gamma family distributions, and leads the development of this statistical distribution analysis platform.",
    specialisms: [
      "Reliability Theory",
      "Survival Analysis",
      "Probability Distributions",
      "Statistical Modelling",
    ],
    icon: GraduationCap,
    featured: true,
  },
  {
    name: "S. Sadaiyappan",
    initials: "SS",
    role: "Co-Researcher",
    title: "Research Scholar, Department of Statistics",
    description:
      "S. Sadaiyappan is a research scholar contributing to the mathematical development and validation of statistical distribution models. His work focuses on parameter estimation and goodness-of-fit testing for heavy-tailed distributions.",
    specialisms: [
      "Parameter Estimation",
      "Goodness-of-Fit",
      "Heavy-Tailed Distributions",
    ],
    icon: FlaskConical,
    featured: false,
  },
  {
    name: "B. Ravi Kumar",
    initials: "BRK",
    role: "Co-Researcher",
    title: "Research Scholar, Department of Statistics",
    description:
      "B. Ravi Kumar is a research scholar specialising in computational statistics and numerical methods. He has contributed significantly to the algorithmic implementation of distribution function computations and data visualisation components.",
    specialisms: [
      "Computational Statistics",
      "Numerical Methods",
      "Data Visualisation",
    ],
    icon: BookOpen,
    featured: false,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pink-gradient">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-sans font-medium mb-4">
            <GraduationCap size={14} />
            Research Team
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
            Meet the Team
          </h1>
          <p className="text-muted-foreground font-sans text-base max-w-2xl mx-auto">
            The Statistics Distribution Tool is developed and maintained by a
            dedicated team of statisticians and researchers committed to making
            advanced probability computations accessible and accurate.
          </p>
        </div>

        {/* Featured member */}
        {teamMembers
          .filter((m) => m.featured)
          .map((member) => (
            <div key={member.name} className="mb-10">
              <Card
                className="border-primary/30 shadow-pink-lg overflow-hidden"
                data-ocid="about.card"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Avatar side */}
                    <div
                      className="md:w-56 flex flex-col items-center justify-center p-8 gap-3"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.93 0.05 350), oklch(0.88 0.08 345))",
                      }}
                    >
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-display font-bold text-white shadow-pink-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.18 350), oklch(0.45 0.20 335))",
                        }}
                      >
                        {member.initials}
                      </div>
                      <Badge className="bg-white/80 text-primary font-sans text-xs border-0">
                        {member.role}
                      </Badge>
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-8">
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                        {member.name}
                      </h2>
                      <p className="font-sans text-sm text-primary font-medium mb-3">
                        {member.title}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                        {member.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.specialisms.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="font-sans text-xs"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

        {/* Co-researchers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers
            .filter((m) => !m.featured)
            .map((member, idx) => {
              const Icon = member.icon;
              return (
                <Card
                  key={member.name}
                  data-ocid={`about.card.${idx + 1}`}
                  className="border-border hover:border-primary/40 hover:shadow-pink transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.65 0.14 330), oklch(0.55 0.18 350))",
                        }}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {member.name}
                        </h3>
                        <p className="font-sans text-xs text-primary font-medium mt-0.5">
                          {member.title}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1.5 font-sans text-xs border-primary/30 text-primary"
                        >
                          <Icon size={10} className="mr-1" />
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialisms.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="font-sans text-xs"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Project info */}
        <div className="mt-12 p-6 bg-card rounded-2xl border border-border text-center">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            About This Tool
          </h3>
          <p className="font-sans text-sm text-muted-foreground max-w-2xl mx-auto">
            This Statistics Distribution Tool provides precise, real-time
            computations for six probability distributions including Fatigue
            Life (Birnbaum-Saunders), Fréchet, and Gamma families — with all
            parameter variants. All calculations are performed client-side with
            full mathematical accuracy.
          </p>
        </div>
      </div>
    </main>
  );
}
