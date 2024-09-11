import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/icons/LOGO.svg";
import { useAuth } from "../helper/context";

export default function Navbar() {
  const { isAuthenticated } = useAuth(); // Check authentication status
  const [avatar, setAvatar] = useState(null); // State to hold the avatar
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to toggle notification dropdown

  useEffect(() => {
    // Check if there's an avatar in local storage
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar && storedAvatar !== "undefined") {
      setAvatar(storedAvatar); // Set the avatar state with the stored avatar
    }
  }, []);

  useEffect(() => {
    // Fetch notifications when the component mounts
    if (
      isAuthenticated &&
      (localStorage.getItem("role") === "seller" ||
        localStorage.getItem("role") === "admin")
    ) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("x-auth-token");
          const response = await fetch(
            "https://eteanepalbackend-production.up.railway.app/api/notifications?limit=10",
            {
              headers: {
                "x-auth-token": token,
              },
            }
          );

          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("x-auth-token");
      await fetch(
        `https://eteanepalbackend-production.up.railway.app/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // const handleMarkRead = async (notificationId) => {
  //   try {
  //     const token = localStorage.getItem("x-auth-token");
  //     await fetch(`/api/notifications/${notificationId}/read`, {
  //       method: 'PUT',
  //       headers: {
  //         'x-auth-token': token,
  //       },
  //     });
  //     setNotifications(notifications && notifications.map(notification =>
  //       notification._id === notificationId ? { ...notification, read: true } : notification
  //     ));
  //   } catch (error) {
  //     console.error('Error marking notification as read:', error);
  //   }
  // };

  return (
    <div className="hero__menu">
      <Link to="/" className="hero__menu__logo ml2 clickAnimation">
        <img src={logo} alt="LOGO" />
      </Link>
      <div className="nav-btn mr2">
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              <div className="avatar clickAnimation">
                {avatar ? (
                  <img
                    src={`https://eteanepalbackend-production.up.railway.app/public/${avatar}`}
                    alt="User Avatar"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8C15.0111 8 14.0444 8.29325 13.2222 8.84265C12.3999 9.39206 11.759 10.173 11.3806 11.0866C11.0022 12.0002 10.9031 13.0055 11.0961 13.9755C11.289 14.9454 11.7652 15.8363 12.4645 16.5355C13.1637 17.2348 14.0546 17.711 15.0246 17.9039C15.9945 18.0969 16.9998 17.9978 17.9134 17.6194C18.8271 17.241 19.6079 16.6001 20.1574 15.7779C20.7068 14.9556 21 13.9889 21 13C21 11.6739 20.4732 10.4021 19.5355 9.46447C18.5979 8.52678 17.3261 8 16 8ZM16 16C15.4067 16 14.8266 15.8241 14.3333 15.4944C13.8399 15.1648 13.4554 14.6962 13.2284 14.1481C13.0013 13.5999 12.9419 12.9967 13.0576 12.4147C13.1734 11.8328 13.4591 11.2982 13.8787 10.8787C14.2982 10.4591 14.8328 10.1734 15.4147 10.0576C15.9967 9.94189 16.5999 10.0013 17.1481 10.2284C17.6962 10.4554 18.1648 10.8399 18.4944 11.3333C18.8241 11.8266 19 12.4067 19 13C18.9992 13.7954 18.6829 14.558 18.1204 15.1204C17.558 15.6829 16.7954 15.9992 16 16Z"
                      fill="black"
                    />
                    <path
                      d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C29.9958 12.2883 28.5194 8.72977 25.8948 6.10518C23.2702 3.48059 19.7117 2.00423 16 2ZM10 26.377V25C10.0008 24.2046 10.3171 23.442 10.8796 22.8796C11.442 22.3171 12.2046 22.0008 13 22H19C19.7954 22.0008 20.558 22.3171 21.1204 22.8796C21.6829 23.442 21.9992 24.2046 22 25V26.377C20.1791 27.4401 18.1085 28.0003 16 28.0003C13.8915 28.0003 11.8209 27.4401 10 26.377ZM23.993 24.926C23.9736 23.614 23.4392 22.3622 22.5051 21.4407C21.571 20.5191 20.3122 20.0017 19 20H13C11.688 20.002 10.4294 20.5195 9.49553 21.441C8.56167 22.3625 8.02742 23.6142 8.00801 24.926C6.19457 23.3067 4.91574 21.1749 4.34084 18.8127C3.76594 16.4505 3.92211 13.9693 4.78864 11.6097C5.65517 9.25012 7.1829 7.20953 9.4068 5.82474C11.6307 4.43994 14.3062 3.60723 17 3.45503C19.6938 3.30282 22.1588 4.13282 24.0228 5.83551C25.8867 7.5382 27.3527 10.0038 27.9307 12.6368C28.5087 15.2697 28.3845 18.0655 27.5659 20.6673C26.7473 23.269 25.455 25.622 23.993 27.375V24.926Z"
                      fill="black"
                    />
                  </svg>
                )}
              </div>
            </Link>

            <div
              className="notification clickAnimation"
              onClick={() => setShowNotifications(!showNotifications)}
              id={
                localStorage.getItem("role") === "seller" ||
                localStorage.getItem("role") === "admin"
                  ? ""
                  : "dn"
              }
            >
              {showNotifications ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <linearGradient
                    id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1"
                    x1="7.534"
                    x2="27.557"
                    y1="7.534"
                    y2="27.557"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="#f44f5a"></stop>
                    <stop offset=".443" stop-color="#ee3d4a"></stop>
                    <stop offset="1" stop-color="#e52030"></stop>
                  </linearGradient>
                  <path
                    fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
                    d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
                  ></path>
                  <linearGradient
                    id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2"
                    x1="27.373"
                    x2="40.507"
                    y1="27.373"
                    y2="40.507"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="#a8142e"></stop>
                    <stop offset=".179" stop-color="#ba1632"></stop>
                    <stop offset=".243" stop-color="#c21734"></stop>
                  </linearGradient>
                  <path
                    fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
                    d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="25" cy="25" r="25" fill="#E7D400" />
                  <path
                    d="M26.5858 34.2499C26.4247 34.5277 26.1934 34.7583 25.915 34.9187C25.6367 35.079 25.3212 35.1633 25 35.1633C24.6788 35.1633 24.3633 35.079 24.085 34.9187C23.8066 34.7583 23.5753 34.5277 23.4142 34.2499M30.5 22.6999C30.5 21.1443 29.9207 19.652 28.8894 18.552C27.8582 17.452 26.4575 16.8333 25 16.8333C23.5425 16.8333 22.1428 17.4511 21.1106 18.552C20.0793 19.652 19.5 21.1443 19.5 22.6999C19.5 29.5447 16.75 31.4999 16.75 31.4999H33.25C33.25 31.4999 30.5 29.5447 30.5 22.6999Z"
                    stroke="black"
                    stroke-width="1.375"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
              {notifications && notifications.length > 0 && (
                <span className="notification-count">
                  {notifications.length}
                </span>
              )}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown__wrapper">
                    {notifications &&
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="notification-dropdown__wrapper__notification"
                        >
                          <p>{notification.message}</p>
                          <div className="notification-actions">
                            {/* <button onClick={() => handleMarkRead(notification._id)}>
                          Mark as read
                        </button> */}
                            <button
                              className="notification-dropdown__wrapper__notification__delete"
                              onClick={() =>
                                handleDeleteNotification(notification._id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="22px"
                                height="22px"
                                viewBox="0 0 16 16"
                              >
                                <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="mr clickAnimation">Login/Signup</button>
          </Link>
        )}
      </div>
    </div>
  );
}
