/** @format */

const steps = [
  {
    number: "1",
    title: "Trade",
    description: "Create and manage trading strategies",
  },
  {
    number: "2",
    title: "Earn",
    description: "Complete actions to earn Paws",
  },
  {
    number: "3",
    title: "Track",
    description: "Monitor your progress on the leaderboard",
  },
  {
    number: "4",
    title: "Save",
    description: "Unlock lower fees with higher scores",
  },
];

const earnMethods = [
  {
    title: "First Strategy",
    points: "+50 Paws",
    description: "Launch your first trading strategy",
  },
  {
    title: "Join Trending",
    points: "+20 Paws",
    description: "Create plans in trending strategies",
  },
  {
    title: "Stay Active",
    points: "+20 Paws",
    description: "Keep strategies live for 3+ days",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* How It Works */}
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Start earning in 4 simple steps
        </p>
        <div className="grid md:grid-cols-4 gap-8 bg-card rounded-lg p-8 border border-border mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* How to Earn Paws */}
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          How to Earn Paws
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {earnMethods.map((method, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-card-hover transition-shadow"
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {method.title}
              </h3>
              <div className="text-2xl font-bold text-primary mb-4">
                {method.points}
              </div>
              <p className="text-muted-foreground">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
