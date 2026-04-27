import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TribalBackground from '../components/animations/TribalBackground';

function MainLayout() {
  return (
    <div className="site-shell flex min-h-screen flex-col bg-tribal-50">
      <TribalBackground />
      <Navbar />
      <main className="app-container relative z-10 flex-1 py-8 md:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
