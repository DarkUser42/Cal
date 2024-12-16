function getMonthNames() {
  return [
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
}

function getDayNames() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
}

let button1State = 0;
let button2State = 0;

function resetM4() {
  button1State = 0;
  button2State = 0;
  document.getElementById("M4toggle1").querySelector("p").textContent =
    "Difference between dates";
  document.getElementById("M4toggle2").querySelector("p").textContent = "Add";
  document.querySelector(".M4-button:nth-child(2)").style.display = "none";
  document.querySelector(".M4-Spacing:nth-child(2)").classList.add("hidden");
  document.querySelector(".M4-Spacing:nth-child(3)").classList.remove("hidden");
  document
    .querySelectorAll(".M4-cal-icon")
    .forEach((el, idx) =>
      idx === 0 ? el.classList.remove("hidden") : el.classList.add("hidden")
    );
  document.getElementById("M4-Calculate").style.display = "none";
  document.getElementById("M4-Difference").style.display = "flex";

  resetDateFields();
  deselectAllFields();
  resetInputs();
  clearDivsM4();
}

document.addEventListener("DOMContentLoaded", function () {
  var M4toggle1 = document.getElementById("M4toggle1");
  M4toggle1.addEventListener("click", function () {
    var paragraph = M4toggle1.querySelector("p");
    paragraph.textContent =
      button1State === 0 ? "Calculate with date" : "Difference between dates";
    button1State = button1State === 0 ? 1 : 0;

    document
      .querySelectorAll(".M4-Spacing:nth-child(2), .M4-Spacing:nth-child(3)")
      .forEach((element) => element.classList.toggle("hidden"));

    var buttonDisplay = button1State === 0 ? "none" : "flex";
    document.querySelector(".M4-button:nth-child(2)").style.display =
      buttonDisplay;

    ["M4-Calculate", "M4-Difference"].forEach((id) => {
      const element = document.getElementById(id);
      element.style.display =
        element.style.display === "flex" ? "none" : "flex";
    });

    equateFields();
    deselectAllFields();
    processDate(button1State, button2State);
  });

  var M4toggle2 = document.getElementById("M4toggle2");
  M4toggle2.addEventListener("click", function () {
    var paragraph = M4toggle2.querySelector("p");
    paragraph.textContent = button2State === 0 ? "Subtract" : "Add";
    button2State = button2State === 0 ? 1 : 0;

    var elements = document.querySelectorAll(".M4-cal-icon");
    elements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
    processDate(button1State, button2State);
  });
});

// Create Cal

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
const today = new Date();
let selectedField = null;

function selectField(fieldId) {
  if (selectedField) {
    document.getElementById(selectedField).classList.remove("selected");
  }
  selectedField = fieldId;
  document.getElementById(selectedField).classList.add("selected");
  startSelectedEventListener();
}

function createCalendar(year, month) {
  const currentDate = new Date(),
    currentYear = currentDate.getFullYear(),
    currentMonth = currentDate.getMonth(),
    currentDay = currentDate.getDate();
  const calendarBody = document.getElementById("calendar-body");
  const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  let day = 1 - startDay;

  let rows = calendarBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      cells[j].className = ""; // Reset class names
      if (day < 1) {
        cells[j].innerText = lastDayOfPreviousMonth + day;
        cells[j].classList.add("calendar-day-deactivate");
        cells[j].onclick = null; // Disable click
      } else if (day > lastDayOfMonth) {
        cells[j].innerText = day - lastDayOfMonth;
        cells[j].classList.add("calendar-day-deactivate");
        cells[j].onclick = null; // Disable click
      } else {
        cells[j].innerText = day;
        cells[j].classList.add("calendar-day-click", "c");
        cells[j].onclick = () => {
          if (selectedField) {
            const monthNames = getMonthNames();
            document.getElementById(
              selectedField
            ).innerText = `${cells[j].innerText}. ${monthNames[month]} ${year}`;
            deselectAllFields();
            processDate(button1State, button2State);
          }
        };
        if (
          year === currentYear &&
          month === currentMonth &&
          parseInt(cells[j].innerText) === currentDay
        ) {
          cells[j].style.color = "var(--CBlue-Color)";
        } else {
          cells[j].style.color = "";
        }
      }
      day++;
    }
  }

  displayCurrentMonth(month);
}

function displayCurrentMonth(month) {
  const monthNames = getMonthNames();
  document.getElementById("current-month").innerText = `${monthNames[month]}`;
}

function handleYearFocus() {
  const yearInput = document.getElementById("year");
  yearInput.value = "";
}

function handleYearBlur() {
  const yearInput = document.getElementById("year");
  if (yearInput.value.length !== 4) {
    yearInput.value = currentYear;
  }
}

