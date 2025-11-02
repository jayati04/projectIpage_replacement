# ⚙️ Execution Guide — Page Replacement Visualizer

## 💻 System Requirements
- Any modern web browser (Google Chrome, Edge, Firefox)
- (Optional) Visual Studio Code with “Live Server” extension for easy execution

---

## 🚀 Running the Project

### Option 1 — Directly from Files
1. Download all the files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `EXECUTION_GUIDE.md`
2. Place them in a single folder named **Page-Replacement-Visualizer**.
3. Double-click **`index.html`** to open it in your browser.
4. The visualizer will load instantly — no extra setup required.

---

### Option 2 — Using Visual Studio Code (Recommended)
1. Open **VS Code** and load the folder containing your files.
2. Install the **Live Server** extension (if not already installed).
3. Right-click on **index.html** → Select **“Open with Live Server”**.
4. The simulation will run in your browser at:
   ```
   http://localhost:5500/
   ```

---

## ▶️ Using the Simulation

### Step 1 — Select Algorithm
Use the dropdown menu to choose from:
- **FIFO (First In First Out)**
- **LRU (Least Recently Used)**
- **Optimal**

### Step 2 — Set Number of Frames
Enter the number of frames in memory (default: 3).

### Step 3 — Input Reference String
Type a sequence of page references, such as:
```
7 0 1 2 0 3 0 4 2 3 0 3
```
or click **Load Sample A/B** for predefined examples.

### Step 4 — Run Controls
| Button | Action |
|---------|---------|
| ▶ Play | Start automatic animation |
| ❚❚ Pause | Temporarily stop simulation |
| ➡ Step | Advance one reference at a time |
| 🔁 Reset | Restart from the beginning |
| 📷 Export PNG | Save a snapshot of the current screen |

---

## 🧭 Understanding the Visualization

- **Vertical Frames (Left):** Show current pages in memory.  
- **Timeline (Right):** Displays reference string and highlights current page.  
- **Narration (Bottom):** Describes each event — hit, miss, or replacement.  
- **Counters (Top):** Keep live track of hits, misses, and total references.

---

## 🧠 Sample Output

### Example Input
```
Algorithm: FIFO
Frames: 3
Reference String: 7 0 1 2 0 3 0 4
```

### Example Narration
```
Miss: Page 7 placed in Frame 1
Miss: Page 0 placed in Frame 2
Miss: Page 1 placed in Frame 3
Miss: Page 2 replaced Page 7 (FIFO)
Hit: Page 0 found in Frame 2
```

---

## 📘 Tips
- Adjust **speed** slider for slower or faster playback.
- Reset anytime to test different reference strings or algorithms.
- Use screenshots to document results for reports or presentations.

---

## 🧾 Output Color Guide
| Color | Meaning |
|--------|----------|
| 🟦 Blue | Empty Frame |
| 🟩 Green | Page Hit |
| 🟥 Red | Page Miss / Fault |
| 🟨 Yellow | Current Reference |

---

## 🏁 Completion
You have now successfully executed the **Page Replacement Visualizer**!  
Use it to learn how different algorithms handle memory management under various reference patterns.

**Happy Learning 💻✨**
