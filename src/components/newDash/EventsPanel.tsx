import EventCard from "./EventCard";

const EventsPanel = ({ registeredUser }: any) => {
  const events = [
    {
      type: "webinar" as const,
      title: "Medical Research",
      description:
        "Understanding medical research, critical appraisal skills, and applying evidence-based guidelines in practice",
      date: "Tu, 25.03",
      time: "12:30",
      variant: "card" as const,
      isLocked: false,
    },
    {
      type: "lesson" as const,
      title: "Healthcare Systems",
      description:
        "Overview of healthcare delivery systems, health policy, and their impact on patient care.",
      date: "We, 26.03",
      variant: "lavender" as const,
      isLocked: true,
    },
    {
      type: "task" as const,
      title: "Global Health",
      description:
        "Examination of major global health issues, including infectious diseases, non-communicable diseases, and healthcare disparities.",
      date: "Th, 27.03",
      variant: "cream" as const,
      isLocked: true,
    },
    {
      type: "task" as const,
      title: "Team Communication",
      description:
        "Importance of teamwork and communication among healthcare professionals for optimal patient outcomes.",
      date: "Fr, 28.03",
      variant: "mint" as const,
      isLocked: false,
    },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 card-shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Mes événements 🤓
      </h2>

      <div className="space-y-4 flex-1 overflow-auto pr-2">
        {events.map((event, index) => (
          <EventCard
            key={index}
            type={event.type}
            title={event.title}
            description={event.description}
            date={event.date}
            time={event.time}
            variant={event.variant}
            isLocked={!registeredUser}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsPanel;
