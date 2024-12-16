let display;

document.addEventListener("DOMContentLoaded", function () {
  display = document.getElementById("calDisplay");
});

const OPERATORS = ["+", "-", "*", "/", "mod"];
const SPECIALOPERATORS = ["√", "√(", "round", "round("];
const SPECIALNUMBERS = ["π", "e"];

const colors = ["#FF5252", "#FFAB40", "#00E676", "#448AFF", "#E040FB"];
let colorIndex = 0;
let stack = [];

let ANS = "";

// Key functions
function handleEngineInput(input) {
  let lastBlock = getLastBlock();

  if (isNumber(input)) {
    console.log("handleNumberInput");
    handleNumberInput(input, lastBlock);
  } else if (isSpecialNumber(input)) {
    console.log("handleSpecialNumberInput");
    handleSpecialNumberInput(input, lastBlock);
  } else if (isOperator(input)) {
    console.log("handleOperatorInput");
    handleOperatorInput(input, lastBlock);
  } else if (isSpecialOperator(input)) {
    console.log("handleSpecialOperatorInput");
    handleSpecialOperatorInput(input, lastBlock);
  } else if (input === "(" || input === ")") {
    console.log("handleBracketInput");
    handleBracketInput(input, lastBlock);
  }
}

function deleteLastBlock() {
  let lastBlock = getLastBlock();
  let lastBlockDiv = getLastBlock(1);

  if (!lastBlockDiv) return;

  if (isNumber(lastBlock) && lastBlock.length > 1) {
    lastBlockDiv.textContent = lastBlockDiv.textContent.slice(0, -1);

    let currentClass = Array.from(lastBlockDiv.classList).find((cls) =>
      cls.startsWith("block§")
    );
    if (currentClass) {
      let newClass = currentClass.slice(0, -1);
      lastBlockDiv.className = lastBlockDiv.className.replace(currentClass, newClass);
    }
  } else {
    display.removeChild(lastBlockDiv);
  }
}

function clearDisplay() {
  display.innerHTML = "";
  colorIndex = 0;
}

function ans() {
  console.log(ANS);
  if (!ANS == "") {
    let lastBlock = getLastBlock();
    handleNumberInput(ANS, lastBlock);
  }
}

function calDisplay() {
  let expression = "";

  // Durchlaufe alle Kinder des Displays
  display.childNodes.forEach((block) => {
    if (block.classList) {
      // Sicherstellen, dass classList existiert
      // Hole den Inhalt der Klasse, die mit "block§" beginnt
      const className = Array.from(block.classList).find((cls) =>
        cls.startsWith("block§")
      );

      // Extrahiere den Wert aus der Klasse, falls vorhanden
      const blockValue = className
        ? className.replace("block§", "")
        : block.textContent;

      // Baue den Ausdruck zusammen
      expression += blockValue;
    }
  });

  expression = formatBrackets(expression);

  // Logge den Ausdruck zur Überprüfung
  console.log("Expression:", expression);

  try {
    // Ersetze Operatoren und berechne das Ergebnis
    let result = eval(
      expression.replace(/mod/g, "%").replace(/√/g, "Math.sqrt")
    );

    // Logge das Ergebnis zur Überprüfung
    console.log("Result:", result);

    // Optional: Clear Display und füge das Ergebnis als Block hinzu
    clearDisplay();
    addBlock(result);
    ANS = result;
  } catch (error) {
    console.error("Error evaluating expression:", error);
  }
}

//
function getLastBlock(type = 0) {
  let lastBlock = display.lastChild;

  if (type === 0) {
    if (lastBlock && lastBlock.textContent.trim() !== "") {
      const className = Array.from(lastBlock.classList).find((cls) =>
        cls.startsWith("block§")
      );

      if (className) {
        lastBlock = className.replace("block§", "");
      } else {
        lastBlock = null;
      }
    } else {
      lastBlock = null;
    }
  }

  return lastBlock;
}

