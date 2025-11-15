import RecommendationDemo from "@/components/recomendations/recomandation";
import Navbar from "@/components/shared/Navbar";

const Demo = () => {
  return (
    <main className="min-h-screen w-full">
      <div className="relative bg-zinc-300">
        <Navbar />
        <RecommendationDemo />
      </div>
    </main>
  );
};

export default Demo;
