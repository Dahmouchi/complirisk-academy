interface StatsCardProps {
  total: number;
  completed: number;
  upcoming: number;
}

const StatsCard = ({ total, completed, upcoming }: StatsCardProps) => {
  return (
    <div className="bg-card rounded-3xl p-6 card-shadow animate-fade-in">
      <div className="flex items-center justify-around">
        <div className="text-center">
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-3xl font-bold">{completed}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-3xl font-bold">{upcoming}</p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
