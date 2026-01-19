"use client";

import dynamic from "next/dynamic";

const VimeoPlayer = dynamic(
  () => import("@/app/(user)/_components/cours/cours-player"),
  {
    ssr: false,
  }
);

const VimeoTest = (params: any) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[8px]">
      <VimeoPlayer
        url={params.videoUrl} // Replace with actual video URL
        thumbnail={params.imageUrl || ""}
      />
    </div>
  );
};

export default VimeoTest;
