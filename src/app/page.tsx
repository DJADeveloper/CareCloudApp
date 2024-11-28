import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import AnnouncementListPage from "./(dashboard)/list/announcements/page";
import StudentListPage from "./(dashboard)/list/students/page";

const Homepage = () => {
  return (
    <div className="">
      <StudentListPage />
    </div>
  );
};

export default Homepage;