function handleYearInput(event) {
  const yearInput = event.target;
  yearInput.value = yearInput.value.replace(/[^0-9]/g, "").slice(0, 4);
  if (yearInput.value.length === 4) {
    let inputYear = parseInt(yearInput.value);
    if (inputYear < 1000) {
      inputYear = 1000;
    } else if (inputYear > 3999) {
      inputYear = 3999;
    }
    currentYear = inputYear;
    currentMonth = 0;
    yearInput.value = currentYear;
    updateCalendar();
    yearInput.blur();
  }
}

function updateCalendar() {
  createCalendar(currentYear, currentMonth);
}

function prevMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  if (currentYear < 1000) {
    currentYear = 1000;
  }
  document.getElementById("year").value = currentYear;
  updateCalendar();
}

function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  if (currentYear > 3999) {
    currentYear = 3999;
  }
  document.getElementById("year").value = currentYear;
  updateCalendar();
}

function resetCalendar() {
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  document.getElementById("year").value = currentYear;
  createCalendar(currentYear, currentMonth);
}

function sideLoad() {
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  document.getElementById("year").value = currentYear;
  createCalendar(currentYear, currentMonth);
}

window.onload = function () {
  sideLoad();
};

document.addEventListener("mousedown", function (event) {
  var target = event.target;
  if (target.tagName.toLowerCase() === "table") {
    event.preventDefault();
  }
});

// m7-box content

function startSelectedEventListener() {
  function deleteListener(event) {
    if (event.key === "Backspace") {
      document.getElementById(selectedField).classList.remove("selected");
      document.getElementById(selectedField).innerHTML = "";
      processDate(0, 0);
      document.removeEventListener("keydown", deleteListener);
    }
  }

  document.addEventListener("keydown", deleteListener);
}

// Button Height

function setHeight1() {
  const height = window.getComputedStyle(
    document.getElementById("year")
  ).height;
  document.documentElement.style.setProperty("--cdiv1-height", height);
}

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    setHeight1();
  }
});

// Number input

let originalValues = {
  "date-cal-box1": "",
  "date-cal-box2": "",
  "date-cal-box3": "",
};

function handleInput(event) {
  const inputBox = event.target;
  inputBox.value = inputBox.value.replace(/[^0-9]/g, "").slice(0, 3);
  if (inputBox.value.length === 3) {
    let inputValue = parseInt(inputBox.value, 10);
    if (inputValue > 999) {
      inputValue = 999;
    }
    inputBox.value = inputValue;
    inputBox.blur();
  }
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.querySelectorAll(".date-cal-box").forEach(function (input) {
      input.blur();
    });
  }
});

function selectM4(inputBox) {
  deselectAllFields();
  inputBox.select();
}

// Equate

function equateFields() {
  const date1Content = document.getElementById("date1").innerText.trim();
  const date3Content = document.getElementById("date3").innerText.trim();

  if (date1Content !== date3Content) {
    document.getElementById("date3").innerText = date1Content;
  }

  if (date3Content !== date1Content) {
    document.getElementById("date1").innerText = date3Content;
  }
}

// Reset functions

function resetInputs() {
  const inputFields = ["date-cal-box1", "date-cal-box2", "date-cal-box3"];
  inputFields.forEach((id) => {
    const inputBox = document.getElementById(id);
    inputBox.value = "";
    originalValues[id] = "";
  });
}

function resetDateFields() {
  document.getElementById("date1").innerText = "";
  document.getElementById("date2").innerText = "";
  document.getElementById("date3").innerText = "";
}

function deselectAllFields() {
  if (selectedField) {
    document.getElementById(selectedField).classList.remove("selected");
    selectedField = null;
  }
}

// CAL result

function parseDate(dateString) {
  const months = getMonthNames();
  const [day, month, year] = dateString.split(" ");
  return new Date(year, months.indexOf(month), day);
}

