import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { tools } from "./tools.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const q = (req.body?.message || "").toLowerCase();
  let answer = "";
  if (q.includes("wifi") || q.includes("password") || q.includes("internet")) {
    answer = "WiFi Network: Thornwood-Guest. Password is in your welcome pack in your room. Signal is strongest in the lounge.";
  } else if (q.includes("breakfast")) {
    answer = "Breakfast is served 7:30 - 9:30 AM in the dining room. Full English, fruit, yoghurt, toast and coffee.";
  } else if (q.includes("check-in") || q.includes("check in") || q.includes("arrive")) {
    answer = "Check-in is from 2:00 PM. Check-out is 10:00 AM. Early check-in possible if room is ready, just WhatsApp us.";
  } else if (q.includes("check-out") || q.includes("check out") || q.includes("leave")) {
    answer = "Check-out is at 10:00 AM. You can leave bags in the lounge if you have a late flight.";
  } else if (q.includes("seafood") || q.includes("restaurant") || q.includes("eat") || q.includes("dinner") || q.includes("food")) {
    answer = "Best seafood in Knysna: 1) The Bell Tavern on the Waterfront, 2) Ile de Pain for a special dinner, 3) 34 South for sushi with a lagoon view.";
  } else if (q.includes("tsitsikamma") || q.includes("day trip") || q.includes("trip") || q.includes("heads") || q.includes("forest") || q.includes("beach")) {
    answer = "Great day trip: Knysna Heads viewpoint (10 mins), then Tsitsikamma National Park (1 hr) - walk the Storms River suspension bridge, lunch at the park, stop at Bloukrans Bridge on the way back.";
  } else if (q.includes("pool") || q.includes("swim")) {
    answer = "Yes, we have a pool in the garden. Open all day. Towels are in your room cupboard.";
  } else if (q.includes("parking")) {
    answer = "Free secure parking on-site, right in front of the guesthouse.";
  } else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    answer = "Hello! Welcome to Thornwood! Ask me about WiFi, breakfast, restaurants in Knysna, or day trips.";
  } else if (q.includes("host") || q.includes("owner") || q.includes("contact") || q.includes("phone")) {
    answer = "Tap Chat on WhatsApp or Call Host at the top of this page and we will reply straight away.";
  } else {
    answer = "For that one, please ask the host directly - tap Chat on WhatsApp above. But I can help with WiFi, breakfast, check-in/out, restaurants, and day trips. Try asking: What is the WiFi password?";
  }
  res.json({ reply: answer });
});

