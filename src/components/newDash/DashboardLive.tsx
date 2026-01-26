"use client";
import { useEffect, useState } from "react";
import LeftSidebar from "@/components/newDash/LeftSidebar";
import LivesView from "@/components/newDash/LivesView";
import { getStudentLiveRooms, isUserRegistered } from "@/actions/live-room";
import LivePanel from "./LivePanel";

const IndexNewDashLive = ({ matieres, user }: any) => {
  const [activeTab, setActiveTab] = useState<"courses" | "lives">("lives");
  const [liveRooms, setLiveRooms] = useState<any>({
    live: [],
    scheduled: [],
    past: [],
  });
  const [registeredLives, setRegisteredLives] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.registerCode && user?.id) {
      loadLiveRooms();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadLiveRooms = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const rooms = await getStudentLiveRooms(user.id);
      setLiveRooms(rooms);

      // Load registrations
      const allLives = [...rooms.live, ...rooms.scheduled];
      const registrations = await Promise.all(
        allLives.map((live) => isUserRegistered(live.id, user.id)),
      );

      const registered = new Set(
        allLives
          .filter((_, index) => registrations[index])
          .map((live) => live.id),
      );
      setRegisteredLives(registered);
    } catch (error) {
      console.error("Error loading live rooms:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen overflow-hidden pb-[50px]">
      {/* Mobile Navigation - Rendered separately */}
      <div className="md:hidden">
        <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Left Sidebar */}
      <div className="flex h-[calc(100vh-80px)] pt-[14px] md:pt-0 ">
        {/* Left Sidebar - Desktop only */}
        <aside className="w-20 border-r border-border hidden md:block">
          <div className="h-full">
            <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </aside>
        <LivesView
          liveRooms={liveRooms}
          registeredLives={registeredLives}
          user={user}
          onTabChange={setActiveTab}
          loading={loading}
        />

        {/* Right Events Panel*/}
        <aside className="w-96 p-4 hidden lg:block">
          <LivePanel registeredUser={user.registerCode} userId={user.id} />
        </aside>
      </div>
    </div>
  );
};

export default IndexNewDashLive;
