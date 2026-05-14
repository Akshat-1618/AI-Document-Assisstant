# 📄 AI Document Intelligence System

An AI-powered platform that transforms traditional documents into intelligent, interactive, and accessible outputs using Large Language Models (LLMs), automated planners, and multi-speaker podcast generation.

Built using **FastAPI**, **React.js**, **Gemini API**, **Edge-TTS**, and **Pydub**.

---

# 🚀 Features

## 📄 PDF Text Extraction
- Extracts readable text from uploaded PDF documents.

## 🧠 AI-Powered Summarization
- Generates concise summaries for quick understanding.

## ❓ Question Answering System
- Context-aware answers based on uploaded document content.

## 📅 Planner Generation
- Student Planner
- Lecture Planner
- Lab Planner

## 🎙️ Podcast Generation
- Converts documents into conversational podcasts.
- Multi-speaker interaction using **Alex & Sam** voices.
- Generates transcript + downloadable audio.

## 🎧 Text-to-Speech Integration
- Natural voice synthesis using Edge-TTS.

## 🌐 Interactive Frontend
- Clean and responsive UI built with React.js.

---

# 🛠️ Tech Stack

## Frontend
- React.js
- JavaScript
- CSS

## Backend
- FastAPI
- Python

## AI & Processing
- Gemini API (LLM)
- Edge-TTS
- Pydub
- PDF Processing Libraries

---

# 📌 System Workflow

```text
User Upload PDF
        ↓
Text Extraction
        ↓
AI Processing (LLM)
   ├── Summary
   ├── Q&A
   ├── Planner Generation
   └── Podcast Script
                ↓
         Text-to-Speech
                ↓
          Audio Merging
                ↓
          Final Podcast
```

---

# 📂 Project Modules

## 1️⃣ Document Processing Module
- Upload PDF documents
- Extract and preprocess text
- Handle structured and semi-structured PDFs

## 2️⃣ Summary & QA Module
- Generate concise AI-powered summaries
- Answer contextual questions from uploaded documents
- Improve document understanding and accessibility

## 3️⃣ Planner Generation Module

### Student Planner
- Generates study schedules automatically

### Lecture Planner
- Creates structured lecture plans semester-wise

### Lab Planner
- Organizes lab schedules and experiments efficiently

## 4️⃣ Podcast Generation Module
- Converts document content into conversational scripts
- Multi-speaker interaction using Alex & Sam
- Generates transcript + podcast audio
- Merges audio clips seamlessly using Pydub

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/ai-document-intelligence-system.git

cd ai-document-intelligence-system
```

---

# Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🧪 Tested Functionalities

✅ PDF Upload & Text Extraction  
✅ Summary Generation  
✅ Question Answering  
✅ Podcast Script Generation  
✅ Multi-Speaker Audio Generation  
✅ Audio Merging  
✅ End-to-End Pipeline Testing  

---

# 💡 Key Innovations

- Multi-feature AI document platform
- Podcast-style document understanding
- Reduced screen-time learning
- Audio + Text accessibility
- Fully automated workflow
- Interactive AI-driven learning experience

---

# 📈 Advantages of the System

- Saves time while understanding lengthy documents
- Provides both text and audio learning formats
- Improves productivity for students and professionals
- Enhances accessibility and engagement
- Reduces cognitive overload and screen fatigue

---

# 🌍 Impact

## Social Impact
- Reduces digital fatigue and eye strain
- Supports auditory learning
- Improves accessibility for users with reading difficulties

## Environmental Impact
- Encourages paperless learning
- Reduces printing dependency
- Promotes sustainable digital practices

## Industry Applications
- EdTech Platforms
- Research & Academia
- Corporate Knowledge Management
- AI Learning Platforms
- Automated Document Analysis Systems

---

# 🔮 Future Scope

- DOCX/Image/Handwritten note support
- Multilingual podcast generation
- Personalized learning outputs
- Real-time collaboration
- Mobile application support
- Advanced OCR integration
- Emotion-aware voice synthesis
- Cloud deployment for scalability

---
# 📸 Output Features

## 📄 Visual Summary
<img width="1247" height="655" alt="image" src="https://github.com/user-attachments/assets/776eb40e-a624-47e6-aeb9-b7f5cc368147" />

## 🎙️ Podcast Generation
<img width="1244" height="657" alt="image" src="https://github.com/user-attachments/assets/76c158ab-2daa-4b93-bbd1-fc1f023cd939" />


## 📅 Lecture Planner
<img width="1235" height="654" alt="image" src="https://github.com/user-attachments/assets/bb275d0e-76af-4ac5-b23e-5a823a1da63a" />


## 🧪 Lab Planner
<img width="1243" height="667" alt="image" src="https://github.com/user-attachments/assets/632306bd-5d9b-4765-a4b9-0de8546938c4" />


---

# 🧠 AI Models & Libraries Used

| Technology | Purpose |
|------------|----------|
| Gemini API | Summarization, QA, Script Generation |
| FastAPI | Backend APIs |
| React.js | Frontend UI |
| Edge-TTS | Voice Generation |
| Pydub | Audio Merging |
| PDF Processing Libraries | Text Extraction |

---


# 📜 License

This project is developed for academic and research purposes under JIIT Noida Minor Project – 2 (2026).
