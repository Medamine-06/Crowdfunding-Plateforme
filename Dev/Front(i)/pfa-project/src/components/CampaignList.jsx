import React from "react";
import ProjectCard from "./ProjectCard";
import campaigns from "../data/campaigns";

const CampaignList = () => {
    console.log(campaigns);
  return (
    <div className="campaign-container">
      {campaigns.map((campaign) => (
        <ProjectCard
          key={campaign.id} // Use 'id' as the unique key
          id={campaign.id}   // Pass the 'id' prop
          title={campaign.title}
          image={campaign.image}
          description={campaign.description}
        />
      ))}
    </div>
  );
};

export default CampaignList;
