import ResidentForm from "@/components/forms/ResidentForm";
import FamilyListPage from "./(dashboard)/list/families/page";
import ResidentListPage from "./(dashboard)/list/residents/page";
import StaffForm from "@/components/forms/StaffForm";
import StaffPage from "./(dashboard)/staff/page";
import ResidentPage from "./(dashboard)/resident/page";
import FamilyPage from "./(dashboard)/family/page";
import AdminPage from "./(dashboard)/admin/page";
import Menu from "@/components/Menu";
import LoginPage from "./sign-in/page";
import ExamListPage from "./(dashboard)/list/exams/page";
import LessonListPage from "./(dashboard)/list/lessons/page";
import SubjectListPage from "./(dashboard)/list/subjects/page";

const Homepage = () => {
  const dummyData = "hello";
  return (
    <div className="">
      <SubjectListPage />
    </div>
  );
};

export default Homepage;
