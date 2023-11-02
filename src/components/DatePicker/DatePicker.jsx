import React, { useState, useEffect } from "react";
//import "./DatePicker.css";

const DatePicker = ({
  defaultSelectedDate,
  onGetdateClicked,
  firstInterval,
  secondInterval,
  onDateSelected,
}) => {
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [calendar, setCalendar] = useState([]);
  const [visble, setVisible] = useState(false);
  const [firstDate, setFirstDate] = useState(firstInterval);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthOfYear = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const generateYear = () => {
    const years = [];
    for (let i = 1900; i <= 3022; i++) {
      years.push({ year: i, monthOfYear });
    }
    return years;
  };

  const checkInterval = (date, secondInterval, firstInterval) => {
    const currentDate = new Date(date);
    const highRange = new Date(secondInterval);
    const lowRange = new Date(firstInterval);
    return (
      highRange.getTime() >= currentDate.getTime() &&
      currentDate.getTime() >= lowRange.getTime()
    );
  };

  const getCurrentDate = () => {
    const currentDate = new Date();

    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    return day;
  };

  const generateCalendar = () => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date(); // select day of the month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startOffset = firstDayOfMonth.getDay();
    const endOffset = 6 - lastDayOfMonth.getDay();

    const days = [];
    for (
      let i = 1 - startOffset;
      i <= lastDayOfMonth.getDate() + endOffset;
      i++
    ) {
      const day = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      days.push({
        date: day,
        isCurrentMonth: day.getMonth() === currentDate.getMonth(),
        isDisable: day.getDay() === 0 || day.getDay() === 6 ? false : true,
      });
    }

    setCalendar((prev) => {
      prev = [];
      return [...prev, ...days];
    });
  };

  // Initial calendar generation
  useEffect(() => {
    generateCalendar();
  }, [selectedDate]);

  useEffect(() => {
    setFirstDate(firstInterval);
  }, [firstInterval, secondInterval]);
  //generateCalendar();

  const handleDateClick = (date) => {
    onGetdateClicked(date);

    setFirstDate(date);
  };

  const handleMonthChange = (increment) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
    onDateSelected(newDate);
  };

  const renderHeader = () => {
    return (
      <div className={`header`}>
        <button onClick={() => handleMonthChange(-1)}>{"<"}</button>
        <div
          className="year-selector"
          onClick={() => {
            setVisible(true);
          }}
        >{`${selectedDate?.toLocaleString("default", {
          month: "long",
        })} ${selectedDate?.getFullYear()}`}</div>
        <button onClick={() => handleMonthChange(1)}>{">"}</button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day, index) => (
      <div key={index} className="day-of-week">
        {day}
      </div>
    ));
  };

  const handleMonthClick = (year, month) => {
    const date = new Date(year, month);
    setSelectedDate(date);
    setVisible(false);
    onDateSelected(date);
  };

  const renderCalendarDays = () => {
    return calendar.map((day, index) => (
      <div
        key={index}
        className={`day ${
          day.isCurrentMonth ? "current-month" : "other-month"
        } ${
          day.date.toString() === firstDate?.toString() ||
          day.date.toString() === secondInterval?.toString() ||
          day.date.toString() === firstInterval?.toString() //up
            ? "selected"
            : ""
        } ${
          day.date.toString() === getCurrentDate().toString()
            ? "current-date"
            : ""
        } ${day.isDisable ? "" : "Disable"}
        ${
          checkInterval(day.date, secondInterval, firstDate) &&
          day.isCurrentMonth
            ? "highlighted-date"
            : ""
        }`}
        onClick={day.isDisable ? () => handleDateClick(day.date) : null}
      >
        {day.date.getDate()}
      </div>
    ));
  };
  const renderYears = () => {
    const years = generateYear();
    return years.map((values, index) => (
      <div className="year-month" key={index} id={index}>
        <p className="year month">{values.year}</p>
        {values.monthOfYear.map((monthOfYearIdex, index) => (
          <p
            key={index}
            className="month"
            onClick={() => handleMonthClick(values.year, monthOfYearIdex)}
          >
            {monthOfYearIdex + 1}
          </p>
        ))}
      </div>
    ));
  };

  return (
    <div className="datepicker-container">
      <div>{renderHeader()}</div>
      <div className="days-of-week">{renderDaysOfWeek()}</div>
      <div className="calendar">{renderCalendarDays()}</div>
      <div className={`year-container ${visble ? "visibility" : ""}`}>
        {renderYears()}
      </div>
    </div>
  );
};

export default DatePicker;
