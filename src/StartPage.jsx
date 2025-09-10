import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const PlusIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const XIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Background Animation Component
const AnimatedBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Animation Implementations
    const drawBinaryRain = () => {
      let columns = Math.floor(canvas.width / 20);
      let drops = Array.from({ length: columns }).map(
        () => Math.random() * canvas.height
      );
      const speed = 0.8;
      const animate = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#1F2937";
        ctx.font = `15px monospace`;
        drops.forEach((y, i) => {
          const text = Math.random() > 0.5 ? "0" : "1";
          ctx.fillText(text, i * 20, y);
          drops[i] = y > canvas.height && Math.random() > 0.985 ? 0 : y + speed;
        });
        animationFrameId = window.requestAnimationFrame(animate);
      };
      animate();
    };

    const drawMatrixRain = () => {
      const katakana =
        "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
      let columns = Math.floor(canvas.width / 20);
      let drops = Array.from({ length: columns }).map(
        () => Math.random() * canvas.height
      );
      const speed = 1;
      const animate = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00FF41";
        ctx.font = `16px monospace`;
        drops.forEach((y, i) => {
          const text = katakana[Math.floor(Math.random() * katakana.length)];
          ctx.fillText(text, i * 20, y);
          drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + speed;
        });
        animationFrameId = window.requestAnimationFrame(animate);
      };
      animate();
    };

    const drawStarfield = () => {
      const stars = Array.from({ length: 800 }).map(() => ({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
      }));
      const speed = 0.5;
      const animate = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        stars.forEach((star) => {
          star.z -= speed;
          if (star.z < 1) {
            star.x = Math.random() * canvas.width - canvas.width / 2;
            star.y = Math.random() * canvas.height - canvas.height / 2;
            star.z = canvas.width;
          }
          const k = 128 / star.z;
          const sx = star.x * k;
          const sy = star.y * k;
          const r = (1 - star.z / canvas.width) * 2.5;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / canvas.width})`;
          ctx.fill();
        });
        ctx.restore();
        animationFrameId = window.requestAnimationFrame(animate);
      };
      animate();
    };

    const drawPlexus = () => {
      const particles = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
      }));
      const maxDist = 120;
      const animate = () => {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 191, 255, 0.8)";
          ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0, 191, 255, ${1 - dist / maxDist})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        animationFrameId = window.requestAnimationFrame(animate);
      };
      animate();
    };

    // Theme Switch
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (theme) {
      case "matrix":
        drawMatrixRain();
        break;
      case "stars":
        drawStarfield();
        break;
      case "plexus":
        drawPlexus();
        break;
      case "binary":
      default:
        drawBinaryRain();
        break;
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 bg-black"
    ></canvas>
  );
};

// Main App Component
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const savedShortcuts = localStorage.getItem("cli_shortcuts");
      return savedShortcuts
        ? JSON.parse(savedShortcuts)
        : [
            { name: "GitHub", url: "https://github.com" },
            { name: "Vercel", url: "https://vercel.com" },
            { name: "Next.js", url: "https://nextjs.org" },
            { name: "Figma", url: "https://figma.com" },
          ];
    } catch (error) {
      console.error("Error reading shortcuts from localStorage", error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShortcutName, setNewShortcutName] = useState("");
  const [newShortcutUrl, setNewShortcutUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bootSequence, setBootSequence] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [backgroundTheme, setBackgroundTheme] = useState(
    () => localStorage.getItem("bg_theme") || "binary"
  );

  const nameInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const terminalWindowRef = useRef(null);
  const outputContainerRef = useRef(null);
  const keySynth = useRef(null);

  useEffect(() => {
    localStorage.setItem("cli_shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);
  useEffect(() => {
    localStorage.setItem("bg_theme", backgroundTheme);
  }, [backgroundTheme]);
  useEffect(() => {
    if (isModalOpen) nameInputRef.current?.focus();
  }, [isModalOpen]);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop =
        outputContainerRef.current.scrollHeight;
    }
  }, [terminalOutput, isLoading, bootSequence]);

  useEffect(() => {
    // This array will hold all timer IDs created in this effect run.
    const timers = [];

    const bootLines = [
      { text: "Booting iyantamaOS v6.0 (Gacor Ultimate)...", time: 100 },
      { text: "[OK] Initializing quantum core...", time: 300 },
      { text: "[OK] Calibrating neuro-link interface...", time: 150 },
      { text: "[OK] Loading cybernetic modules...", time: 400 },
      { text: "[OK] Establishing connection to mainframe...", time: 250 },
      {
        text: "System online. Welcome, iyantama.",
        time: 100,
        isTyping: true,
      },
    ];

    let delay = 0;
    bootLines.forEach((line, index) => {
      delay += line.time;

      const lineTimer = setTimeout(() => {
        // When a line is ready to be displayed...
        if (line.isTyping) {
          // For typing lines, add an empty placeholder first.
          setBootSequence((prev) => [...prev, ""]);

          // Then, start the typing animation on the LAST element.
          let currentText = "";
          const typingInterval = setInterval(() => {
            currentText = line.text.substring(0, currentText.length + 1);

            setBootSequence((prev) => {
              // Create a new array, update only the last element.
              const newSeq = [...prev];
              newSeq[newSeq.length - 1] = currentText;
              return newSeq;
            });

            if (currentText === line.text) {
              clearInterval(typingInterval);
              if (index === bootLines.length - 1) {
                const finishTimer = setTimeout(() => setIsBooting(false), 500);
                timers.push(finishTimer);
              }
            }
          }, 50);
          timers.push(typingInterval); // Track the interval timer for cleanup
        } else {
          // For static lines, just add the text.
          setBootSequence((prev) => [...prev, line.text]);
        }
      }, delay);
      timers.push(lineTimer); // Track the line timer for cleanup
    });

    // Cleanup function: This is the critical part.
    // It runs when the component unmounts. In Strict Mode, this happens after the first run.
    return () => {
      // Clear all timers created during this effect run.
      timers.forEach(clearTimeout); // clearTimeout also works for setInterval
    };
  }, []);

  useEffect(() => {
    keySynth.current = new Tone.PolySynth(Tone.MembraneSynth, {
      volume: -12,
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.01, release: 0.2 },
    }).toDestination();
  }, []);

  useEffect(() => {
    if (terminalOutput.length === 0) return;
    const lastLine = terminalOutput[terminalOutput.length - 1];
    if (
      lastLine.type === "response" &&
      lastLine.isTyping &&
      lastLine.fullText
    ) {
      if (lastLine.text.length < lastLine.fullText.length) {
        const timer = setTimeout(() => {
          setTerminalOutput((prev) =>
            prev.map((line, index) =>
              index === prev.length - 1
                ? {
                    ...line,
                    text: line.fullText.substring(0, line.text.length + 1),
                  }
                : line
            )
          );
        }, 15);
        return () => clearTimeout(timer);
      } else {
        setTerminalOutput((prev) =>
          prev.map((line, index) =>
            index === prev.length - 1 ? { ...line, isTyping: false } : line
          )
        );
      }
    }
  }, [terminalOutput]);

  const handleBgCommand = (command) => {
    const parts = command.split(" ").filter((p) => p);
    const action = parts[1];
    const theme = parts[2];
    const validThemes = ["matrix", "stars", "plexus", "binary"];
    if (action === "set" && validThemes.includes(theme)) {
      setBackgroundTheme(theme);
      setTerminalOutput((prev) => [
        ...prev,
        { type: "response", text: `[OK] Background theme set to '${theme}'.` },
      ]);
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        {
          type: "error",
          text: `Error: Invalid command. Usage: /bg set [${validThemes.join(
            "|"
          )}]`,
        },
      ]);
    }
  };

  const handleGeminiCommand = async (prompt) => {
    setIsLoading(true);
    const command = prompt.toLowerCase().trim();
    if (command === "help") {
      const helpText = `Tama AI Commands Help 
-----------------------------
Prefix your prompt with '/' to talk to the AI.
Local commands:
  /bg set [theme] - Change background (matrix|stars|plexus|binary)
Special AI commands:
  /sysinfo   - Displays fictional system information.
  /clear     - Clears the terminal screen.
Examples:
  /jelaskan konsep recursi dalam 5 kalimat
Anything without '/' will be a Google search.`;
      setTerminalOutput((prev) => [
        ...prev,
        { type: "response", text: helpText },
      ]);
      setIsLoading(false);
      return;
    }
    if (command === "clear") {
      setTerminalOutput([]);
      setIsLoading(false);
      return;
    }
    if (command === "sysinfo") {
      const sysInfo = `
        ▄▀█ █▄ █ ▄▀█ █▄ █ █▀▄▀█ ▄▀█ █▀█ ▄▀█
        █▀█ █ ▀█ █▀█ █ ▀█ █ █ █ █▀█ █▀▄ █▀█
        -----------------------------------
        USER: iyantama@localhost OS: iyantamaOS v6.0 (Gacor Ultimate)
        KERNEL: 6.9.0-iyantama-cyber UPTIME: 42d, 6h, 9m
        CPU: Quantum Core i9 (16x @ 12.0GHz) GPU: NVIDIA RTX 9090 Super TI
        RAM: 128GB DDR7 @ 9000MHz STATUS: System stable. All rockets ready.`;
      setTerminalOutput((prev) => [
        ...prev,
        { type: "response", text: sysInfo },
      ]);
      setIsLoading(false);
      return;
    }
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [
              {
                text: "You are a helpful command-line assistant. Provide concise, text-based answers.",
              },
            ],
          },
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setTerminalOutput((prev) => [
          ...prev,
          { type: "response", text: "", fullText: text, isTyping: true },
        ]);
      } else {
        throw new Error("Invalid response from API.");
      }
    } catch (error) {
      setTerminalOutput((prev) => [
        ...prev,
        { type: "error", text: `AI Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const command = searchTerm.trim();
    if (!command) return;
    setSearchTerm("");
    setTerminalOutput((prev) => [...prev, { type: "command", text: command }]);
    if (command.startsWith("/bg")) {
      handleBgCommand(command);
    } else if (command.startsWith("/")) {
      await handleGeminiCommand(command.substring(1));
    } else {
      setTimeout(() => {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          command
        )}`;
      }, 200);
    }
  };

  const handleAddShortcut = (e) => {
    e.preventDefault();
    if (newShortcutName.trim() && newShortcutUrl.trim()) {
      let url = newShortcutUrl.trim();
      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }
      setShortcuts([...shortcuts, { name: newShortcutName.trim(), url }]);
      closeModal();
    }
  };

  const handleDeleteShortcut = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setShortcuts(shortcuts.filter((_, idx) => idx !== i));
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewShortcutName("");
    setNewShortcutUrl("");
  };
  const getFaviconUrl = (url, name) => {
    try {
      return `https://www.google.com/s2/favicons?domain=${
        new URL(url).hostname
      }&sz=64`;
    } catch (e) {
      return `https://placehold.co/64x64/111827/9CA3AF?text=${name
        .charAt(0)
        .toUpperCase()}`;
    }
  };
  const formatTime = (date) => date.toLocaleTimeString("en-GB");
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const playKeySound = () => {
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    keySynth.current.triggerAttackRelease("C2", "8n", Tone.now());
  };

  return (
    <div className="bg-black text-gray-300 font-mono min-h-screen p-4 selection:bg-cyan-400 selection:text-black relative overflow-hidden flex items-center justify-center">
      <AnimatedBackground theme={backgroundTheme} />
      <div
        ref={terminalWindowRef}
        className="relative z-10 w-full max-w-4xl opacity-0 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        <div
          className="w-full bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col relative"
          style={{ height: "80vh" }}
        >
          <div className="crt-overlay"></div>
          <div className="flex items-center h-8 px-4 bg-gray-800/80 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-grow text-center text-xs text-gray-400">
              /home/iyantama/startpage — bash
            </div>
          </div>
          <main
            ref={outputContainerRef}
            className="p-6 md:p-8 flex-grow overflow-y-auto"
          >
            {isBooting ? (
              bootSequence.map((line, index) => (
                <div key={index}>
                  <pre className="whitespace-pre-wrap text-green-400">
                    {line}
                  </pre>
                </div>
              ))
            ) : (
              <>
                {terminalOutput.map((line, index) => (
                  <div key={index} className="mb-2">
                    {line.type === "command" && (
                      <div className="flex items-center">
                        <span className="text-cyan-400 mr-2 flex-shrink-0">
                          iyantama@startpage:~$
                        </span>
                        <span className="text-gray-200">{line.text}</span>
                      </div>
                    )}
                    {line.type === "response" && (
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {line.text}
                      </pre>
                    )}
                    {line.type === "error" && (
                      <pre className="whitespace-pre-wrap text-red-400">
                        {line.text}
                      </pre>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-cyan-400 animate-pulse">
                    [ AI is processing command... ]
                  </div>
                )}
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full mt-2"
                  onClick={() => searchInputRef.current?.focus()}
                >
                  <div className="flex items-center text-lg md:text-xl">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">
                      iyantama@startpage:~$
                    </span>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={playKeySound}
                      className="flex-grow bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
                      placeholder="Type a command or search... (try '/help')"
                      autoFocus
                    />
                    <span className="blinking-cursor w-2 h-5 bg-cyan-400 ml-1"></span>
                  </div>
                </form>
              </>
            )}
          </main>
          {!isBooting && (
            <>
              <div className="p-6 md:p-8 border-t border-gray-800/50 flex-shrink-0">
                <h2 className="text-xs text-gray-500 mb-4 tracking-widest">
                  [ BOOKMARKS ]
                </h2>
                <div className="w-full grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-4">
                  {shortcuts.map((shortcut, index) => (
                    <a
                      key={index}
                      href={shortcut.url}
                      className="group relative flex flex-col items-center justify-center p-2 bg-gray-900/50 hover:bg-gray-800/60 rounded-full transition-all duration-300 ease-in-out aspect-square hover:scale-110 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]"
                    >
                      <img
                        src={getFaviconUrl(shortcut.url, shortcut.name)}
                        alt={`${shortcut.name} favicon`}
                        className="w-7 h-7 mb-1 object-contain"
                      />
                      <span className="text-center text-xs truncate w-full text-gray-400 group-hover:text-cyan-300 transition-colors">
                        {shortcut.name}
                      </span>
                      <button
                        onClick={(e) => handleDeleteShortcut(e, index)}
                        className="absolute -top-1 -right-1 p-1 bg-gray-700 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white scale-75"
                        aria-label={`Delete ${shortcut.name}`}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </a>
                  ))}
                  <button
                    onClick={openModal}
                    className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-700/80 hover:border-cyan-500/50 hover:bg-gray-800/50 rounded-full transition-all duration-300 ease-in-out aspect-square group hover:scale-110"
                  >
                    <PlusIcon className="w-6 h-6 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center h-6 px-4 bg-gray-800/80 border-t border-gray-700/50 text-xs text-gray-500 flex-shrink-0">
                <div>v6.1-ultimate</div>
                <div>
                  {formatDate(currentTime)} | {formatTime(currentTime)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-fast"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 w-full max-w-sm m-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-200">
                [ Add New Bookmark ]
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-cyan-400 p-1 rounded-full"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddShortcut} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">
                  $ Bookmark Name:
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={newShortcutName}
                  onChange={(e) => setNewShortcutName(e.target.value)}
                  className="w-full bg-black border-2 border-gray-700 focus:border-cyan-500 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">
                  $ URL:
                </label>
                <input
                  type="text"
                  value={newShortcutUrl}
                  onChange={(e) => setNewShortcutUrl(e.target.value)}
                  className="w-full bg-black border-2 border-gray-700 focus:border-cyan-500 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-0"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-cyan-600/50 hover:bg-cyan-500/60 text-cyan-100 font-bold py-2 px-4 rounded-md border border-cyan-500 transition-all"
                >
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .blinking-cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } } 
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } 
        .animate-fade-in-fast { animation: fade-in 0.2s ease-out forwards; }
        .crt-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50; animation: flicker 0.15s infinite; }
        .crt-overlay::before { content: ' '; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%; z-index: 2; }
        @keyframes flicker { 0% { opacity: 1; } 50% { opacity: 0.95; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
