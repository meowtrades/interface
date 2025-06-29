/** @format */

const steps = [
  {
    number: "1",
    title: "Trade",
    description: "Choose any strategy and begin your trading journey.",
  },
  {
    number: "2",
    title: "Earn",
    description:
      "Earn by completing actions like keeping strategies live or joining trends.",
  },
  {
    number: "3",
    title: "Watch",
    description: "Paws get added to your profile. Track it on the leaderboard.",
  },
  {
    number: "4",
    title: "Save",
    description: "As your score increases, your platform fees decrease.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 px-6 text-black relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">⚙️ How It Works</h2>
        <p className="text-center mb-12 text-lg">
          Start earning in 4 simple steps
        </p>
        <div className="grid md:grid-cols-4 gap-8 rounded-lg bg-white p-10 shadow-lg">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 text-white bg-meow-ginger rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
              <p className=" text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
