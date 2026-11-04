import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { tools } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompts.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Garden Route Guesthouse AI is live. System: " + SYSTEM_PROMPT.slice(0, 100));
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