function dateDifferenceInDays(date1, date2) {
  date1.setUTCHours(0, 0, 0, 0);
  date2.setUTCHours(0, 0, 0, 0);

  const timeDiff = Math.abs(date2.getTime() - date1.getTime());

  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

function dateDifference(date1, date2) {
  if (date1 > date2) {
    [date1, date2] = [date2, date1];
  }

  let years = date2.getUTCFullYear() - date1.getUTCFullYear();
  let months = date2.getUTCMonth() - date1.getUTCMonth();
  let days = date2.getUTCDate() - date1.getUTCDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = dateDifferenceInDays(date1, date2);
  let weeks = 0;
  let remainingDays = days;

  if (remainingDays >= 7) {
    weeks = Math.floor(remainingDays / 7);
    remainingDays -= weeks * 7;
  }

  return { years, months, weeks, remainingDays, totalDays };
}

function parseInputValue(inputElement) {
  const value = inputElement.value.trim();
  return value ? parseInt(value, 10) : "";
}

function adjustDate(date, years, months, days, add = true) {
  let newDate = new Date(date);

  if (add) {
    newDate.setFullYear(newDate.getFullYear() + years);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setDate(newDate.getDate() + days);
  } else {
    newDate.setFullYear(newDate.getFullYear() - years);
    newDate.setMonth(newDate.getMonth() - months);
    newDate.setDate(newDate.getDate() - days);
  }

  const daysOfWeek = getDayNames();
  const monthsOfYear = getMonthNames();

  const dayOfWeek = daysOfWeek[newDate.getDay()];
  const dayOfMonth = newDate.getDate();
  const monthOfYear = monthsOfYear[newDate.getMonth()];
  const year = newDate.getFullYear();

  if (year <= 0) {
    return "Invalid";
  } else {
    const formattedDate = `${dayOfWeek}, ${dayOfMonth}. ${monthOfYear} ${year}`;
    return formattedDate;
  }
}

function processDate(button1State, button2State) {
  if (button1State === 0) {
    const date1String = document.getElementById("date1").innerText;
    const date2String = document.getElementById("date2").innerText;

    const date1 = parseDate(date1String);
    const date2 = parseDate(date2String);

    const diff = dateDifference(date1, date2);

    var years =
      diff.years === 1
        ? `${diff.years} Year, `
        : diff.years > 1
        ? `${diff.years} Years, `
        : "";
    var months =
      diff.months === 1
        ? `${diff.months} Month, `
        : diff.months > 1
        ? `${diff.months} Months, `
        : "";
    var days =
      diff.remainingDays === 1
        ? `${diff.remainingDays} Day`
        : diff.remainingDays > 1
        ? `${diff.remainingDays} Days`
        : "";

    if (diff.weeks > 0 && diff.remainingDays === 0) {
      var weeks =
        diff.weeks === 1
          ? `${diff.weeks} Week `
          : diff.weeks > 1
          ? `${diff.weeks} Weeks `
          : "";
    } else {
      var weeks =
        diff.weeks === 1
          ? `${diff.weeks} Week, `
          : diff.weeks > 1
          ? `${diff.weeks} Weeks, `
          : "";
    }

    if (!years && !months && !weeks && !days) {
      document.getElementById("date-result-description").innerHTML = "";
      document.getElementById("date-result").innerHTML = "";
      document.getElementById("date-result-sub").innerHTML = "";
    } else {
      document.getElementById("date-result-description").innerHTML =
        "Difference";
      document.getElementById("date-result").innerHTML =
        years + months + weeks + days;
      if (diff.totalDays === 1) {
        document.getElementById(
          "date-result-sub"
        ).innerHTML = `${diff.totalDays} Day`;
      } else {
        document.getElementById(
          "date-result-sub"
        ).innerHTML = `${diff.totalDays} Days`;
      }
    }
  } else if (button1State === 1) {
    const date3String = document.getElementById("date3").innerText;
    const date3 = parseDate(date3String);

    const years = parseInputValue(document.getElementById("date-cal-box1"));
    const months = parseInputValue(document.getElementById("date-cal-box2"));
    const days = parseInputValue(document.getElementById("date-cal-box3"));

    const adjustedDate = adjustDate(
      date3,
      years,
      months,
      days,
      button2State === 0
    );

    document.getElementById("date-result-sub").innerHTML = "";
    if (!adjustedDate.includes("NaN") && (years || months || days)) {
      document.getElementById("date-result-description").innerHTML = "Date";
      if (adjustedDate === "Invalid") {
        document.getElementById("date-result").innerHTML = "Invalid";
      } else {
        document.getElementById("date-result").innerHTML = adjustedDate;
      }
    } else {
      document.getElementById("date-result-description").innerHTML = "";
      document.getElementById("date-result").innerHTML = "";
    }
  }
}

function clearDivsM4() {
  var divs = document.querySelectorAll(".data-M4R");

  divs.forEach(function (div) {
    div.innerHTML = "";
  });
}

document.addEventListener("click", function (event) {
  const excludedClasses = [
    "date-field",
    "infobar1-content",
    "calendar-day-deactivate",
  ];

  let targetElement = event.target;
  while (targetElement) {
    if (excludedClasses.some((cls) => targetElement.classList.contains(cls))) {
      return;
    }
    targetElement = targetElement.parentElement;
  }

  deselectAllFields();
});
