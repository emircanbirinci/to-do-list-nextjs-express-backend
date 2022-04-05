import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = (props) => {
  return (
    <div className="footer">
      <div className="footer-repo">
        <GitHubIcon />
        <a href="https://github.com/emircanbirinci" style={{ color: "gray" }}>
          Repository
        </a>
      </div>
      <div style={{ color: "gray" }}>© 2022 Emircan Birinci</div>
    </div>
  );
};
export default Footer;
