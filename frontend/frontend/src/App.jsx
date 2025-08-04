import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("resume"); // resume or career

  const resultRef = useRef();

  const BACKEND_URL = "https://ai-career-helper-backend.onrender.com/generate"; // ✅ Replace with your real backend URL if needed

  const handleGenerate = async () => {
    if (!name || !education || !skills) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const response = await axios.post(BACKEND_URL, {
        name,
        education,
        skills,
        type: mode,
      });

      // Support both keys
      setResult(response.data.output || response.data.generated_text || "No output received.");
    } catch (err) {
      console.error(err);
      setResult(
        "⚠️ Error: " + (err.response?.data?.error || "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
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
    <div style={containerStyle}>
      <h1>🚀 AI Career Helper</h1>

      <div style={tabStyle}>
        <button
          onClick={() => setMode("resume")}
          style={mode === "resume" ? activeTab : inactiveTab}
        >
          Resume Mode
        </button>
        <button
          onClick={() => setMode("career")}
          style={mode === "career" ? activeTab : inactiveTab}
        >
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

      <div style={buttonGroup}>
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
        <div ref={resultRef} style={outputStyle}>
          <h2>{mode === "career" ? `${name}'s AI Career Roadmap` : `${name}'s AI Resume`}</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: "700px",
  margin: "auto",
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  fontSize: "1rem",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
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

const tabStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "1rem",
};

const activeTab = {
  ...buttonStyle,
  backgroundColor: "#007bff",
};

const inactiveTab = {
  ...buttonStyle,
  backgroundColor: "#ccc",
};

const outputStyle = {
  background: "#fff",
  padding: "2rem",
  border: "1px solid #ccc",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  whiteSpace: "pre-wrap",
  lineHeight: "1.6",
  borderRadius: "8px",
};

export default App;
