# Product Requirements Document (PRD): HealthVault 🩺

## 1. Product Overview
**HealthVault** is a next-generation, blockchain-logged health records management system. It aims to put patients in complete control of their medical data while streamlining workflows for doctors and hospitals/labs. The platform uses AI (OCR and NLP) to parse medical records, provides emergency data access via offline QR codes, and ensures high privacy through fine-grained, mutually authenticated access controls.

---

## 2. Target Audience & User Roles
The platform operates through a primary authentication gateway that categorizes users into three distinct roles:

### 2.1 Patient
The end-user managing personal and family health data.
*   **Key Needs:** Secure storage, easy uploading (OCR translation), family data aggregation, and strict access control over medical professionals.

### 2.2 Medical Professional (Doctor)
Certified physicians or healthcare providers.
*   **Key Needs:** Viewing authorized patient data, writing digital prescriptions and consultation notes, running health trajectory simulations, and gaining instant emergency access via QR code.

### 2.3 Hospital / Lab
Institutional entities responsible for clinical tests and scans.
*   **Key Needs:** Fast generation and secure delivery of lab reports directly to a patient's vault.

---

## 3. Core Features & Epics

### Epic 1: Identity & Authentication
*   **Email & Password Login:** Standard registration for all roles.
*   **Aadhaar UID Integration (Mocked):** Secure 12-digit Aadhaar login with simulated mobile OTP verification for frictionless, highly trusted patient onboarding.
*   **Role-Based Access Control (RBAC):** UI and token-based separation of Dashboards. 

### Epic 2: Patient Health Vault
*   **AI Document OCR & Parser:** Patients can upload physical reports. The backend utilizes `Tesseract.js` internally to extract text and sends it to `Groq API (Llama 3)` to instantly parse diagnoses, blood metrics, and generate layman summaries.
*   **Medication Tracker:** Tracks current active medications, dosage, frequency, and provides an adherence log that visually graphs the last 7 days of medication compliance.
*   **Health Score Analytics:** A dynamic visual gauge (0–1000) that indicates general health, populated by a background AI analysis of recent records and medicine habits.
*   **AI Healthcare Assistant (Chatbot):** A floating AI chat interface powered by Groq Llama 3 that allows patients to ask questions about their uploaded records and symptoms.

### Epic 3: Access Control & Privacy Settings
*   **Search & Grant:** Patients can search the database for certified Doctors (by Doctor Code `DR-XXXX`, name, or specialty) and grant them **Full**, **Limited**, or **Emergency** access. 
*   **Instant Revocation:** Patients retain the right to terminate access instantly, wiping the patient's data from the doctor’s portal.
*   **Blockchain Ledger Action Tracking:** A decentralized ledger simulation running locally that permanently tracks security-sensitive events: `ACCESS_GRANTED`, `ACCESS_REVOKED`, `EMERGENCY_ACCESS`. This provides absolute non-repudiation.

### Epic 4: Emergency Architecture
*   **Offline Medical QR Code:** Patients can generate an emergency QR code encompassing critical life-saving data (Blood Group, Allergies, Chronic Conditions, Medicines, Health ID).
*   **Hospital/Doctor QR Scanner:** Doctors or Hospital admins can upload a screenshot or image of the patient's QR code. The system uses `jsQR` to decode the image, extracts the Patient ID, and triggers an automatic, blockchain-logged `ACCESS_GRANTED_QR` event granting the clinician immediate life-saving file access.

### Epic 5: The Family Vault
*   **Identifier Search Engine:** Users can search for existing patients via Health ID `HV-XXXX`, Email, or Exact Name.
*   **Two-Way Handshake (Request/Accept):** Sending a search request notifies the target user in a "Pending Requests" queue.
*   **Mutual Aggregation:** Once accepted, both parties are mutually injected into each other's dashboards, allowing parents or caretakers to share cross-monitoring capabilities over medicine adherence and recent uploaded logs.

### Epic 6: Doctor & Hospital Portals
*   **The Doctor Dashboard:**
    *   **Patient List:** Real-time visibility of patients who have granted access.
    *   **Health Simulator (`DoctorSimulation`):** A predictive chart simulating a patient's projected recovery trajectory or chronic disease progression based on current adherence and vital signs.
    *   **Digital Prescriptions & Consultation Notes:** Doctors can compose consultation notes containing digital prescriptions (medicine, dosage, duration) which are automatically and securely pushed into the patient's core vault.
*   **The Hospital/Lab Dashboard:**
    *   **Direct-to-Vault Dispatching:** A clean interface allowing lab technicians to scan a patient's QR or enter their ID to upload encrypted PDFs/Scans securely mapped to that specific patient’s timeline.

---

## 4. Technical Architecture Strategy

### 4.1 Frontend Stack
*   **Framework:** React 18 (Vite)
*   **State Management:** React Context API (`AuthContext.js`)
*   **Styling:** Clean Vanilla CSS with custom property variables (dark/light theme support)
*   **Utilities:** `qrcode.react` (QR Generator), `jsQR` (QR decoding), `react-icons`.

### 4.2 Backend & Storage Stack
*   **Environment:** Node.js using Express.js
*   **Database:** MongoDB, abstracted via Mongoose ORM
*   **Storage (Images & PDFs):** Cloudinary API (secure cloud bucket retrieval)
*   **Core AI Pipelines:** 
    *   `Tesseract.js` (Local lightweight OCR for image-to-text to prevent Groq context-limit issues)
    *   `Groq SDK (Llama 3.1 8B Instant)` (High-speed API for Text Analysis and Chat)

### 4.3 Security Posture
*   **Authentication:** JWT (JSON Web Tokens) attached to Authorization headers as Bearer strings.
*   **Sanitization:** `xss` library used to prevent Cross-Site Scripting injected into OCR payloads or chat queries.
*   **Protection:** `bcryptjs` for irrecoverable password hashing.

---

## 5. Non-Functional Requirements
1.  **AI Scalability:** The system uses Groq for high-speed LLM processing. Rate limits are handled by intelligent, 12-hour backend caching of Patient AI summaries.
2.  **Zero-Cost Constraints:** Designed to remain fully free. Tesseract runs locally on the Node server (0 cost). Cloudinary is under a generous free tier. Groq replaces Gemini for high-throughput, free inference.
3.  **Cross-Platform Parity:** UI is completely fluid utilizing CSS Flexbox and Grid, ready for mobile viewers or expansive Desktop clinic monitors.

*End of Document*
