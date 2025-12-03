import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faBars,
  faGraduationCap,
  faHome,
  faListCheck,
  faListOl,
  faRoute,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useAdminSideBar from "../Hook/useAdminSideBar";

const SideBar = () => {
  const location = useLocation();
  const { collapsed, setCollapsed } = useAdminSideBar();
  const [sideBarMenus, setSideBarMenus] = useState([
    {
      id: 1,
      name: "Home",
      icon: faHome,
      link: "/",
      isCurrent: true,
      children: [],
    },
    {
      id: 2,
      name: "Academic",
      icon: faGraduationCap,
      link: "/academic",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Study Plan",
          icon: faRoute,
          link: "/study-plan",
          isCurrent: false,
        },
        {
          id: 2,
          name: "Transcripts",
          icon: faListOl,
          link: "/transcripts",
          isCurrent: true,
        },
        {
          id: 3,
          name: "Attendances",
          icon: faListCheck,
          link: "/attendence",
          isCurrent: false,
        },
      ],
    },
    {
      id: 3,
      name: "Profile",
      icon: faUser,
      link: "/profile",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Dashboard",
          icon: faHome,
          link: "/profile",
          isCurrent: false,
        },
        {
          id: 2,
          name: "Change Password",
          icon: faUser,
          link: "/change-password",
          isCurrent: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    const currentPath = location.pathname;
    const updatedMenus = sideBarMenus.map((menu) => {
      let isParentCurrent = false;
      let hasActiveChild = false;

      if (menu.children) {
        hasActiveChild = menu.children.some(
          (child) => currentPath === child.link
        );
        const updatedChildren = menu.children.map((child) => ({
          ...child,
          isCurrent: currentPath === child.link,
        }));

        isParentCurrent = hasActiveChild;

        return {
          ...menu,
          isCurrent: isParentCurrent,
          children: updatedChildren,
        };
      }

      return { ...menu, isCurrent: currentPath === menu.link };
    });

    setSideBarMenus(updatedMenus);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMenus = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === id
          ? { ...menu, isCurrent: !menu.isCurrent }
          : { ...menu, isCurrent: false }
      )
    );
  };

  return (
    <motion.nav
      animate={{ width: collapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed xs:top-15 md:top-20 lg:top-30 z-10 bg-iconic h-screen flex flex-col justify-start items-start shadow-xl xs:p-1 md:p-3 overflow-hidden xs:right-0 xs:${
        collapsed ? "hidden" : "block"
      } md:left-0 md:block transition-all duration-300`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white w-full px-3 py-3 rounded-md hover:bg-red-700 transition mb-2 flex items-center xs:hidden md:block"
      >
        {collapsed ? (
          <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
        ) : (
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        )}
      </button>

      <div className="flex flex-col w-full gap-2">
        {sideBarMenus.map((menu) => (
          <div
            key={menu.id}
            className={`text-lg w-full rounded-lg flex flex-col transition-all duration-300 ${
              menu.isCurrent
                ? "bg-white text-iconic"
                : "text-white hover:bg-red-700"
            }`}
          >
            {menu.children.length === 0 ? (
              <Link
                to={menu.link}
                className={`flex ${
                  collapsed ? "justify-center" : "justify-start"
                } items-center cursor-pointer xs:p-2 md:px-3 md:py-3`}
                onClick={() => handleMenus(menu.id)}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={menu.icon}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{menu.name}</span>
                  )}
                </div>
              </Link>
            ) : (
              <>
                <div
                  className={`flex ${
                    collapsed ? "justify-center" : "justify-between"
                  } items-center cursor-pointer xs:p-2 md:px-3 md:py-3`}
                  onClick={() => handleMenus(menu.id)}
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={menu.icon}
                      className="w-5 h-5 flex-shrink-0"
                    />
                    {!collapsed && (
                      <span className="whitespace-nowrap">{menu.name}</span>
                    )}
                  </div>
                  {!collapsed && (
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={`transition-transform duration-300 ${
                        menu.isCurrent ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </div>

                <motion.div
                  animate={{
                    height: menu.isCurrent && !collapsed ? "auto" : 0,
                    opacity: menu.isCurrent && !collapsed ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col text-sm text-gray-700 ml-6 mb-2">
                    {menu.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.link}
                        className={`py-2 px-2 rounded flex items-center ${
                          child.isCurrent
                            ? "text-iconic font-bold bg-red-50"
                            : "hover:text-iconic hover:bg-red-50"
                        }`}
                        onClick={() => setCollapsed(!collapsed)}
                      >
                        <FontAwesomeIcon
                          icon={child.icon}
                          className="w-3 h-3 mr-2 flex-shrink-0"
                        />
                        {!collapsed && <span>{child.name}</span>}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default SideBar;
