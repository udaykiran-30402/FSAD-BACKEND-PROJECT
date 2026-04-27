import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="site-shell flex min-h-screen flex-col bg-tribal-50">
      <Navbar />
      <main className="app-container flex flex-1 flex-col gap-5 py-8 md:flex-row md:py-10">
        <Sidebar role={user?.role} />
        <section className="min-w-0 flex-1 rounded-2xl border border-[var(--tc-border)] bg-white p-5 shadow-[var(--tc-shadow-sm)] md:p-6">
          <Outlet />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
