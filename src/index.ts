import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { tools } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompts.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- SIMPLE AI CHAT FOR GUESTS (no API key needed) ---
app.post("/chat", (req, res) => {
  const q = (req.body?.message || "").toLowerCase();
  let answer = "";

  if (q.includes("wifi") || q.includes("password") || q.includes("internet")) {
    answer = "📶 WiFi Network: Thornwood-Guest\nPassword: Ask your host on arrival - it's in your welcome pack. The signal is strongest in the lounge and rooms 1-3.";
  } else if (q.includes("breakfast")) {
    answer = "🍳 Breakfast is served 7:30 - 9:30 AM in the dining room. Full English, fruit, yoghurt, toast and coffee. Let us know about allergies the night before.";
  } else if (q.includes("check-in") || q.includes("check in") || q.includes("arrive")) {
    answer = "🛬 Check-in is from 2:00 PM. Early check-in is possible if the room is ready - just WhatsApp us. Check-out is 10:00 AM.";
  } else if (q.includes("check-out") || q.includes("check out") || q.includes("leave")) {
    answer = "🛫 Check-out is at 10:00 AM. You can leave bags in the lounge if you have a late flight.";
  } else if (q.includes("seafood") || q.includes("restaurant") || q.includes("eat") || q.includes("dinner") || q.includes("food")) {
    answer = "🍽️ Best seafood in Knysna: 1) The Bell Tavern on the Waterfront for fish & chips, 2) Ile de Pain for a special dinner, 3) 34 South for sushi with a lagoon view. Want me to book one?";
  } else if (q.includes("tsitsikamma") || q.includes("day trip") || q.includes("trip") || q.includes("knysna heads") || q.includes("forest") || q.includes("beach")) {
    answer = "🌿 Great day trip: Start at Knysna Heads viewpoint (10 mins), then drive to Tsitsikamma National Park (1 hr) - walk the Storms River suspension bridge, lunch at the park restaurant, stop at Bloukrans Bridge on the way back.";
  } else if (q.includes("pool") || q.includes("swim")) {
    answer = "🏊 Yes, we have a pool in the garden. Open all day. Towels are in your room cupboard.";
  } else if (q.includes("parking")) {
    answer = "🅿️ Free secure parking on-site, right in front of the guesthouse.";
  } else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    answer = "👋 Hello! Welcome to Thornwood! Ask me about WiFi, breakfast, restaurants in Knysna, or day trips. What do you need?";
  } else if (q.includes("host") || q.includes("owner") || q.includes("contact") || q.includes("phone")) {
    answer = "📞 You can tap 'Call Host' or 'Chat on WhatsApp' at the top of this page and we'll reply straight away.";
  } else {
    answer = "Thanks for asking! For that one, it's best to ask the host directly - tap 'Chat on WhatsApp' above. But I can help with WiFi, breakfast, check-in/out, restaurants, and day trips. Try asking: 'What is the WiFi password?'";
  }
  res.json({ reply: answer });
});

