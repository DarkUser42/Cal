document.addEventListener("DOMContentLoaded", function () {
  // selected
  function updateContentDivs() {
    const contentDivs = document.querySelectorAll(".content");

    // Deactivate all content divs
    contentDivs.forEach((contentDiv) => {
      contentDiv.classList.add("deactivated");
    });

    // Check which button is selected and activate the corresponding content divs
    const selectedButton = document.querySelector(".selected");

    if (selectedButton) {
      switch (selectedButton.id) {
        case "sidebutton1":
          document.getElementById("m1-box").classList.remove("deactivated");
          document.getElementById("m2-box").classList.remove("deactivated");
          ["buttons1", "buttons2"].forEach((id) =>
            document.getElementById(id)?.classList.add("visible1")
          );
          ["buttons3", "buttons4"].forEach((id) =>
            document.getElementById(id)?.classList.remove("visible1")
          );
          break;
        case "sidebutton2":
          break;
        case "sidebutton3":
          document.getElementById("m5-box").classList.remove("deactivated");
          document.getElementById("m6-box").classList.remove("deactivated");
          break;
        case "sidebutton4":
          document.getElementById("m7-box").classList.remove("deactivated");
          document.getElementById("m8-box").classList.remove("deactivated");
          setHeight1();
          break;
        default:
          if (selectedButton.id.startsWith("sidebutton")) {
            const buttonNumber = parseInt(
              selectedButton.id.replace("sidebutton", ""),
              10
            );
            if (buttonNumber >= 5 && buttonNumber <= 14) {
              m9_10();
              setHeight2();
              SvgPlopAnimation();
              updateUnitList((buttonNumber - 4).toString());
            }
          }
          break;
      }
    }
  }

  // Selected
  const buttons = document.querySelectorAll(".sidebutton");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.classList.contains("selected")) {
        buttonReset(); // Standard
        sideLoad(); // Date
        resetM4(); // Date
        resetUnitText(); // Units
        deselectAllUnitFields(); // Units
        buttons.forEach((b) => {
          b.classList.remove("selected");
        });
        button.classList.add("selected");
        updateContentDivs();
      }
    });
  });

  // Button reset
  function buttonReset() {
    ["buttons1", "buttons2"].forEach((id) =>
      document.getElementById(id)?.classList.add("visible1")
    );
    ["buttons3", "buttons4"].forEach((id) =>
      document.getElementById(id)?.classList.remove("visible1")
    );
  }

  // Load functions on page call
  window.addEventListener("load", () => {
    updateContentDivs();
  });

  // Click
  const handleClick = (e) =>
    e.currentTarget.classList.toggle("click", e.type === "mousedown");
  const addListeners = (el) =>
    ["mousedown", "mouseup", "mouseleave"].forEach((evt) =>
      el.addEventListener(evt, handleClick)
    );

  document.querySelectorAll(".c").forEach(addListeners);

  new MutationObserver((mutations) =>
    mutations.forEach((m) =>
      m.addedNodes.forEach(
        (n) =>
          n.nodeType === Node.ELEMENT_NODE &&
          n.classList.contains("c") &&
          addListeners(n)
      )
    )
  ).observe(document.body, { childList: true, subtree: true });

  // Toggle 1
  const toggleButtons = document.querySelectorAll(".toggleButton1");
  const groups = document.querySelectorAll(".Button-group1");

  toggleButtons.forEach((toggleButton) => {
    toggleButton.addEventListener("click", () => {
      groups.forEach((group) => {
        group.classList.toggle("visible1");
      });
    });
  });

  // Dark / Light Mode

  const button = document.getElementById("DarkLightMode");
  const svg1 = document.getElementById("DLsvg1");
  const svg2 = document.getElementById("DLsvg2");

  let currentState = 0;

  function switchModeDL() {
    if (currentState === 0) {
      svg1.style.display = "block";
      svg2.style.display = "none";
      currentState = 1;
      toggleTheme("1");
    } else {
      svg1.style.display = "none";
      svg2.style.display = "block";
      currentState = 0;
      toggleTheme("0");
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.code === "F9") {
      switchModeDL();
    }
  });
  button.addEventListener("click", switchModeDL);

  //

  window.addEventListener("load", function () {
    setHeight1();
    setHeight2();
  });

  window.addEventListener("resize", function () {
    setHeight1();
    setHeight2();
  });
});

//

function toggleTheme(mode) {
  const rootElement = document.documentElement;

  if (mode === "0") {
    rootElement.removeAttribute("data-theme");
  } else if (mode === "1") {
    rootElement.setAttribute("data-theme", "light");
  }

  buttonUnitStateStyle();
}

function m9_10() {
  document.getElementById("m9-box").classList.remove("deactivated");
  document.getElementById("m10-box").classList.remove("deactivated");
}

function deselectAllUnitFields() {
  const units = document.querySelectorAll(".unitContent");
  units.forEach((unit) => {
    unit.classList.remove("selected");
  });
}

// Custom Functions

function applyStylesToSelector(selector, styles) {
  let elements;

  if (typeof selector === "string") {
    if (selector.startsWith("#") || selector.startsWith(".")) {
      elements = document.querySelectorAll(selector);
    }
  } else {
    elements = selector.length !== undefined ? selector : [selector];
  }

  elements.forEach((element) => {
    for (let property in styles) {
      if (styles.hasOwnProperty(property)) {
        element.style[property] = styles[property];
      }
    }
  });
}
