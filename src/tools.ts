import { z } from "zod";
import guesthouse from "../data/guesthouse.json" assert { type: "json" };
import restaurants from "../data/restaurants.json" assert { type: "json" };
import activities from "../data/activities.json" assert { type: "json" };

export const tools = [
  {
    name: "get_guesthouse_info",
    description: "Get check-in, check-out, WiFi, breakfast, parking, house rules for this guesthouse",
    inputSchema: z.object({}),
    handler: async () => {
      return { content: [{ type: "text", text: JSON.stringify(guesthouse, null, 2) }] };
    }
  },
  {
    name: "recommend_restaurant",
    description: "Recommend restaurants near the guesthouse by town or type",
    inputSchema: z.object({
      town: z.string().optional().describe("Town like Knysna, Plettenberg Bay"),
      type: z.string().optional().describe("Seafood, Family, Fine dining")
    }),
    handler: async ({ town, type }: any) => {
      let results = restaurants as any[];
      if (town) results = results.filter((r) => r.town.toLowerCase().includes(town.toLowerCase()));
      if (type) results = results.filter((r) => r.type.toLowerCase().includes(type.toLowerCase()));
      if (results.length === 0) results = restaurants as any[];
      return { content: [{ type: "text", text: JSON.stringify(results.slice(0, 5), null, 2) }] };
    }
  },
  {
    name: "plan_day_trip",
    description: "Plan a day trip or activity in the Garden Route",
    inputSchema: z.object({
      town: z.string().optional(),
      best_for: z.string().optional().describe("Families, Adventure, Kids")
    }),
    handler: async ({ town, best_for }: any) => {
      let results = activities as any[];
      if (town) results = results.filter((a) => a.town.toLowerCase().includes(town.toLowerCase()));
      if (best_for) results = results.filter((a) => a.best_for.toLowerCase().includes(best_for.toLowerCase()));
      if (results.length === 0) results = activities as any[];
      return { content: [{ type: "text", text: JSON.stringify(results.slice(0, 5), null, 2) }] };
    }
  },
  {
    name: "ask_host",
    description: "Guest needs to contact the host / owner",
    inputSchema: z.object({
      message: z.string().describe("What the guest needs")
    }),
    handler: async ({ message }: any) => {
      return {
        content: [{
          type: "text",
          text: `Please contact ${guesthouse.owner_name} on ${guesthouse.owner_phone} about: ${message}. They will help you directly.`
        }]
      };
    }
  }
];
