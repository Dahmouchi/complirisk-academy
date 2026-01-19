import CoursContainerInfos from "./cours-infos";

const CoursContainer = (cours: any) => {
  const coursArray = cours.cours;
  console.log(coursArray);
  return (
    <div className="rounded-[8px] border p-4 w-full sm:w-[30%]">
      <div className="mb-10">
        <div className="font-bold text-2xl text-zinc-700">25% Complété</div>
        <div className="">Avancement</div>
      </div>
      <div className="flex-col h-[80vh] overflow-y-auto">
        <div className="flex-col space-y-4">
          {coursArray.map((cour: any) => (
            <CoursContainerInfos key={cour.id} {...cour} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursContainer;
