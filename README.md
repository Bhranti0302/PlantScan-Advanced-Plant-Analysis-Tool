# 🌿 PlantScan – AI-Powered Plant Analysis Web App

PlantScan is an AI-based plant analysis tool that allows users to upload a photo of a plant and receive an intelligent analysis report. It uses **Google Gemini AI** to identify the plant, assess its health, and provide useful insights. The app also allows users to generate and download a **professional PDF report**.

**Live Project:** [https://plantscan-advanced-plant-analysis-tool-production.up.railway.app/]
**Tech Stack:** Node.js, Express.js, HTML, CSS, JavaScript, Google Gemini AI, PDFKit

---

## ✨ Features

* 📸 Upload a plant image for analysis
* 🧠 AI-powered plant identification (Google Gemini)
* 🌿 Health assessment & growing tips
* 📄 Auto-generated professional PDF report
* ⚡ Fast, responsive, and easy to use
* 🌎 Fully deployed on Railway

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* Responsive design

### Backend

* Node.js
* Express.js
* Multer (for image upload)
* PDFKit (for PDF generation)
* Google Gemini AI (`@google/generative-ai`)

### Hosting

* Railway (Node.js + static frontend)

---

## 📁 Project Structure

```
plantscan/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/
│   └── .gitkeep
│
├── app.js
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installation (Run Locally)

1. Clone the repository:

```
git clone https://github.com/your-username/plantscan.git
cd plantscan
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root:

```
GEMINI_API_KEY=your_api_key_here
```

4. Run the server:

```
npm start
```

5. Open in browser:

```
http://localhost:3000
```

---

## 🚀 Deployment (Railway)

Follow these steps to deploy on Railway:

1. Push your project to **GitHub**
2. Go to **[https://railway.app](https://railway.app)**
3. Click **New Project → Deploy from GitHub**
4. Select this repository
5. Add environment variable inside Railway:

```
Key: GEMINI_API_KEY
Value: your_real_key_here
```

6. Make sure `app.js` contains:

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
```

7. Generate your live domain from:

```
Project → Service → Domains → Generate Domain
```

Your app is now LIVE 🎉

---

## 🔒 .gitignore File

The following files must be ignored for security and performance:

```
node_modules
.env
.DS_Store
```

---

## 🧠 How It Works

1. User uploads a plant image
2. Image is sent to the Node.js backend
3. Gemini AI analyzes the content
4. Results displayed in UI
5. PDF report is generated and available for download

---

## 👩‍💻 Developer

**Bhranti Tamboli**
Junior Frontend / Full Stack Developer
Skills: HTML, CSS, JS, React, Node, UI/UX, MongoDB

📧 Contact: [bhrantitamboli40@gmail.com]

---

## 📜 License

This project is licensed for educational & portfolio use.

---

⭐ If you like this project, don’t forget to give it a star!
