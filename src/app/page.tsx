import FamilyListPage from "./(dashboard)/list/families/page";
import ResidentListPage from "./(dashboard)/list/residents/page";

const Homepage = () => {
  return (
    <div className="">
      <ResidentListPage />
      <FamilyListPage />
    </div>
  );
};

export default Homepage;
