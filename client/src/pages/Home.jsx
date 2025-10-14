import React from "react";
import SearchBar from "../components/SearchBar"
import logo from "../assets/logo.webp"
import Login from "./Login";
const Home = () => {
    return(
        <div>
            
           <img src={logo} width={60} alt="" />
           <SearchBar/>
     
        </div>
    );
}

export default Home;