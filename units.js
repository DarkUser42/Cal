let buttonUnitState = 0;
let UnitModeToggle = "NULL";
let UnitIndicator = "NULL";
let UnitModeText = "NULL";

document.addEventListener("DOMContentLoaded", function () {
  UnitModeToggle = document.getElementById("unit-toggle-mode");
  UnitIndicator = document.getElementById("UnitIndicator");
  UnitModeText = document.getElementById("UnitModeText");

  // Calculate Mode
  UnitModeToggle.addEventListener("click", function () {
    buttonUnitState = 1 - buttonUnitState;
    buttonUnitStateStyle();
    updateUnitDivs();
  });

  document.getElementById("prevUnitButton").onclick = () => {
    if (buttonUnitState === 1) {
      updateUnitText(-1);
    }
  };
  document.getElementById("nextUnitButton").onclick = () => {
    if (buttonUnitState === 1) {
      updateUnitText(1);
    }
  };

  //searchbar
  document.getElementById("inputUnit").addEventListener("focus", function () {
    this.parentElement.classList.add("focus");
  });

  document.getElementById("inputUnit").addEventListener("blur", function () {
    this.parentElement.classList.remove("focus");
  });

  //Input focus
  document.getElementById("unit-searchbar").addEventListener("click", () => {
    document.getElementById("inputUnit").focus();
  });

  // Selected
  const updateButtons = () => {
    document.querySelectorAll(".unitTemplate").forEach((button) => {
      button.onclick = () => {
        document
          .querySelectorAll(".unitTemplate")
          .forEach((b) => b.classList.remove("unitSelected"));
        button.classList.add("unitSelected");
      };
    });
  };

  new MutationObserver(updateButtons).observe(document.body, {
    childList: true,
    subtree: true,
  });
  updateButtons();

  //select input fields
  const units = document.querySelectorAll(".unitContent");
  const m9Box = document.getElementById("m9-box");

  function deselectAll() {
    units.forEach((unit) => {
      unit.classList.remove("selected");
    });
  }

  units.forEach((unit) => {
    unit.addEventListener("click", () => {
      deselectAll();
      unit.classList.add("selected");
    });
  });

  m9Box.addEventListener("click", (event) => {
    if (!event.target.classList.contains("unitContent")) {
      deselectAll();
    }
  });
});
// end DOM

// buttonUnitState Style Function

function buttonUnitStateStyle() {
  const buttons = document.querySelectorAll(".pnUnitButton");
  if (buttonUnitState === 1) {
    UnitModeToggle.innerHTML = "Calculate";
    applyStylesToSelector(UnitIndicator, {
      backgroundColor: "var(--Blue-Color)",
    });
    applyStylesToSelector(UnitModeText, { color: "var(--White)" });
    buttons.forEach((button) => {
      button.classList.add("c");
      button.classList.add("hover");
    });
    applyStylesToSelector(".pnUnitButton", {
      backgroundColor: "var(--Dark-Color)",
    });
    document.querySelectorAll(".pnUnitButton > *").forEach((childElement) => {
      childElement.classList.remove("pnUnitButtonSVG");
    });
  } else {
    UnitModeToggle.innerHTML = "Convert";
    applyStylesToSelector(UnitIndicator, {
      backgroundColor: "var(--Middle-Color)",
    });
    applyStylesToSelector(UnitModeText, { color: "var(--Middle-Color)" });
    buttons.forEach((button) => {
      button.classList.remove("c");
      button.classList.remove("hover");
    });
    applyStylesToSelector(".pnUnitButton", {
      backgroundColor: "var(--Deactivate-Color)",
    });
    document.querySelectorAll(".pnUnitButton > *").forEach((childElement) => {
      childElement.classList.add("pnUnitButtonSVG");
    });
  }
}

// Unit Modes
const modes = ["Add", "Subtract", "Multiply", "Divide"];
const modeDivIds = ["unit-plus", "unit-minus", "unit-multi", "unit-divide"];
let UnitMode = 0;

function resetUnitText() {
  const buttons = document.querySelectorAll(".pnUnitButton");
  UnitModeText.innerHTML = "Add";
  UnitMode = 0;
  document.getElementById("unit-toggle-mode").innerHTML = "Convert";
  buttonUnitState = 0;
  applyStylesToSelector(UnitIndicator, {
    backgroundColor: "var(--Middle-Color)",
  });
  applyStylesToSelector(UnitModeText, { color: "var(--Middle-Color)" });
  buttons.forEach((button) => {
    button.classList.remove("c");
    button.classList.remove("hover");
  });
  applyStylesToSelector(".pnUnitButton", {
    backgroundColor: "var(--Deactivate-Color)",
  });
  document.querySelectorAll(".pnUnitButton > *").forEach((childElement) => {
    childElement.classList.add("pnUnitButtonSVG");
  });

  hideAllUnitDivs();
}

function updateUnitText(direction) {
  UnitMode = (UnitMode + direction + modes.length) % modes.length;
  UnitModeText.innerHTML = modes[UnitMode];
  updateUnitDivs();
}

