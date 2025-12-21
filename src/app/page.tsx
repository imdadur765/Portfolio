import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Character from '@/components/Character';
import Missions from '@/components/Missions';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Character />
      <Missions />
      <Contact />
    </main>
  );
}
