import * as jwt from "jsonwebtoken";
import moment from "moment";
import { authorization } from "./authorization";
import { logOutButton } from "./authentication";
/* GLOBAL */
var loggedUser: User;
const STAR_TIME_LIMIT = "04:00";
const END_TIME_LIMIT = "23:59";
/* ---- */
setup();

async function setup() {
  authorization();
  await getData();
  checkCurrentWeek();
  setupCalenderButtons();
  welcomeMessage(loggedUser);
  onClickTimeAddEvent();
  addEventSubmit();
  logOutButton();
}

function addEventSubmit() {
  const addEventForm = document.getElementById("add-event")!;
  const nameInput: HTMLInputElement = addEventForm?.children[0].children[1]
    .children[0] as HTMLInputElement;
  const dateInput: HTMLInputElement = addEventForm?.children[1].children[1]
    .children[0] as HTMLInputElement;
  const startTimeInput: HTMLInputElement = addEventForm?.children[2].children[1]
    .children[0] as HTMLInputElement;
  const endTimeInput: HTMLInputElement = addEventForm?.children[3].children[1]
    .children[0] as HTMLInputElement;
  const descInput: HTMLInputElement = addEventForm?.children[4].children[1]
    .children[0] as HTMLInputElement;
  const submitBtn = addEventForm?.children[5];
  const errorMessages = document.getElementsByClassName(
    "error-message"
  ) as HTMLCollectionOf<HTMLElement>;

  const startTimeField = addEventForm?.children[2].children[1]
    .children[0] as HTMLInputElement;
  const endTimeField = addEventForm?.children[3].children[1]
    .children[0] as HTMLInputElement;

  submitBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    if (isEmpty(addEventForm, errorMessages)) return;
    if (
      timeWithinTimeLimit(
        startTimeInput,
        STAR_TIME_LIMIT,
        END_TIME_LIMIT,
        errorMessages[2]
      )
    ) {
      return;
    }
    if (
      timeWithinTimeLimit(
        endTimeInput,
        STAR_TIME_LIMIT,
        END_TIME_LIMIT,
        errorMessages[3]
      )
    ) {
      return;
    }
    if (isStartTimeGreaterThanEndTime(addEventForm, errorMessages)) {
      return;
    }

    const user = await getUserFromJWT();
    if (user == "") return;

    const body = {
      name: `${nameInput.value}`,
      date: `${dateInput.value}`,
      startTime: `${startTimeInput.value}`,
      endTime: `${endTimeInput.value}`,
      description: `${descInput.value}`,
      user: user,
    };

    const response = await fetch(
      "https://scheduler-21.herokuapp.com/event/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("jwt") ?? ""
          )}`,
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(body),
      }
    );
    if (response.status === 200) {
      deactiveAllErrorMessages(errorMessages);
      window.location.replace(
        "https://maxerling.github.io/_scheduler_frontend/scheduler.html"
      );
    } else {
      const data: ErrorResponse = await response.json();
      activeErrorMessage(errorMessages[3], data.message);
      activeErrorMessage(errorMessages[2], data.message);
    }
  });
}

function timeWithinTimeLimit(
  timeInput: HTMLInputElement,
  startTimeLimit: string,
  endTimeLimit: string,
  errorMessageElement: HTMLElement
) {
  const startTimeLimitSeconds = formatTimeIntoSeconds(startTimeLimit);
  const endTimeLimitSeconds = formatTimeIntoSeconds(endTimeLimit);
  const startTimeDate = new Date(1970, 1, 1, 0);
  startTimeDate.setSeconds(startTimeLimitSeconds);
  const endTimeDate = new Date(1970, 1, 1, 0);
  endTimeDate.setSeconds(endTimeLimitSeconds);

  const timeInputSeconds = formatTimeIntoSeconds(timeInput.value);
  const timeInputDate = new Date(1970, 1, 1, 0);
  timeInputDate.setSeconds(timeInputSeconds);
  const isBetweenLimit =
    startTimeDate.getTime() <= timeInputDate.getTime() &&
    timeInputDate.getTime() <= endTimeDate.getTime();
  if (!isBetweenLimit) {
    errorMessageElement.textContent = `Needs to be within ${startTimeLimit}-${endTimeLimit}`;
    errorMessageElement.style.display = "flex";
    return true;
  }
  errorMessageElement.style.display = "none";
  return false;
}

function convertTimeIntoDate(seconds: number) {
  return new Date(1970, 1, 1, 0).setSeconds(seconds);
}

function formatTimeIntoSeconds(digitalClock: string) {
  const [hours, minutes] = digitalClock.split(":");
  const timeInSeconds = Number(hours) * 60 * 60 + Number(minutes) * 60;
  return timeInSeconds;
}

function activeErrorMessage(
  errorMessageElement: HTMLElement,
  errorMessageText: string
) {
  errorMessageElement.style.display = "flex";
  errorMessageElement.textContent = errorMessageText;
}

function deactiveAllErrorMessages(
  errorMessageElements: HTMLCollectionOf<HTMLElement>
) {
  for (let i = 0; i < errorMessageElements.length; i++) {
    errorMessageElements[i].style.display = "none";
  }
}

async function getUserFromJWT() {
  const token = localStorage.getItem("jwt") ?? "";
  if (token == "") return "";
  const parsedToken = JSON.parse(token);
  const decodedToken: JWTData = jwt.decode(parsedToken) as JWTData;
  const username = decodedToken.sub;
  const response = await fetch(
    `https://scheduler-21.herokuapp.com/user/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("jwt") ?? ""
        )}`,
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const user = (await response.json()) as User;

  return user;
}

function isStartTimeGreaterThanEndTime(
  addEventForm: HTMLElement,
  errorMessages: HTMLCollectionOf<HTMLElement>
) {
  const startTimeField = addEventForm?.children[2].children[1]
    .children[0] as HTMLInputElement;
  const endTimeField = addEventForm?.children[3].children[1]
    .children[0] as HTMLInputElement;
  const splittedStartTimeValue = startTimeField.value.split(":");
  const splittedEndTimeValue = endTimeField.value.split(":");

  const startTimeDate = new Date().setHours(
    Number(splittedStartTimeValue[0]),
    Number(splittedStartTimeValue[1]),
    0
  );
  const endTimeDate = new Date().setHours(
    Number(splittedEndTimeValue[0]),
    Number(splittedEndTimeValue[1]),
    0
  );
  if (startTimeDate > endTimeDate) {
    errorMessages[3].style.display = "flex";
    errorMessages[3].textContent = "Can't be lesser than start time!";
    return true;
  }

  if (startTimeDate == endTimeDate) {
    errorMessages[3].style.display = "flex";
    errorMessages[3].textContent = "Can't be equal to start time!";
    return true;
  }

  return false;
}

function isEmpty(
  addEventForm: HTMLElement,
  errorMessages: HTMLCollectionOf<HTMLElement>
) {
  let j = 0;
  for (let i = 0; i < 4; i++) {
    const field = addEventForm?.children[i].children[1]
      .children[0] as HTMLInputElement;
    if (!isEmptyField(field.value)) {
      errorMessages[i].style.display = "none";
    } else {
      errorMessages[i].style.display = "flex";
      errorMessages[i].textContent = "This field is required";
      j++;
    }
  }

  if (j > 0) {
    return true;
  }

  return false;
}

function isEmptyField(valueField: string) {
  if (valueField == "") {
    return true;
  }

  return false;
}

async function getData() {
  const username = localStorage.getItem("user") ?? "";
  if (username == "") return;
  const parsedUsername = JSON.parse(username);
  await fetch(`https://scheduler-21.herokuapp.com/user/${parsedUsername}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt") ?? "")}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then((data) => (loggedUser = data))
    .catch((err) => {
      localStorage.clear();
      window.location.replace(
        "https://maxerling.github.io/_scheduler_frontend/"
      );
      alert("someting went wrong, try agin!");
      console.log(err);
    });
}

