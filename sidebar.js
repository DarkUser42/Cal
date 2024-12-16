document.addEventListener("DOMContentLoaded", function () {
  let sidestate = 0;

  const navClipButton = document.getElementById("nav-clip");
  const navHisButton = document.getElementById("nav-his");

  navClipButton.addEventListener("click", () => {
    sidestate = 1;
    updateNav(sidestate);
  });

  navHisButton.addEventListener("click", () => {
    sidestate = 0;
    updateNav(sidestate);
  });

  function updateNav(state) {
    if (state === 1) {
      document.getElementById("nav-indicator").classList.add("history");
      document.getElementById("nav-his-content").style.display = "none";
      document.getElementById("nav-clip-content").style.display = "block";
    } else {
      document.getElementById("nav-indicator").classList.remove("history");
      document.getElementById("nav-his-content").style.display = "block";
      document.getElementById("nav-clip-content").style.display = "none";
    }
  }

  // custom context menu

  const customMenu = document.getElementById("custom-menu");
  const customContextElements = document.querySelectorAll(
    ".custom-context-menu"
  );

  customContextElements.forEach((element) => {
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      showContextMenu(event.pageX, event.pageY);
    });
  });

  function showContextMenu(x, y) {
    customMenu.style.display = "block";

    const menuWidth = 124;
    const viewportWidth = window.innerWidth;
    const maxLeft = Math.min(x, viewportWidth - menuWidth - 15);
    customMenu.style.left = `${maxLeft}px`;

    const menuHeight = 130;
    const viewportHeight = window.innerHeight;
    const maxTop = Math.min(y, viewportHeight - menuHeight - 15);
    customMenu.style.top = `${maxTop}px`;
  }

  document.addEventListener("click", () => {
    customMenu.style.display = "none";
  });

  document.addEventListener("contextmenu", (event) => {
    if (![...customContextElements].includes(event.target)) {
      customMenu.style.display = "none";
    }
  });

  customMenu.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      customMenu.style.display = "none";
    });
  });

  window.addEventListener("resize", () => {
    customMenu.style.display = "none";
  });

  const navContainer = document.getElementById("nav-content");
  if (navContainer.scrollHeight > navContainer.clientHeight) {
    navContainer.classList.add("vertical-scroll");
  } else {
    navContainer.classList.remove("vertical-scroll");
  }
});
