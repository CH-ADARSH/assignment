document.addEventListener("DOMContentLoaded", () => {
  const encodeTextArea = document.getElementById("encode-textarea");
  const encodeButton = document.getElementById("encode-Btn");
  const encodedResultDisplay = document.getElementById("encoded-result");
  const displayFooter = document.getElementById("display-footer");
  const decodeTextArea = document.getElementById("decode-textarea");
  const decodeButton = document.getElementById("decode-Btn");
  const decodedResultDisplay = document.getElementById("decoded-result");

  // Populate the vocabulary section on page load
  renderVocabulary(customAsciiValues);

  // Auto-clear function for encode section
  function clearEncodeResults() {
    encodedResultDisplay.textContent = "";
    displayFooter.innerHTML = "";
  }

  // Auto-clear function for decode section
  function clearDecodeResults() {
    decodedResultDisplay.textContent = "";
  }

  // Clear encode results when user starts typing in encode textarea
  encodeTextArea.addEventListener("input", clearEncodeResults);

  // Clear decode results when user starts typing in decode textarea
  decodeTextArea.addEventListener("input", clearDecodeResults);

  encodeButton.addEventListener("click", () => {
    const encodeValue = encodeTextArea.value;

    // Don't process if input is empty
    if (!encodeValue.trim()) {
      clearEncodeResults();
      return;
    }

    const tokens = customEncoder(encodeValue);
    encodedResultDisplay.textContent = tokens.join(", ");

    displayFooter.innerHTML = `
      <span>Tokens Count: ${tokens.length}</span>
      <span>Original Characters: ${encodeValue.length}</span>
      <button id="copy-btn">Copy</button>
      <button id="clear-encode-btn">Clear All</button>
    `;

    // Copy button functionality
    const copyButton = document.getElementById("copy-btn");
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(tokens.join(", "));
      copyButton.textContent = "Copied!";
      setTimeout(() => (copyButton.textContent = "Copy"), 2000);
    });

    // Clear all button functionality
    const clearButton = document.getElementById("clear-encode-btn");
    clearButton.addEventListener("click", () => {
      encodeTextArea.value = "";
      clearEncodeResults();
    });
  });

  decodeButton.addEventListener("click", () => {
    const decodeValueRaw = decodeTextArea.value;

    // Don't process if input is empty
    if (!decodeValueRaw.trim()) {
      clearDecodeResults();
      return;
    }

    const decoded = customDecoder(decodeValueRaw);
    decodedResultDisplay.textContent = decoded;

    // Optional: Add clear button for decode section too
    // You can add this to your HTML if needed
    const clearDecodeBtn = document.getElementById("clear-decode-btn");
    if (clearDecodeBtn) {
      clearDecodeBtn.addEventListener("click", () => {
        decodeTextArea.value = "";
        clearDecodeResults();
      });
    }
  });

  function renderVocabulary(vocab) {
    const listContainer = document.getElementById("vocab-scroll-container");

    listContainer.innerHTML = "";

    Object.entries(vocab)
      .sort((a, b) => a[1] - b[1])
      .forEach(([char, code]) => {
        const item = document.createElement("div");
        item.className = "vocab-item";

        const displayChar = char === " " ? "(space)" : char;
        item.innerHTML = `<span class="vocab-char">'${displayChar}'</span> <span class="vocab-code">-> ${code}</span>`;

        listContainer.appendChild(item);
      });
  }
});

const customAsciiValues = {};
customAsciiValues[" "] = 0; // space

// lowercase a..z => 1..26
"abcdefghijklmnopqrstuvwxyz".split("").forEach((ch, i) => {
  customAsciiValues[ch] = i + 1;
});

// uppercase A..Z => 27..52
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((ch, i) => {
  customAsciiValues[ch] = i + 27;
});

// digits 0..9 => 53..62
"0123456789".split("").forEach((ch, i) => {
  customAsciiValues[ch] = i + 53;
});

// specials => 63+
const specials = `!@#$%^&*()-_+=[]{}|\\;:'",.<>/?`;
specials.split("").forEach((ch, i) => {
  customAsciiValues[ch] = i + 63;
});

// encoder: text -> numbers[]
function customEncoder(encodeValue) {
  return encodeValue.split("").map((ch) => customAsciiValues[ch] ?? -1);
}

// reverse map: number -> char
const reverseValue = Object.fromEntries(
  Object.entries(customAsciiValues).map(([char, val]) => [String(val), char])
);

// helper: parse "8,5,12,12,15" or "[8,5,12,12,15]" -> [8,5,12,12,15]
function parseTokenInput(input) {
  let s = String(input).trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.map((n) => Number(n)) : [];
    } catch {}
  }
  if (s === "") return [];
  return s
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t));
}

// decoder: numbers[] or CSV string -> text
function customDecoder(decodeValue) {
  const nums = Array.isArray(decodeValue)
    ? decodeValue
    : parseTokenInput(decodeValue);
  return nums.map((num) => reverseValue[String(num)] ?? "?").join("");
}