function onClickTimeAddEvent() {
  const timeTable = document.getElementsByClassName("td-time");
  const modalEle = document.getElementsByClassName("modal")[1];
  const closeButton = document.getElementsByClassName("delete");
  let startTimeInput: HTMLInputElement = document.getElementById(
    "start-time"
  ) as HTMLInputElement;

  for (let i = 0; i < timeTable.length; i++) {
    timeTable[i].addEventListener("click", () => {
      startTimeInput.value = timeTable[i].textContent ?? "";
      modalEle.classList.add("is-active");
    });
  }
  closeButton[1].addEventListener("click", () =>
    modalEle.classList.remove("is-active")
  );
}

async function createEventElements(): Promise<void> {
  loggedUser.bookedAppointments.map((event: Event): void => {
    const weekdayParentEle = document.getElementById("weekdays-name");
    const monthAndYearEle = document.getElementById("cal-month");
    let splittedEventDate: string[] = event.date.split("-");
    let splittedMonthAndYear: string[] =
      monthAndYearEle?.textContent?.split(" ") ?? [];
    let eventDateWeekend = `${splittedEventDate[2]}/${splittedEventDate[1]}`;

    if (
      getMonthFromNumberToString(Number(splittedEventDate[1])) ===
        splittedMonthAndYear[0] &&
      splittedEventDate[0] === splittedMonthAndYear[1]
    ) {
      for (let i = 0; i < 7; i++) {
        if (
          weekdayParentEle!.children[i + 1].textContent?.includes(
            eventDateWeekend
          )
        ) {
          const eventCollectionEle = document.getElementById(`day-${i + 1}`);
          const eventEle = document.createElement("div");
          eventEle.classList.add("event");

          eventEle.style.backgroundColor = "#000";
          eventEle.style.height = "50.198px";
          const name = event.name;
          //const description = event.description;
          const startTime = event.startTime;
          const endTime = event.endTime;
          const nameEle = document.createElement("p");
          const timeEle = document.createElement("h6");
          timeEle.textContent = `${startTime}-${endTime}`;
          nameEle.textContent = `${name}`;
          const [topValue, heightValue] = timePosition(startTime, endTime);
          eventEle.style.top = `${topValue}px`;
          eventEle.style.height = `${heightValue}px`;

          eventEle.append(nameEle);
          eventEle.append(timeEle);

          eventCollectionEle?.append(eventEle);
          onClickEvent(event, eventEle);
        }
      }
    }
  });
}