// PRETTY DEMO PAGE + CHAT BOX
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thornwood Guesthouse - AI Concierge</title>
<style>
body{font-family:Arial,sans-serif;margin:0;background:#f5f0e8;color:#333}
.header{background:#2d4a3e;color:white;padding:30px 20px;text-align:center}
.header h1{margin:0;font-size:28px}
.badge{background:#e8b44a;color:#2d4a3e;padding:6px 14px;border-radius:20px;display:inline-block;font-weight:bold;margin-top:10px;font-size:13px}
.card{background:white;margin:15px;border-radius:12px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
.card h3{margin-top:0;color:#2d4a3e}
.btn{display:block;background:#2d4a3e;color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;margin:10px 0;font-weight:bold}
.btn2{background:#e8b44a;color:#2d4a3e}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pill{background:#f5f0e8;padding:10px;border-radius:8px;text-align:center;font-size:14px}
#chatBox{height:220px;overflow-y:auto;border:1px solid #ddd;border-radius:10px;padding:10px;background:#fafafa;margin-bottom:10px}
.msg{margin:8px 0;padding:10px;border-radius:10px;font-size:14px;line-height:1.4}
.user{background:#2d4a3e;color:white;margin-left:20px;text-align:right}
.ai{background:#eef2ef;margin-right:20px}
#inputRow{display:flex;gap:8px}
#qInput{flex:1;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:15px}
#sendBtn{background:#2d4a3e;color:white;border:none;padding:12px 18px;border-radius:10px;font-weight:bold}
.footer{text-align:center;padding:15px;font-size:12px;opacity:.6}
code{background:#eee;padding:2px 6px;border-radius:4px;font-size:12px;word-break:break-all}
.chip{background:#f5f0e8;border:none;padding:7px 10px;border-radius:20px;margin:3px;font-size:12px}
</style>
</head>
<body>
<div class="header">
<h1>🌿 Thornwood Guesthouse</h1>
<p>Knysna, Garden Route, South Africa</p>
<p>Your AI Concierge is Online</p>
<div class="badge">● LIVE - AI CONCIERGE ONLINE</div>
</div>

<div class="card">
<h3>💬 Ask The AI Concierge</h3>
<div id="chatBox"><div class="msg ai">👋 Hi! I'm your Thornwood AI Concierge. Ask me about WiFi, breakfast, restaurants, or day trips!</div></div>
<div>
<button class="chip" onclick="ask('What is the WiFi password?')">WiFi password?</button>
<button class="chip" onclick="ask('Best seafood restaurant?')">Seafood?</button>
<button class="chip" onclick="ask('Plan a day trip')">Day trip</button>
<button class="chip" onclick="ask('What time is breakfast?')">Breakfast?</button>
</div>
<div id="inputRow" style="margin-top:10px">
<input id="qInput" placeholder="Type your question here..." onkeydown="if(event.key==='Enter') sendMsg()" />
<button id="sendBtn" onclick="sendMsg()">Send</button>
</div>
</div>

<div class="card">
<h3>👋 Welcome to Thornwood</h3>
<p>Hi, I'm your AI Concierge. I know everything about the guesthouse, restaurants in Knysna, and day trips on the Garden Route.</p>
<a class="btn" href="#">💬 Chat on WhatsApp</a>
<a class="btn btn2" href="#">📞 Call Host</a>
</div>

<div class="card">
<h3>🏡 Guesthouse Info</h3>
<div class="grid">
<div class="pill">🛬 Check-in<br><b>2:00 PM</b></div>
<div class="pill">🛫 Check-out<br><b>10:00 AM</b></div>
<div class="pill">🍳 Breakfast<br><b>7:30 - 9:30 AM</b></div>
<div class="pill">🅿️ Parking<br><b>Free On-site</b></div>
<div class="pill">🏊 Pool<br><b>Yes</b></div>
<div class="pill">📶 WiFi<br><b>Thornwood-Guest</b></div>
</div>
</div>

<div class="card">
<h3>🤖 For AI / Demo</h3>
<p>MCP Endpoint:<br><code>https://garden-route-guesthouse-ai-2.onrender.com/mcp</code></p>
</div>

<div class="footer">Thornwood Guesthouse • Knysna • Powered by Garden Route AI</div>
<script>
async function sendMsg(){
  const input = document.getElementById('qInput');
  const text = input.value.trim();
  if(!text) return;
  addMsg(text, 'user');
  input.value = '';
  addMsg('...typing...', 'ai');
  const res = await fetch('/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message: text})});
  const data = await res.json();
  const box = document.getElementById('chatBox');
  box.lastChild.remove();
  addMsg(data.reply, 'ai');
}
function ask(t){ document.getElementById('qInput').value = t; sendMsg(); }
function addMsg(t, cls){
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'msg ' + cls;
  div.innerText = t;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
</script>
</body>
</html>
  `);
});

app.post("/mcp", async (req, res) => {
  const server = new McpServer({ name: "garden-route-guesthouse-ai", version: "1.0.0" });
  for (const tool of tools) {
    // @ts-ignore
    server.tool(tool.name, tool.description, tool.inputSchema.shape, tool.handler);
  }
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  res.status(405).send("Use POST");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Guesthouse AI running on \${PORT}\`));