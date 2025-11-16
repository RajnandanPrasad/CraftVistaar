import React from "react";

const MeetMakers = () => {
  const artisans = [
    {
      name: "Asha Kumari",
      skill: "Terracotta Pottery",
      img: "https://imgs.search.brave.com/mjq64vSQ7JkJFdC_RuHmcAlkFWTL4m_WgSpLwpV_9Xg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmlu/Y2Vzc2RpeWFrdW1h/cmlmb3VuZGF0aW9u/Lm9yZy9zdG9yaWVz/Lzc1MjYyOC5wbmc",
    },
    {
      name: "Ravi Verma",
      skill: "Wood Carving",
      img: "https://imgs.search.brave.com/vF6IRPRJS04XAXYkQqCVyZUbpp5GkV8GM6SosSVHIDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/d29vZGVuY2Fydmlu/Z3MuaW4vY2RuL3No/b3AvYXJ0aWNsZXMv/c2VuZ290dHV2ZWxf/d29ya2luZ19wdGlj/dGVzLndlYnA_dj0x/NzQwODEzNDQ1Jndp/ZHRoPTEwODA",
    },
    {
      name: "Pooja Das",
      skill: "Handwoven Fabric",
      img: "https://imgs.search.brave.com/zC2Z-VILGU0NvcgxhyZL4kCoUkKmRVrCEvqoFF_WkeM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTUw/MDYwMjY4MC9waG90/by9wb3J0cmFpdC1v/Zi1zZW5pb3Itd29t/YW4tcHJheWluZy10/by1nb2QtYXQtaG9t/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9R09kZHVpTUg1/Y1VNMVVueDBfcWhK/WWYzakY1aXpnOGEy/dXNiSG1TdVJ5ND0",
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
              {/* FIXED IMAGE WRAPPER */}
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-300 flex items-center justify-center">
                <img
                  src={artist.img}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>

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
