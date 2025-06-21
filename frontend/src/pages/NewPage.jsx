import React from "react";
import Sidebar from '../components/HomePage/SideBar'
import Problems from '../components/HomePage/Problems'
import Playlists from '../components/HomePage/Playlists'
import Contest from '../components/HomePage/Contest'
import Dashboard from '../components/HomePage/Dashboard'
import SolvedProblems from '../components/HomePage/SolvedProblems'
import AddProblems from '../components/HomePage/AddProblems'
import { useState } from 'react'
import Profile from "../components/HomePage/Profile";

const NewPage = () => {
  const [activeItem, setActiveItem] = useState("problems");

  // Optionally, handle sidebar collapse state here too

  // Render the component based on activeItem
  let ContentComponent;
  switch (activeItem) {
    case "dashboard":
      ContentComponent = Dashboard;
      break;
    case "problems":
      ContentComponent = Problems;
      break;
    case "playlists":
      ContentComponent = Playlists;
      break;
    case "contest":
      ContentComponent = Contest;
      break;
    case "solved Problems":
      ContentComponent = SolvedProblems;
      break;
    case "add-problems":
      ContentComponent = AddProblems;
      break;
    case "profile":
      ContentComponent = Profile;
      break;
    default:
      ContentComponent = () => <div>Select a menu item</div>;
  }

  return (
      <div className="flex w-full h-screen overflow-hidden">
        {/* Fixed Sidebar */}
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        {/* Scrollable Main Content */}
        <main className="ml-2 flex-1 overflow-y-auto h-screen p-1 w-full">
          <ContentComponent />
        </main>
      </div>

  );
}

export default NewPage
