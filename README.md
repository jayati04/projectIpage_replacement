# 🧠 Page Replacement Visualizer — FIFO · LRU · Optimal

## 📖 Overview
This project is an **interactive visualization tool** that demonstrates how **page replacement algorithms** work in an operating system’s virtual memory management system.

It visually simulates **FIFO**, **LRU**, and **Optimal** algorithms using colorful animations and a vertical memory layout.  
The simulation helps learners understand:
- How pages are loaded into frames
- When page faults (misses) occur
- How page hits are detected
- How different algorithms replace pages differently

---

## 🎯 Algorithms Included
| Algorithm | Description |
|------------|--------------|
| **FIFO (First In, First Out)** | Replaces the page that has been in memory the longest. |
| **LRU (Least Recently Used)** | Replaces the page that has not been used for the longest time. |
| **Optimal** | Replaces the page that will not be used for the longest time in the future. |

---

## 🎨 Key Features
- **Vertical Frame Layout** — Frames are stacked top-to-bottom for easy visualization.  
- **Color-coded Representation:**
  - 🟩 Green → Page Hit  
  - 🟥 Red → Page Miss / Fault  
  - 🟦 Blue → Empty Frame  
  - 🟨 Yellow → Current Reference  
- **Interactive Controls:**
  - ▶ Play  
  - ❚❚ Pause  
  - ➡ Step  
  - 🔁 Reset  
  - 📷 Export Snapshot  
- **Narration Box:** Explains every action step-by-step.
- **Live Counters:** Displays hits, misses, and total references dynamically.

---

## 📂 Project Structure
```
Page-Replacement-Visualizer/
│
├── index.html      → Main interface file
├── style.css       → Styling for the layout and animations
├── script.js       → Logic and visualization code
├── README.md       → Project overview
└── EXECUTION_GUIDE.md → Instructions for running and using the project
```

---

## 🧩 Educational Value
This visualizer is perfect for:
- OS Lab Assignments  
- College Presentations  
- Self-learning Memory Management  
- Demonstrating algorithms interactively

It turns theoretical page replacement algorithms into **easy-to-understand animations**.

---

## 🖌️ Color Reference
| Color | Meaning |
|--------|----------|
| 🟦 Blue | Empty Frame |
| 🟩 Green | Page Hit |
| 🟥 Red | Page Miss / Fault |
| 🟨 Yellow | Current Reference |

---

## 💡 Future Enhancements
- Animated sliding motion for replaced pages.  
- Side-by-side comparison of all algorithms.  
- Graph of page faults vs. frame count.  
- Export as a summary report.

---

## 👩‍💻 Author
**Name:** *Jayati Jain*  
**Topic:** *Operating Systems — Page Replacement Algorithms*  
**Technologies:** HTML, CSS, JavaScript  
**Algorithms Simulated:** FIFO · LRU · Optimal
