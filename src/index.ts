import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { tools } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompts.js";

const app = express();
app.use(cors());
app.use(express.json());

// PRETTY DEMO PAGE - WHAT CLIENTS WILL SEE
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
.header p{margin:5px 0;opacity:.9}
.badge{background:#e8b44a;color:#2d4a3e;padding:6px 14px;border-radius:20px;display:inline-block;font-weight:bold;margin-top:10px;font-size:13px}
.card{background:white;margin:15px;border-radius:12px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
.card h3{margin-top:0;color:#2d4a3e}
.btn{display:block;background:#2d4a3e;color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;margin:10px 0;font-weight:bold}
.btn2{background:#e8b44a;color:#2d4a3e}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pill{background:#f5f0e8;padding:10px;border-radius:8px;text-align:center;font-size:14px}
.footer{text-align:center;padding:15px;font-size:12px;opacity:.6}
code{background:#eee;padding:2px 6px;border-radius:4px;font-size:12px;word-break:break-all}
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
<p style="font-size:13px;margin-top:12px">Ask the AI for WiFi password, house rules, and local tips.</p>
</div>

<div class="card">
<h3>🍽️ Try Asking The AI</h3>
<ul>
<li>"What is the WiFi password?"</li>
<li>"Best seafood restaurant in Knysna?"</li>
<li>"Plan a day trip to Tsitsikamma?"</li>
<li>"What time is breakfast?"</li>
</ul>
</div>

<div class="card">
<h3>🤖 For AI / Demo</h3>
<p>This is a live MCP Server. Any AI like Claude can connect to it.</p>
<p>MCP Endpoint:<br><code>https://garden-route-guesthouse-ai-2.onrender.com/mcp</code></p>
<p>Tools:</p>
<ul>
<li><b>get_guesthouse_info</b> - WiFi, check-in, breakfast</li>
<li><b>recommend_restaurant</b> - Best in Knysna</li>
<li><b>plan_day_trip</b> - Garden Route trips</li>
<li><b>ask_host</b> - Contact owner</li>
</ul>
</div>

<div class="footer">Thornwood Guesthouse • Knysna • Powered by Garden Route AI • Frankfurt Region</div>
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
app.listen(PORT, () => console.log(`Guesthouse AI running on ${PORT}`));