function formatBrackets(expression) {
  let openBrackets = 0;
  let formattedExpression = "";
  let removedBrackets = false;

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];

    if (char === "(") {
      openBrackets++;
    } else if (char === ")") {
      if (openBrackets > 0) {
        openBrackets--;
      } else {
        removedBrackets = true;
        continue;
      }
    }

    formattedExpression += char;
  }

  for (let i = 0; i < openBrackets; i++) {
    formattedExpression += ")";
  }

  if (removedBrackets) {
    alert("Please check your parentheses placement for correct calculation!");
  }

  return formattedExpression;
}

function handleNumberInput(input, lastBlock) {
  let lastBlockDiv = getLastBlock(1);

  if (lastBlock && isNumber(lastBlock)) {
    if (input === "." && lastBlock === "" && !lastBlock.includes(".")) {
      lastBlockDiv.textContent = "0.";
      lastBlockDiv.classList.add("block§0.");
    } else {
      if (!(input === "." && lastBlock.includes("."))) {
        lastBlockDiv.textContent += input;
        lastBlockDiv.className = lastBlockDiv.className.replace(
          /block§.*/,
          "block§" + lastBlockDiv.textContent
        );
      }
    }
  } else if (!isSpecialNumber(lastBlock)) {
    if (input === ".") {
      addBlock("0.");
    } else {
      addBlock(input);
    }
  }
}

function handleSpecialNumberInput(input, lastBlock) {
  console.log(lastBlock);
  if (lastBlock == null) {
    console.error("x");
  }

  if (isSpecialNumber(lastBlock) || isNumber(lastBlock)) {
    addBlock("*");
    addBlock(input);
  } else {
    addBlock(input);
  }
}

function handleOperatorInput(input, lastBlock) {
  console.log(lastBlock);
  if (lastBlock) {
    if (
      isNumber(lastBlock, "number") ||
      isSpecialNumber(lastBlock) ||
      lastBlock === ")" ||
      lastBlock === ""
    ) {
      addBlock(input);
    }
  }
}

function handleSpecialOperatorInput(input, lastBlock) {
  if (!lastBlock || (lastBlock && isOperator(lastBlock))) {
    console.log(lastBlock);
    if (input === "√") {
      addBlock("√", "√(");
    } else if (input === "round") {
      addBlock("round", "round(");
    }
  }
}

function handleBracketInput(input, lastBlock) {
  if (input === "(") {
    if (!lastBlock || isOperator(lastBlock) || lastBlock === "(") {
      addBlock(input);
    }
  } else if (input === ")") {
    let previousBlock = display.childNodes[display.childNodes.length - 2];
    if (
      lastBlock === ")" ||
      (isNumber(lastBlock) &&
        previousBlock &&
        (isOperator(previousBlock.textContent) ||
          isSpecialOperator(previousBlock.textContent)))
    ) {
      addBlock(input);
    }
  }
}

function addBlock(content, styling = 0) {
  let block = document.createElement("div");
  block.className = "calBlock";
  block.classList.add("block§" + content);

  if (styling !== 0) {
    block.textContent = styling;
  } else {
    block.textContent = content;
  }

  if (content === "(") {
    // Öffnende Klammer
    let color = colors[colorIndex % colors.length];
    stack.push({ block: block, color: color });
    block.style.color = color;
    colorIndex++;
  } else if (content === ")") {
    // Schließende Klammer
    if (stack.length > 0) {
      let openBracket = stack.pop();
      block.style.color = openBracket.color;
    }
  }

  display.appendChild(block);

  // Keine Notwendigkeit für updateBracketColors hier
}

function isNumber(value, type) {
  if (value == null) {
    return false;
  }

  const lastChar = value[value.length - 1];

  if (type === "number") {
    return /^[0-9]+$/.test(lastChar);
  } else {
    return /^[0-9.]+$/.test(lastChar);
  }
}

function isOperator(value) {
  return OPERATORS.includes(value);
}

function isSpecialOperator(value) {
  return SPECIALOPERATORS.includes(value);
}

function isSpecialNumber(value) {
  return SPECIALNUMBERS.includes(value);
}
