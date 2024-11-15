document.addEventListener("DOMContentLoaded", function () {
  const xpathInput = document.getElementById("xpathInput");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  // Load saved XPath expressions
  chrome.storage.local.get(["xpathExpressions"], function (result) {
    if (result.xpathExpressions) {
      xpathInput.value = result.xpathExpressions.join("\n");
    }
  });

  // Save XPath expressions when modified
  xpathInput.addEventListener("change", function () {
    const expressions = xpathInput.value
      .split("\n")
      .filter((expr) => expr.trim());
    chrome.storage.local.set({ xpathExpressions: expressions });
  });

  // Navigation buttons
  prevButton.addEventListener("click", function () {
    const expressions = xpathInput.value
      .split("\n")
      .filter((expr) => expr.trim());
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "navigate",
        direction: "prev",
        xpaths: expressions,
      });
    });
  });

  nextButton.addEventListener("click", function () {
    const expressions = xpathInput.value
      .split("\n")
      .filter((expr) => expr.trim());
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "navigate",
        direction: "next",
        xpaths: expressions,
      });
    });
  });
});
