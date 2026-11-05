import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { tools } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompts.js";

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
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>