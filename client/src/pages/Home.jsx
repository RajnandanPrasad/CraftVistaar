import React from "react";
import SearchBar from "../components/SearchBar"
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp"
import Login from "./Login";
import Products from "./Products";
const Home = () => {
    return(
        <div className="navbar">
            <div>
           <img src={logo} width={60} alt="" />
           <SearchBar/>
         <Link to="/Login"><button>Login</button></Link>
          <Link to ="/Singup"><button>Singup</button></Link>
          </div>

          <div>
            <Products/>
          </div>
     
        </div>
    );
}

export default Home;