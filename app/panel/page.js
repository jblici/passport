"use client";
import Navbar from "@/components/ui/navbar";
import withAuth from "@/lib/withAuth";


const Home = () => {

  return (
    <div className="flex flex-col sm:flex-row text-lg">
      <Navbar />
    </div>
  );
};

export default withAuth(Home);