function onClickEvent(event: Event, eventEle: HTMLDivElement) {
  const modalEle = document.getElementsByClassName("modal")[0];
  const modalCardHeadEle =
    document.getElementsByClassName("modal-card")[0].children[0];
  const modalCardBodyEle =
    document.getElementsByClassName("modal-card")[0].children[1];

  eventEle.addEventListener("click", () => {
    modalCardHeadEle.children[0].textContent = event.name;
    modalCardBodyEle.children[0].firstChild!.textContent = `${event.startTime}-${event.endTime}`;
    modalCardBodyEle.children[0].lastChild!.textContent = `${event.date}`;
    modalCardBodyEle.children[1].textContent = `${event.description}`;

    modalEle.classList.add("is-active");
  });
  modalCardHeadEle.children[1].addEventListener("click", () =>
    modalEle.classList.remove("is-active")
  );
}

function welcomeMessage(loggedUser: User): void {
  let welcomeMessage = document.getElementById("welcome-message");
  welcomeMessage!.textContent = `Welcome ${loggedUser.firstName}` ?? "";
}

function timePosition(startTime: string, endTime: string): number[] {
  const [endTimeHours, endTimeMinutes] = endTime.split(":");
  const [startTimeHours, startTimeMinutes] = startTime.split(":");
  let startAndEndAttr: number[] = [];
  const topValue = 151 + (Number(startTimeHours) - 4) * 50;
  startAndEndAttr.push(topValue);
  const diffHoursIntoMinutes =
    (Number(endTimeHours) - Number(startTimeHours)) * 60;
  const eventValue =
    (diffHoursIntoMinutes * 50) / 60 + (Number(endTimeMinutes) * 52) / 60;
  startAndEndAttr.push(eventValue);
  return startAndEndAttr;
}

function checkCurrentWeek(): void {
  while (!todaysDateHighlight()) {
    moveWeek(7);
  }
}

