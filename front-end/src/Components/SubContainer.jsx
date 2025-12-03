import React from "react";

const SubContainer = ({ children, className }) => {
  return (
    <div className={`${className} xs:w-[95%] md:w-[80%] mx-auto`}>
      {children}
    </div>
  );
};

export default SubContainer;
