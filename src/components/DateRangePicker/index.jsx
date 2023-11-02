import { useEffect, useState, useRef } from "react";
import DatePicker from "../DatePicker/DatePicker";

const getfirstCalender = (value) => {
  const currentDate = new Date();

  const day = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + value
  );

  return day;
};

const DateRangePicker = () => {
  const [firstInterval, setFirstInterval] = useState(null);
  const [secondInterval, setSecondInterval] = useState(null);
  const [firstCalender, setFirstCalender] = useState(getfirstCalender(0));
  const [secondCalender, setSecondCalender] = useState(getfirstCalender(1));
  const [coverPage, setCoverPage] = useState(false);
  const inputElement = useRef();

  const getDate = (date) => {
    const currentDate = new Date(date);

    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    return day;
  };

  const getweekends = (firstInterval, secondInterval) => {
    // To set two dates to two variables
    const date1 = new Date(getDate(firstInterval));
    const date2 = new Date(getDate(secondInterval));
    const weekEnd = [];
    console.log("i am here");

    // To calculate the time difference of two dates
    const Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    for (let i = 0; i < Difference_In_Days; i++) {
      const day = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate() + i
      );
      if (day.getDay() === 0 || day.getDay() === 6) {
        weekEnd.push(day);
      }
    }
    return weekEnd;
  };

  const firstDateSelected = (value) => {
    console.log("first", value);
    const currentDate = new Date(value.getFullYear(), value.getMonth());
    console.log("secondCalender ", secondCalender);
    const secondDate = new Date(
      secondCalender.getFullYear(),
      secondCalender.getMonth()
    );
    console.log("checking", currentDate.getTime() >= secondDate.getTime());
    console.log("currentDate ", currentDate, " secondDate ", secondDate);
    if (currentDate.getTime() >= secondDate.getTime()) {
      const newDate = new Date(value.getFullYear(), value.getMonth() + 1);
      console.log("I am here", newDate);
      setSecondCalender((prev) => {
        prev = null;
        return newDate;
      });
      setFirstCalender((prev) => {
        prev = null;
        return new Date(value.getFullYear(), value.getMonth());
      });
    }
  };
  const secondDateSelected = (value) => {
    console.log("first", value);
    const currentDate = new Date(value.getFullYear(), value.getMonth());
    const firstDate = new Date(
      firstCalender.getFullYear(),
      firstCalender.getMonth()
    );
    if (firstDate.getTime() >= currentDate.getTime()) {
      const newDate = new Date(value.getFullYear(), value.getMonth() - 1);
      console.log("I am here", newDate);
      setFirstCalender((prev) => {
        prev = null;
        return newDate;
      });
      setSecondCalender((prev) => {
        prev = null;
        return new Date(value.getFullYear(), value.getMonth());
      });
    }
  };
  useEffect(() => {
    let weekend = [];
    if (firstInterval && secondInterval) {
      inputElement.current.value =
        new Date(getDate(firstInterval)).toISOString().slice(0, 10) +
        " ~ " +
        new Date(getDate(secondInterval)).toISOString().slice(0, 10);
      weekend = [...getweekends(firstInterval, secondInterval)];
      console.log("weekend ", weekend);
    }
  }, [firstInterval, secondInterval]);

  const getDayclick = (value) => {
    if (!firstInterval && !secondInterval) {
      setFirstInterval(value);
    } else if (firstInterval && !secondInterval) {
      if (firstInterval > value) {
        const holder = firstInterval;
        setFirstInterval(value);
        setSecondInterval(holder);
      } else {
        setSecondInterval(value);
      }
    } else {
      setSecondInterval(null);
      setFirstInterval(value);
    }
  };
  const getTodayInterval = () => {
    const currentDate = new Date();

    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setFirstInterval(day);
    setSecondInterval(day);
    setCoverPage(!true);
  };

  const getYesterdayInterval = () => {
    const currentDate = new Date();

    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );
    console.log("date", currentDate);
    setFirstInterval(day);
    setSecondInterval(day);
    setCoverPage(!true);
  };
  const get30DayInterval = () => {
    const currentDate = new Date();
    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 30
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    console.log("date", end, "first", day);
    secondDateSelected(day);
    setFirstInterval(day);
    setSecondInterval(end);
    setCoverPage(!true);
  };

  return (
    <>
      <input
        style={{
          width: "650px",
          paddingLeft: "8px",
          paddingTop: "6px",
          paddingBottom: "6px",
          border: "2px solid #2684ff",
        }}
        onFocus={() => {
          setCoverPage(true);
        }}
        ref={inputElement}
        placeholder="yyyy-MM-dd ~ yyyy-MM-dd"
      />
      <div className={`${!coverPage ? "cover-page" : ""}`}>
        <div className="date-range">
          <DatePicker
            defaultSelectedDate={firstCalender}
            onGetdateClicked={getDayclick}
            firstInterval={firstInterval}
            secondInterval={secondInterval}
            onDateSelected={firstDateSelected}
            key={firstCalender}
          />
          <DatePicker
            defaultSelectedDate={secondCalender}
            onGetdateClicked={getDayclick}
            firstInterval={firstInterval}
            secondInterval={secondInterval}
            onDateSelected={secondDateSelected}
            key={secondCalender}
          />
        </div>
        <div className="footer">
          <button className="button" onClick={getTodayInterval}>
            today
          </button>
          <button className="button" onClick={getYesterdayInterval}>
            Yesterday
          </button>
          <button className="button" onClick={get30DayInterval}>
            last 30 days
          </button>
          {firstInterval && secondInterval && (
            <button
              onClick={() => {
                setCoverPage(!true);
              }}
              className="button"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DateRangePicker;