function moveWeek(weekAmount: number): void {
  const eventParent = document.getElementById("event-scheduler");

  for (let i = 1; i < 8; i++) {
    eventParent!.children[i].textContent = "";
    eventParent!.children[i].classList.remove("selected");
  }
  const weekdayParentEle = document.getElementById("weekdays-name");
  const monthAndYearEle = document.getElementById("cal-month");
  const monthAndYearArray: string[] =
    monthAndYearEle?.textContent?.split(" ") ?? [];
  const [dayString, date]: string[] =
    weekdayParentEle?.children[1]?.textContent?.split(" ") ?? [];

  const weekday: number = Number(date.substring(0, 2));
  const month: number = Number(date.substring(3));

  const randDate: Date = new Date(
    `${getMonthFromNumberToString(month)} ${weekday}, ${monthAndYearArray[1]}`
  );
  let randDatePlusOne: Date = new Date(randDate);
  randDatePlusOne.setDate(randDatePlusOne.getDate() + weekAmount);

  const randDateFArray: string[] = randDatePlusOne.toString().split(" ");

  randDateFArray[1] = randDatePlusOne.toLocaleString("en-US", {
    month: "long",
  });
  const isSingleDigitMonthPlusOne =
    randDatePlusOne.getMonth() + 1 < 10
      ? `0${randDatePlusOne.getMonth() + 1}`
      : `${randDatePlusOne.getMonth() + 1}`;
  weekdayParentEle!.children[1].textContent = `${randDateFArray[0].toUpperCase()} ${
    randDateFArray[2]
  }/${isSingleDigitMonthPlusOne}`;

  monthAndYearEle!.textContent! = `${randDateFArray[1]} ${randDateFArray[3]}`;

  for (let i = 1; i < 7; i++) {
    randDatePlusOne.setDate(randDatePlusOne.getDate() + 1);
    const dateOWFPlusOneArray: string[] = randDatePlusOne.toString().split(" ");
    weekdayParentEle!.children[
      i + 1
    ].textContent = `${dateOWFPlusOneArray[0].toUpperCase()} ${
      dateOWFPlusOneArray[2]
    }/${isSingleDigitMonthPlusOne}`;
  }

  createEventElements();

  //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}
function getMonthFromNumberToString(month: number): string {
  if (month === 1) {
    return "January";
  } else if (month === 2) {
    return "February";
  } else if (month === 3) {
    return "March";
  } else if (month === 4) {
    return "April";
  } else if (month === 5) {
    return "May";
  } else if (month === 6) {
    return "June";
  } else if (month === 7) {
    return "July";
  } else if (month === 8) {
    return "August";
  } else if (month === 9) {
    return "September";
  } else if (month === 10) {
    return "October";
  } else if (month === 11) {
    return "November";
  } else if (month === 12) {
    return "December";
  }

  return "";
}

function convertMonthFromStringToNumber(monthInString: string): number {
  if (monthInString === "Jan") {
    return 1;
  } else if (monthInString === "Feb") {
    return 2;
  } else if (monthInString === "Mar") {
    return 3;
  } else if (monthInString === "Apr") {
    return 4;
  } else if (monthInString === "May") {
    return 5;
  } else if (monthInString === "Jun") {
    return 6;
  } else if (monthInString === "Jul") {
    return 7;
  } else if (monthInString === "Aug") {
    return 8;
  } else if (monthInString === "Sep") {
    return 9;
  } else if (monthInString === "Oct") {
    return 10;
  } else if (monthInString === "Nov") {
    return 11;
  } else if (monthInString === "Dec") {
    return 12;
  }

  return 0;
}

function setupCalenderButtons() {
  const nextButton = document.getElementById("cal-next")!;
  const prevButton = document.getElementById("cal-prev")!;
  calenderButton(nextButton, 7);
  calenderButton(prevButton, -7);
}

function calenderButton(button: HTMLElement, weekAmount: number): void {
  button?.addEventListener("click", () => {
    moveWeek(weekAmount);
    todaysDateHighlight();
  });
}

function todaysDateHighlight(): boolean {
  const today: Date = new Date();

  const splittedString: string[] = today.toString().split(" ");

  let eleNum: number;
  if ((eleNum = checkDay(splittedString[0] + " " + splittedString[2])) != -1) {
    const todaysDateEle = document.getElementById(`day-0${eleNum}`);
    const fromCorrectDayDateGetMonth = Number(
      todaysDateEle?.innerHTML.split("/")[1]
    );
    if (
      fromCorrectDayDateGetMonth ===
      convertMonthFromStringToNumber(splittedString[1])
    ) {
      const todayEle = document.getElementById(`day-${eleNum}`);
      todayEle?.classList.add("selected");
      return true;
    }
  }
  return false;
}

function checkDay(currentDay: string): number {
  const currentWeek: string[] =
    document
      ?.querySelector(".cal-head")
      ?.childNodes[1]?.textContent?.split(`\n`) ?? [];
  for (let i: number = 0; i < currentWeek.length; i++) {
    if (currentWeek[i].includes(`${currentDay.toUpperCase()}`)) {
      return i - 1;
    }
  }

  return -1;
}
export = {};
