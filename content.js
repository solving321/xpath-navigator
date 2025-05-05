let currentIndex = -1;
let elements = [];

function isXPath(expression) {
  // Simple check to determine if a string is likely an XPath
  return expression.startsWith('/') ||
         expression.startsWith('./') ||
         expression.startsWith('//') ||
         expression.includes('::');
}

function getElementBySelector(selector) {
  if (isXPath(selector)) {
    try {
      const result = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      const elements = [];
      for (let i = 0; i < result.snapshotLength; i++) {
        elements.push(result.snapshotItem(i));
      }
      return elements;
    } catch (e) {
      console.error("Invalid XPath:", selector, e);
      return [];
    }
  } else {
    // Treat as CSS selector
    try {
      const matchedElements = Array.from(document.querySelectorAll(selector));
      return matchedElements;
    } catch (e) {
      console.error("Invalid CSS selector:", selector, e);
      return [];
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "navigate") {
    const selectors = request.xpaths; // Contains both XPath and CSS selectors

    // Rebuild elements array with all matching elements
    elements = [];
    selectors.forEach((selector) => {
      if (selector.trim()) {
        const foundElements = getElementBySelector(selector);
        elements = elements.concat(foundElements);
      }
    });

    if (elements.length === 0) {
      alert("No matching elements found");
      return;
    }

    if (request.direction === "next") {
      currentIndex = (currentIndex + 1) % elements.length;
    } else {
      currentIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    }

    const element = elements[currentIndex];

    // Scroll element into view and focus it without changing styling
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus();
  }
});
