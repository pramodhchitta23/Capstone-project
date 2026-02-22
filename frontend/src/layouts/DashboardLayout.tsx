import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}