let currentIndex = -1;
let elements = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "navigate") {
    const xpaths = request.xpaths;

    // Only rebuild elements array if it's empty or xpaths changed
    if (elements.length === 0) {
      elements = [];
      xpaths.forEach((xpath) => {
        try {
          const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          if (result.singleNodeValue) {
            elements.push(result.singleNodeValue);
          }
        } catch (e) {
          console.error("Invalid XPath:", xpath);
        }
      });
    }

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
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // Optional: Add visual highlight
    elements.forEach((el) => el.style.removeProperty("outline"));
    element.style.outline = "2px solid red";
  }
});
