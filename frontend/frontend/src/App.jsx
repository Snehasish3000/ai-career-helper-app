import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("resume"); // 'resume' or 'career'

  const resultRef = useRef();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://ai-career-helper-backend.onrender.com/generate", {

        name,
        education,
        skills,
        type: mode, // Send mode to backend
      });
      setResult(res.data.output);
    } catch (err) {
      setResult("⚠️ Error: " + (err.response?.data?.error || "Something went wrong"));
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!resultRef.current) return;
    const options = {
      filename: mode === "career" ? "Career_Path_AI.pdf" : "AI_Resume.pdf",
      margin: 0.3,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    window.html2pdf().set(options).from(resultRef.current).save();
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚀 AI Career Helper</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        <button onClick={() => setMode("resume")} style={mode === "resume" ? activeTab : inactiveTab}>
          Resume Mode
        </button>
        <button onClick={() => setMode("career")} style={mode === "career" ? activeTab : inactiveTab}>
          Career Suggestion
        </button>
      </div>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Your Education"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Your Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleGenerate} disabled={loading} style={buttonStyle}>
          {loading ? "Generating..." : "Generate with AI"}
        </button>
        {result && (
          <button onClick={handleDownload} style={buttonStyle}>
            Download PDF
          </button>
        )}
      </div>

      {result && (
        <div
          ref={resultRef}
          style={{
            background: "#fff",
            padding: "2rem",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
          }}
        >
          <h2 style={{ borderBottom: "1px solid #ddd" }}>
            {mode === "career" ? `${name}'s AI Career Roadmap` : `${name}'s AI Resume`}
          </h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};

const activeTab = {
  ...buttonStyle,
  backgroundColor: "#007bff",
};

const inactiveTab = {
  ...buttonStyle,
  backgroundColor: "#ccc",
};

export default App;