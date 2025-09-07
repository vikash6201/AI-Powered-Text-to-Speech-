import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function TTS() {
  const [text, setText] = useState("");
  const [cfgWeight, setCfgWeight] = useState(0.5);
  const [exaggeration, setExaggeration] = useState(0.5);
  const [audioPrompt, setAudioPrompt] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Disable browser back button
  useEffect(() => {
    const disableBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", disableBack);
    return () => window.removeEventListener("popstate", disableBack);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Clear token from localStorage
    window.location.href = "/login"; // Redirect to login page
  };

  // Function to convert MP3 or WAV to WAV Blob (limited to first 10 seconds)
  const convertToWav = async (file) => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Truncate to first 10 seconds
      const sampleRate = audioBuffer.sampleRate;
      const maxSamples = Math.floor(sampleRate * 10); // 10 seconds worth of samples
      const numOfChan = audioBuffer.numberOfChannels;
      const truncatedLength = Math.min(audioBuffer.length, maxSamples);

      // Create new AudioBuffer for truncated audio
      const truncatedBuffer = audioContext.createBuffer(
        numOfChan,
        truncatedLength,
        sampleRate
      );

      // Copy first 10 seconds of each channel
      for (let channel = 0; channel < numOfChan; channel++) {
        const sourceData = audioBuffer.getChannelData(channel);
        const targetData = truncatedBuffer.getChannelData(channel);
        for (let i = 0; i < truncatedLength; i++) {
          targetData[i] = sourceData[i];
        }
      }

      // Convert truncated AudioBuffer to WAV
      const wavBuffer = await audioBufferToWav(truncatedBuffer);
      return new Blob([wavBuffer], { type: "audio/wav" });
    } catch (err) {
      throw new Error("Failed to convert audio to WAV: " + err.message);
    }
  };

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (audioBuffer) => {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let pos = 0;

    // Write WAV header
    setString(view, pos, "RIFF");
    pos += 4;
    view.setUint32(pos, length - 8, true);
    pos += 4;
    setString(view, pos, "WAVE");
    pos += 4;
    setString(view, pos, "fmt ");
    pos += 4;
    view.setUint32(pos, 16, true);
    pos += 4;
    view.setUint16(pos, 1, true);
    pos += 2; // PCM format
    view.setUint16(pos, numOfChan, true);
    pos += 2;
    view.setUint32(pos, audioBuffer.sampleRate, true);
    pos += 4;
    view.setUint32(pos, audioBuffer.sampleRate * numOfChan * 2, true);
    pos += 4;
    view.setUint16(pos, numOfChan * 2, true);
    pos += 2;
    view.setUint16(pos, 16, true);
    pos += 2;
    setString(view, pos, "data");
    pos += 4;
    view.setUint32(pos, length - pos - 4, true);
    pos += 4;

    // Write interleaved PCM samples
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    for (let i = 0; i < audioBuffer.length; i++) {
      for (let chan = 0; chan < numOfChan; chan++) {
        const sample = Math.max(-1, Math.min(1, channels[chan][i]));
        view.setInt16(
          pos,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        pos += 2;
      }
    }

    return buffer;

    function setString(view, offset, str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    formData.append("cfg_weight", cfgWeight);
    formData.append("exaggeration", exaggeration);

    if (audioPrompt) {
      try {
        // Convert audio to WAV (first 10 seconds)
        const wavBlob = await convertToWav(audioPrompt);
        formData.append("audio_prompt", wavBlob, "prompt.wav");
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      const res = await fetch("http://localhost:8000/tts/synthesize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to synthesize audio");
      }

      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logout button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-semibold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/30"
          >
            Logout
          </button>
        </div>

        <div className="text-center max-w-5xl mx-auto">
          {/* Removed floating icons */}
          <div className="relative mb-12"></div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8 animate-fade-in leading-tight">
            Create Your Voice
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
            Transform your text into natural, expressive audio with our advanced
            AI-powered text-to-speech technology.
          </p>

          {/* Form */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in animation-delay-700">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full max-w-md mx-auto"
            >
              <textarea
                placeholder="Enter text to synthesize"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">
                    CFG Weight (0.0 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={cfgWeight}
                    onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">
                    Exaggeration (0.0 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={exaggeration}
                    onChange={(e) =>
                      setExaggeration(parseFloat(e.target.value))
                    }
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Audio Prompt (Optional .wav or .mp3, first 10 seconds used)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".wav,.mp3"
                    onChange={(e) => setAudioPrompt(e.target.files[0])}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-500 file:text-white file:hover:bg-purple-600"
                  />
                  <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 flex items-center justify-center space-x-3"
                disabled={isLoading}
              >
                <span>{isLoading ? "Processing..." : "Convert to Audio"}</span>
              </button>
            </form>

            {isLoading && (
              <div className="mt-6 flex justify-center animate-fade-in animation-delay-900">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {error && (
              <div className="mt-6 text-red-400 text-center animate-fade-in animation-delay-900">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="mt-8 animate-fade-in animation-delay-900">
                <audio
                  controls
                  src={audioUrl}
                  className="w-full max-w-md mx-auto"
                ></audio>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
          opacity: 0;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}
