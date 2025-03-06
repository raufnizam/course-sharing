const Home = () => {
  return (
    <div className="flex flex-col items-center  h-screen gap-5">
      <h1 className="text-center mt-10 text-6xl font-bold">
        Everything you need to <br />
        <span className="text-purple-600">ace</span> your tech interviews!
      </h1>
      <p className="text-gray-600">Level up your career and land your next role with courses, mock interviews, and community.</p>
      <button className="bg-purple-600 rounded-md p-4 text-white font-bold text-lg">Get started for free</button>
    </div>
  );
};

export default Home;