app.get("/", (req, res) => {
  const html = "<!DOCTYPE html>" +
  "<html>" +
  "<head>" +
  "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
  "<title>Thornwood Guesthouse - AI Concierge</title>" +
  "<style>" +
  "body{font-family:Arial,sans-serif;margin:0;background:#f5f0e8;color:#333}" +
  ".header{background:#2d4a3e;color:white;padding:30px 20px;text-align:center}" +
  ".header h1{margin:0;font-size:28px}" +
  ".badge{background:#e8b44a;color:#2d4a3e;padding:6px 14px;border-radius:20px;display:inline-block;font-weight:bold;margin-top:10px;font-size:13px}" +
  ".card{background:white;margin:15px;border-radius:12px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.08)}" +
  ".card h3{margin-top:0;color:#2d4a3e}" +
  ".btn{display:block;background:#2d4a3e;color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;margin:10px 0;font-weight:bold}" +
  ".btn2{background:#e8b44a;color:#2d4a3e}" +
  ".grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
  ".pill{background:#f5f0e8;padding:10px;border-radius:8px;text-align:center;font-size:14px}" +
  "#chatBox{height:220px;overflow-y:auto;border:1px solid #ddd;border-radius:10px;padding:10px;background:#fafafa;margin-bottom:10px}" +
  ".msg{margin:8px 0;padding:10px;border-radius:10px;font-size:14px;line-height:1.4}" +
  ".user{background:#2d4a3e;color:white;margin-left:20px;text-align:right}" +
  ".ai{background:#eef2ef;margin-right:20px}" +
  "#inputRow{display:flex;gap:8px}" +
  "#qInput{flex:1;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:15px}" +
  "#sendBtn{background:#2d4a3e;color:white;border:none;padding:12px 18px;border-radius:10px;font-weight:bold}" +
  ".footer{text-align:center;padding:15px;font-size:12px;opacity:.6}" +
  ".chip{background:#f5f0e8;border:none;padding:7px 10px;border-radius:20px;margin:3px;font-size:12px;cursor:pointer}" +
  ".orb{width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 30% 30%, #e8b44a, #2d4a3e 55%, #0f1f1a 90%);box-shadow:0 0 25px #e8b44a, 0 0 45px #2d4a3e;display:block;margin-bottom:6px;border:1px solid #e8b44a}" +
  "</style>" +
  "</head>" +
  "<body>" +
  "<div class='header'><h1>Thornwood Guesthouse</h1><p>Knysna, Garden Route, South Africa</p><p>Your AI Concierge is Online</p><div class='badge'>LIVE - AI CONCIERGE ONLINE</div></div>" +
  "<div class='card'><div class='orb'></div><h3>Ask The AI Concierge</h3><div id='chatBox'><div class='msg ai'>Hi! I am your Thornwood AI Concierge. Ask me about WiFi, breakfast, check-in, restaurants, or day trips.</div></div>" +
  "<div><button class='chip' id='btnWifi'>WiFi password?</button><button class='chip' id='btnFood'>Seafood?</button><button class='chip' id='btnTrip'>Day trip</button><button class='chip' id='btnBreak'>Breakfast?</button></div>" +
  "<div id='inputRow' style='margin-top:10px'><input id='qInput' placeholder='Type your question here...' /><button id='sendBtn'>Send</button></div></div>" +
  "<div class='card'><h3>Welcome to Thornwood</h3><p>Hi, I am your AI Concierge. I know everything about the guesthouse, restaurants in Knysna, and day trips on the Garden Route.</p><a class='btn' href='#'>Chat on WhatsApp</a><a class='btn btn2' href='#'>Call Host</a></div>" +
  "<div class='card'><h3>Guesthouse Info</h3><div class='grid'><div class='pill'>Check-in<br><b>2:00 PM</b></div><div class='pill'>Check-out<br><b>10:00 AM</b></div><div class='pill'>Breakfast<br><b>7:30 - 9:30 AM</b></div><div class='pill'>Parking<br><b>Free On-site</b></div><div class='pill'>Pool<br><b>Yes</b></div><div class='pill'>WiFi<br><b>Thornwood-Guest</b></div></div></div>" +
  "<div class='card'><h3>For AI / Demo</h3><p>MCP Endpoint:<br>https://garden-route-guesthouse-ai-2.onrender.com/mcp</p></div>" +
  "<div class='footer'>Thornwood Guesthouse - Knysna - Powered by Garden Route AI</div>" +
  "<script>" +
  "async function sendMsg(){var input=document.getElementById('qInput');var text=input.value.trim();if(!text) return;addMsg(text,'user');input.value='';addMsg('...typing...','ai');var res=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});var data=await res.json();var box=document.getElementById('chatBox');box.lastChild.remove();addMsg(data.reply,'ai');}" +
  "function addMsg(t,cls){var box=document.getElementById('chatBox');var div=document.createElement('div');div.className='msg '+cls;div.innerText=t;box.appendChild(div);box.scrollTop=box.scrollHeight;}" +
  "document.getElementById('sendBtn').onclick=sendMsg;" +
  "document.getElementById('qInput').onkeydown=function(e){if(e.key==='Enter') sendMsg();};" +
  "document.getElementById('btnWifi').onclick=function(){document.getElementById('qInput').value='What is the WiFi password?';sendMsg();};" +
  "document.getElementById('btnFood').onclick=function(){document.getElementById('qInput').value='Best seafood restaurant?';sendMsg();};" +
  "document.getElementById('btnTrip').onclick=function(){document.getElementById('qInput').value='Plan a day trip';sendMsg();};" +
  "document.getElementById('btnBreak').onclick=function(){document.getElementById('qInput').value='What time is breakfast?';sendMsg();};" +
  "</script>" +
  "</body></html>";
  res.send(html);
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

const PORT = (globalThis as any).process?.env?.PORT || 3000;
app.listen(PORT, () => console.log("Guesthouse AI running on " + PORT));