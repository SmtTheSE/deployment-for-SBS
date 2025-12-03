import React, { useEffect, useState, useCallback } from "react";
import Container from "../Components/Container";
import DropDowns from "../Components/DropDown";
import DualCircularProgress from "../Components/DualCircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import StackedBarChart from "../Components/StackedBarChart";

// Get course color based on course name
const getCourseColor = (courseName) => {
  // Define a set of colors to use
  const colorPalette = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500",
  ];

  // Create a consistent hash from the course name to select a color
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    const char = courseName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash to select a color from the palette
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

// Calendar Event Popup Component
const EventPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-96 border border-gray-200 transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {event.courseName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Date:</span>
            <span className="text-gray-900">{event.classDate}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Time:</span>
            <span className="text-gray-900">
              {event.startTime} - {event.endTime}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Room:</span>
            <span className="text-gray-900">{event.room}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Lecturer:</span>
            <span className="text-gray-900">{event.lecturerName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Duration:</span>
            <span className="text-gray-900">
              {event.durationMinutes} minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Day Detail Popup Component
const DayDetailPopup = ({ date, schedules, onClose }) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Schedule for {formattedDate}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {schedules && schedules.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 ${getCourseColor(
                            schedule.courseName
                          )} rounded-full mr-2`}
                        ></span>
                        <div className="text-sm font-medium text-gray-900">
                          {schedule.courseName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.lecturerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.durationMinutes} minutes
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                No classes scheduled for this day
              </div>
            </div>
          )}
        </div>

        {schedules && schedules.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Total classes: {schedules.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Class Schedule Calendar Component
const ClassScheduleCalendar = ({ classSchedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [daySchedules, setDaySchedules] = useState([]);
  const [isCalendarAnimating, setIsCalendarAnimating] = useState(false);
  const [calendarTheme, setCalendarTheme] = useState("light"); // Add theme state

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation functions
  const goToPreviousMonth = () => {
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month - 1, 1));
      setIsCalendarAnimating(false);
    }, 150);
  };

  const goToNextMonth = () => {
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + 1, 1));
      setIsCalendarAnimating(false);
    }, 150);
  };

  const goToToday = () => {
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date());
      setIsCalendarAnimating(false);
    }, 150);
  };

  // Get class schedules for a specific date
  const getSchedulesForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return classSchedules.filter((schedule) => {
      // Check if the schedule has a valid classDate and matches the date
      if (schedule.classDate) {
        // Normalize the schedule date to string format for comparison
        let scheduleDateStr = "";

        if (typeof schedule.classDate === "string") {
          // Already a string, use as is
          scheduleDateStr = schedule.classDate;
        } else if (
          schedule.classDate instanceof Object &&
          schedule.classDate.year !== undefined
        ) {
          // LocalDate object format {year, month, day}
          scheduleDateStr = `${schedule.classDate.year}-${String(
            schedule.classDate.month
          ).padStart(2, "0")}-${String(schedule.classDate.day).padStart(
            2,
            "0"
          )}`;
        } else if (schedule.classDate instanceof Date) {
          // Date object format
          scheduleDateStr = schedule.classDate.toISOString().split("T")[0];
        }

        return scheduleDateStr === dateStr;
      }
      return false;
    });
  };

  // Check if date is today
  const isToday = (date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Handle day click
  const handleDayClick = (date) => {
    const schedules = getSchedulesForDate(date);
    setSelectedDay(date);
    setDaySchedules(schedules);
  };

  // Close popups
  const closeEventPopup = () => {
    setSelectedEvent(null);
  };

  const closeDayPopup = () => {
    setSelectedDay(null);
    setDaySchedules([]);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const schedules = getSchedulesForDate(date);

      days.push(
        <div
          key={`prev-${date.getDate()}`}
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${
            calendarTheme === "dark"
              ? "border-gray-700 hover:bg-gray-700"
              : "border-gray-100 hover:bg-gray-50"
          }`}
          onClick={() => handleDayClick(date)}
        >
          <div
            className={`text-xs ${
              calendarTheme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {date.getDate()}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${getCourseColor(
                  schedule.courseName
                )} transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${
                  calendarTheme === "dark" ? "border-gray-800" : "border-white"
                }`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && (
              <div
                className={`text-xs font-semibold ${
                  calendarTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +{schedules.length - 3}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const todayFlag = isToday(date);
      const schedules = getSchedulesForDate(date);

      days.push(
        <div
          key={day}
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${
            calendarTheme === "dark"
              ? "border-gray-700 hover:bg-gray-700"
              : "border-gray-100 hover:bg-gray-50"
          }`}
          onClick={() => handleDayClick(date)}
        >
          <div
            className={`text-base font-bold ${
              todayFlag
                ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-auto mr-auto transition-all duration-300 shadow-md"
                : calendarTheme === "dark"
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            {day}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${getCourseColor(
                  schedule.courseName
                )} cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${
                  calendarTheme === "dark" ? "border-gray-800" : "border-white"
                }`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && schedules.length <= 6 && (
              <div
                className={`text-xs font-semibold ${
                  calendarTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +{schedules.length - 3}
              </div>
            )}
            {schedules.length > 6 && (
              <div
                className={`text-xs font-semibold ${
                  calendarTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +{schedules.length - 6}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const schedules = getSchedulesForDate(date);

      days.push(
        <div
          key={`next-${day}`}
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${
            calendarTheme === "dark"
              ? "border-gray-700 hover:bg-gray-700"
              : "border-gray-100 hover:bg-gray-50"
          }`}
          onClick={() => handleDayClick(date)}
        >
          <div
            className={`text-xs ${
              calendarTheme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {date.getDate()}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${getCourseColor(
                  schedule.courseName
                )} transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${
                  calendarTheme === "dark" ? "border-gray-800" : "border-white"
                }`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && (
              <div
                className={`text-xs font-semibold ${
                  calendarTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +{schedules.length - 3}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Generate mobile list view
  const renderMobileListView = () => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const schedules = getSchedulesForDate(date);

      if (schedules.length > 0) {
        days.push(
          <div
            key={day}
            className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              className={`p-3 font-bold flex justify-between items-center ${
                isToday(date)
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <span>
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs font-normal px-2 py-1 bg-white rounded-full border border-gray-200">
                {schedules.length} classes
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleEventClick(schedule)}
                >
                  <div className="flex items-center mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${getCourseColor(
                        schedule.courseName
                      )} mr-2`}
                    ></div>
                    <span className="font-semibold text-sm text-gray-800">
                      {schedule.courseName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 ml-4">
                    <span>
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                    <span>{schedule.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    if (days.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          No classes scheduled for this month.
        </div>
      );
    }

    return <div className="space-y-2">{days}</div>;
  };

  // Toggle calendar theme
  const toggleCalendarTheme = () => {
    setCalendarTheme(calendarTheme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`w-full ${
        calendarTheme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className={`flex items-center p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            calendarTheme === "dark"
              ? "hover:bg-gray-700 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          title="Previous month"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
          <span className="text-sm font-medium">Prev</span>
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={goToToday}
            className={`text-sm ${
              calendarTheme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } hover:underline transition-all duration-200`}
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className={`flex items-center p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            calendarTheme === "dark"
              ? "hover:bg-gray-700 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          title="Next month"
        >
          <span className="text-sm font-medium">Next</span>
          <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
        </button>
      </div>

      {/* Day headers */}
      <div className="hidden md:grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className={`p-2 text-center text-sm font-medium ${
              calendarTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`hidden md:grid grid-cols-7 gap-1 transition-opacity duration-150 ${
          isCalendarAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {generateCalendarDays()}
      </div>

      {/* Mobile List View */}
      <div
        className={`md:hidden transition-opacity duration-150 ${
          isCalendarAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderMobileListView()}
      </div>

      {/* Event Popup */}
      {selectedEvent && (
        <EventPopup event={selectedEvent} onClose={closeEventPopup} />
      )}

      {/* Day Detail Popup */}
      {selectedDay && (
        <DayDetailPopup
          date={selectedDay}
          schedules={daySchedules}
          onClose={closeDayPopup}
        />
      )}
    </div>
  );
};

const Attendance = () => {
  // Removed attendanceLogs state since we're removing Attendance Logs section
  const [classSchedules, setClassSchedules] = useState([]);
  // Removed rates state since we're removing Attendance Rate section
  // Removed chartData state since we're removing Attendance Hours section
  const navigate = useNavigate();

  // Pagination states for class schedules
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 schedules per page

  // Add animation state
  const [isAnimating, setIsAnimating] = useState(false);

  // Theme state for Attendance Hours section
  const [attendanceHoursTheme, setAttendanceHoursTheme] = useState("light");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isGuest = localStorage.getItem("isGuest") === "true";
    
    if (!token && !isGuest) {
      return navigate("/login");
    }

    // For guest or mock mode, use mock data
    if (isGuest || !token) {
      fetchMockClassSchedules();
    } else {
      axios
        .get("/profile")
        .then((res) => {
          const studentId = res.data.studentId;
          fetchClassSchedules(studentId, token);
        })
        .catch(() => {
          // Fallback to mock data on error
          fetchMockClassSchedules();
        });
    }
  }, []);

  const fetchMockClassSchedules = () => {
    try {
      // Hardcoded class schedule data as requested
      const mockSchedules = [
        {
          classScheduleId: 1,
          classDate: '2025-02-01',
          dayOfWeek: 'MONDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 101',
          courseName: 'Hospitality Operations',
          lecturerName: 'Dr. Smith'
        },
        {
          classScheduleId: 2,
          classDate: '2025-02-03',
          dayOfWeek: 'WEDNESDAY',
          startTime: '14:00',
          endTime: '16:00',
          durationMinutes: 120,
          room: 'Room 205',
          courseName: 'Food and Beverage Industry',
          lecturerName: 'Prof. Johnson'
        },
        {
          classScheduleId: 3,
          classDate: '2025-02-05',
          dayOfWeek: 'FRIDAY',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          room: 'Room 301',
          courseName: 'Customer Service Excellence',
          lecturerName: 'Dr. Williams'
        },
        {
          classScheduleId: 4,
          classDate: '2025-02-06',
          dayOfWeek: 'THURSDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 105',
          courseName: 'Tourism Marketing',
          lecturerName: 'Dr. Brown'
        },
        {
          classScheduleId: 5,
          classDate: '2025-02-07',
          dayOfWeek: 'TUESDAY',
          startTime: '13:00',
          endTime: '15:00',
          durationMinutes: 120,
          room: 'Room 201',
          courseName: 'Event Management',
          lecturerName: 'Prof. Davis'
        },
        {
          classScheduleId: 6,
          classDate: '2025-02-10',
          dayOfWeek: 'MONDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 101',
          courseName: 'Customer Service Excellence',
          lecturerName: 'Dr. Williams'
        },
        {
          classScheduleId: 7,
          classDate: '2025-02-12',
          dayOfWeek: 'WEDNESDAY',
          startTime: '14:00',
          endTime: '16:00',
          durationMinutes: 120,
          room: 'Room 205',
          courseName: 'Food and Beverage Industry',
          lecturerName: 'Prof. Johnson'
        },
        {
          classScheduleId: 8,
          classDate: '2025-02-13',
          dayOfWeek: 'THURSDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 105',
          courseName: 'Hospitality Operations',
          lecturerName: 'Dr. Smith'
        },
        {
          classScheduleId: 9,
          classDate: '2025-02-14',
          dayOfWeek: 'FRIDAY',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          room: 'Room 301',
          courseName: 'Hospitality Operations',
          lecturerName: 'Dr. Smith'
        },
        {
          classScheduleId: 10,
          classDate: '2025-02-17',
          dayOfWeek: 'MONDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 101',
          courseName: 'Customer Service Excellence',
          lecturerName: 'Dr. Williams'
        },
        {
          classScheduleId: 11,
          classDate: '2025-02-19',
          dayOfWeek: 'WEDNESDAY',
          startTime: '14:00',
          endTime: '16:00',
          durationMinutes: 120,
          room: 'Room 205',
          courseName: 'Food and Beverage Industry',
          lecturerName: 'Prof. Johnson'
        },
        {
          classScheduleId: 12,
          classDate: '2025-02-20',
          dayOfWeek: 'THURSDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 105',
          courseName: 'Tourism Marketing',
          lecturerName: 'Dr. Brown'
        },
        {
          classScheduleId: 13,
          classDate: '2025-02-21',
          dayOfWeek: 'FRIDAY',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          room: 'Room 301',
          courseName: 'Event Management',
          lecturerName: 'Prof. Davis'
        },
        {
          classScheduleId: 14,
          classDate: '2025-02-24',
          dayOfWeek: 'MONDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 101',
          courseName: 'Hospitality Operations',
          lecturerName: 'Dr. Smith'
        },
        {
          classScheduleId: 15,
          classDate: '2025-02-26',
          dayOfWeek: 'WEDNESDAY',
          startTime: '14:00',
          endTime: '16:00',
          durationMinutes: 120,
          room: 'Room 205',
          courseName: 'Food and Beverage Industry',
          lecturerName: 'Prof. Johnson'
        },
        {
          classScheduleId: 16,
          classDate: '2025-02-27',
          dayOfWeek: 'THURSDAY',
          startTime: '09:00',
          endTime: '11:00',
          durationMinutes: 120,
          room: 'Room 105',
          courseName: 'Tourism Marketing',
          lecturerName: 'Dr. Brown'
        },
        {
          classScheduleId: 17,
          classDate: '2025-02-28',
          dayOfWeek: 'FRIDAY',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          room: 'Room 301',
          courseName: 'Customer Service Excellence',
          lecturerName: 'Dr. Williams'
        }
      ];

      setClassSchedules(mockSchedules);
      console.log("Mock class schedules loaded:", mockSchedules);
    } catch (error) {
      console.error("Failed to fetch mock class schedules:", error);
      setClassSchedules([]);
    }
  };

  // Reset to first page when classSchedules changes
  useEffect(() => {
    setCurrentPage(1);
  }, [classSchedules]);

  const fetchClassSchedules = async (studentId, token) => {
    try {
      // In a real implementation, you would fetch this data from the API
      fetchMockClassSchedules();
    } catch (error) {
      console.error("Failed to fetch class schedules:", error);
      fetchMockClassSchedules();
    }
  };

  // Pagination functions for class schedules
  const getPaginatedSchedules = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return classSchedules.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(classSchedules.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= getTotalPages()
    ) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsAnimating(false);
      }, 150); // Match CSS animation duration
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  return (
    <section className="p-4 md:p-10">
      <Container className="flex flex-col gap-5">
        {/* Calendar Section - Moved to top */}
        <div className="bg-white p-5 rounded-xl shadow-lg w-full transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-font text-3xl mb-5">Calendar</h1>
          </div>
          <div className="min-h-[500px]">
            <ClassScheduleCalendar classSchedules={classSchedules} />
          </div>
        </div>

        {/* Class Schedule Information - Only section left */}
        <div className="bg-white p-5 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl">
          <h1 className="text-font text-3xl mb-5">
            Class Schedule for the Semester
          </h1>
          <p className="mb-4 text-gray-600">
            This calendar shows all your scheduled classes for the entire
            semester.
          </p>

          {/* Course Schedule Table */}
          <div
            className={`overflow-x-auto transition-opacity duration-150 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecturer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedSchedules().length > 0 ? (
                  getPaginatedSchedules().map((schedule) => (
                    <tr
                      key={schedule.classScheduleId}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => {
                        // Convert string date to Date object for popup
                        const date = new Date(schedule.classDate);
                        const schedules = [schedule];
                        // We can't access the state setters from ClassScheduleCalendar here
                        // So we'll just scroll to the top for now
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 ${getCourseColor(
                              schedule.courseName
                            )} rounded-full mr-3`}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.courseName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.dayOfWeek}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.lecturerName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No class schedules available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {getTotalPages() > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                Previous
              </button>

              <span className="text-gray-600">
                Page {currentPage} of {getTotalPages()}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === getTotalPages()}
                className={`px-4 py-2 rounded-md ${
                  currentPage === getTotalPages()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Attendance;