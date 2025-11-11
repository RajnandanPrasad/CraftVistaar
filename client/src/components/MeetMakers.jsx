import React from "react";

const MeetMakers = () => {
  const artisans = [
    {
      name: "Asha Kumari",
      skill: "Terracotta Pottery",
      img: "https://i.imgur.com/ZWlO8Oy.jpg",
    },
    {
      name: "Ravi Verma",
      skill: "Wood Carving",
      img: "https://i.imgur.com/dS9dNQK.jpg",
    },
    {
      name: "Pooja Das",
      skill: "Handwoven Fabric",
      img: "https://i.imgur.com/mV5bKfY.jpg",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-pink-50 via-white to-blue-50 py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          👨‍🎨 Meet the Makers
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Every craft tells a story — meet the artisans who bring creativity to life.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artist) => (
            <div
              key={artist.name}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <img
                src={artist.img}
                alt={artist.name}
                className="rounded-full w-32 h-32 mx-auto object-cover border-4 border-blue-300"
              />
              <h3 className="text-xl font-bold text-gray-800 mt-4">
                {artist.name}
              </h3>
              <p className="text-blue-600 text-sm">{artist.skill}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetMakers;