function updateUnitDivs() {
  if (buttonUnitState === 0) {
    hideAllUnitDivs();
  } else {
    document.getElementById("unit-convert").style.display = "none";
    modeDivIds.forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = index === UnitMode ? "flex" : "none";
      }
    });
  }
}

function hideAllUnitDivs() {
  modeDivIds.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById("unit-convert").style.display = "block";
}

function SvgPlopAnimation() {
  const element = document.getElementById("unit-convert");
  element.style.display = "none";

  setTimeout(() => {
    element.style.display = "";
  }, 0);
}

// Unit search

function filterUnits() {
  const searchBar = document.getElementById("inputUnit");
  const filter = searchBar.value.toLowerCase();

  document.getElementById("unit-selection").scrollTop = 0;

  const units = document.querySelectorAll(".unitTemplate");

  units.forEach((unit) => {
    const unitType = unit
      .querySelector(".unitSelectionType")
      .innerHTML.toLowerCase();

    if ((filter === "" || unitType.includes(filter)) && unitType) {
      unit.style.display = "flex";
    } else {
      unit.style.display = "none";
    }
  });
}

// Units selection

window.addEventListener("load", () => {
  if (false) {
    localStorage.clear();
  }
});

function updateUnitList(unitMode) {
  document.getElementById("inputUnit").value = "";
  loadAndProcessCSV(unitMode);
}

async function loadAndProcessCSV(unitMode) {
  const localStorageKey = "cachedCSVData";
  let csvData = localStorage.getItem(localStorageKey);

  if (!csvData) {
    const csvFilePath = "cal_units.csv";
    try {
      const response = await fetch(csvFilePath);
      if (!response.ok) {
        throw new Error("Failed to fetch CSV file");
      }
      csvData = await response.text();
      localStorage.setItem(localStorageKey, csvData);
    } catch (error) {
      console.error("Error loading CSV file:", error);

      showCSVUploadContainer(unitMode);
      return;
    }
  }

  hideCSVUploadContainer();
  processCSVData(csvData, unitMode);
}

function showCSVUploadContainer(unitMode) {
  const container = document.getElementById("csv-upload-container");
  container.classList.remove("hiddenUnitUpload");

  const uploadButton = document.getElementById("csv-upload-button");
  uploadButton.addEventListener("click", async () => {
    const csvData = await promptUserForCSV();
    if (csvData) {
      localStorage.setItem("cachedCSVData", csvData);
      hideCSVUploadContainer();
      processCSVData(csvData, unitMode);
    }
  });
}

function hideCSVUploadContainer() {
  const container = document.getElementById("csv-upload-container");
  container.classList.add("hiddenUnitUpload");
}

function promptUserForCSV() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    });

    input.click();
  });
}

function processCSVData(csvData, unitMode) {
  const units = csvData
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      return { identifier: parseInt(parts[0]), unit: parts[2] };
    })
    .filter((unit) => unit.identifier === parseInt(unitMode));

  updateUnitSelection(units);
}

function updateUnitSelection(units) {
  const container = document.getElementById("unit-selection");
  const template = container.querySelector(".unitTemplate");
  const uploadContainer = document.getElementById("csv-upload-container");

  Array.from(container.children).forEach((child) => {
    if (child !== template && child !== uploadContainer) {
      container.removeChild(child);
    }
  });

  container.scrollTop = 0;

  if (template) {
    template.style.display = "none";
  }

  units.forEach((unit) => {
    const clone = template.cloneNode(true);
    clone.style.display = "flex";
    const unitTypeDiv = clone.querySelector(".unitSelectionType");
    if (unitTypeDiv) {
      unitTypeDiv.innerHTML = unit.unit;
    }
    container.appendChild(clone);
  });
}

//

function markUnitInput() {
  const inputField = document.getElementById("inputUnit");
  if (inputField.value.trim() !== "") {
    inputField.select();
  }
}

// Button Height

function setHeight2() {
  const height = window.getComputedStyle(
    document.getElementById("unit-toggle-mode")
  ).height;
  document.documentElement.style.setProperty("--udiv1-height", height);
}

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    setHeight2();
  }
});

//

//------------ temp ?
async function loadAndProcessCSVTest(quantity, fromUnit, toUnit) {
  try {
    const csvFilePath = "cal_units.csv";
    const response = await fetch(csvFilePath);
    if (!response.ok) {
      return;
    }
    const csvData = await response.text();
    processData(csvData, quantity, fromUnit, toUnit);
  } catch (error) {
    return;
  }
}

function processData(csvData, quantity, fromUnit, toUnit) {
  const lines = csvData.split("\n").slice(1);
  const units = lines
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      return { unit: parts[2], factor: parseFloat(parts[3]) };
    });

  convertUnit(quantity, fromUnit, toUnit, units);
}

function convertUnit(quantity, fromUnit, toUnit, units) {
  const from = units.find((u) => u.unit === fromUnit);
  const to = units.find((u) => u.unit === toUnit);

  if (!from || !to) {
    console.error("Unit not found");
    return;
  }

  let result = quantity * (from.factor / to.factor);

  console.log(`${quantity} ${fromUnit} equals ${result} ${toUnit}`);
}

loadAndProcessCSVTest(111111111111, "Bit", "Terabyte");
//-----------------
