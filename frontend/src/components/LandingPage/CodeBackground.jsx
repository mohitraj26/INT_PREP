import { useEffect, useState } from "react"
import "./CodeBackground.css"

// Code snippets that will appear in the animation
const codeSnippets = [
  "function binarySearch(arr, target) {",
  "  let left = 0;",
  "  let right = arr.length - 1;",
  "  while (left <= right) {",
  "    const mid = Math.floor((left + right) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) left = mid + 1;",
  "    else right = mid - 1;",
  "  }",
  "  return -1;",
  "}",
  "class TreeNode {",
  "  constructor(val) {",
  "    this.val = val;",
  "    this.left = null;",
  "    this.right = null;",
  "  }",
  "}",
  "function quickSort(arr, left = 0, right = arr.length - 1) {",
  "  if (left < right) {",
  "    const pivotIndex = partition(arr, left, right);",
  "    quickSort(arr, left, pivotIndex - 1);",
  "    quickSort(arr, pivotIndex + 1, right);",
  "  }",
  "  return arr;",
  "}",
  "const memoize = (fn) => {",
  "  const cache = {};",
  "  return (...args) => {",
  "    const key = JSON.stringify(args);",
  "    if (key in cache) return cache[key];",
  "    const result = fn(...args);",
  "    cache[key] = result;",
  "    return result;",
  "  };",
  "};",
  "function mergeSort(arr) {",
  "  if (arr.length <= 1) return arr;",
  "  const mid = Math.floor(arr.length / 2);",
  "  const left = mergeSort(arr.slice(0, mid));",
  "  const right = mergeSort(arr.slice(mid));",
  "  return merge(left, right);",
  "}",
  "async function fetchData(url) {",
  "  try {",
  "    const response = await fetch(url);",
  "    const data = await response.json();",
  "    return data;",
  "  } catch (error) {",
  "    console.error('Error:', error);",
  "  }",
  "}",
  "const debounce = (fn, delay) => {",
  "  let timeoutId;",
  "  return (...args) => {",
  "    clearTimeout(timeoutId);",
  "    timeoutId = setTimeout(() => fn(...args), delay);",
  "  };",
  "};",
]

// Symbols that will appear in the animation
const symbols = [
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "=>",
  "===",
  "!==",
  "++",
  "--",
  "&&",
  "||",
  "+=",
  "-=",
  "*=",
  "/=",
  "?",
  ":",
  ";",
]

const CodeBackground = () => {
  const [codeElements, setCodeElements] = useState([])

  useEffect(() => {
    // Generate initial code elements
    generateCodeElements()

    // Regenerate code elements periodically
    const interval = setInterval(() => {
      generateCodeElements()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const generateCodeElements = () => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const newElements = []

    // Generate between 15-25 elements depending on screen size
    const count = Math.floor(Math.random() * 10) + 15

    for (let i = 0; i < count; i++) {
      // Decide if this will be a code snippet or symbol
      const isSnippet = Math.random() > 0.4

      // Get random content
      const content = isSnippet
        ? codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        : symbols[Math.floor(Math.random() * symbols.length)]

      // Random position
      const x = Math.random() * windowWidth
      const y = Math.random() * windowHeight

      // Random size
      const size = isSnippet ? Math.random() * 0.4 + 0.8 : Math.random() * 1 + 1.5

      // Random opacity
      const opacity = Math.random() * 0.15 + 0.05

      // Random animation duration
      const duration = Math.random() * 10 + 10

      // Random delay
      const delay = Math.random() * 5

      newElements.push({
        id: `code-${Date.now()}-${i}`,
        content,
        style: {
          left: `${x}px`,
          top: `${y}px`,
          fontSize: `${size}rem`,
          opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
      })
    }

    setCodeElements(newElements)
  }

  return (
    <div className="code-background">
      {codeElements.map((element) => (
        <div key={element.id} className="code-element" style={element.style}>
          {element.content}
        </div>
      ))}
    </div>
  )
}

export default CodeBackground
