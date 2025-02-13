import { Hono } from "hono";
import { Subscriber } from "../models/subscriber";

export const subscriber = new Hono();

subscriber.get("/", async (c) => {
  const subscribers = await Subscriber.findAll();

  return c.json(
    {
      data: subscribers,
    },
    200
  );
});

subscriber.get("/:id", async (c) => {
  const id = c.req.param("id");
  const subscriber = await Subscriber.findID(id);

  return c.json(
    {
      data: subscriber,
    },
    200
  );
});

subscriber.post("/subscribermail", async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    return c.json({ error: "Email is missing" }, 400);
  }

  const newSubscriber = await Subscriber.createEmail(email);

  return c.json(
    {
      message: "Email created.",
      data: newSubscriber,
    },
    201
  );
});

subscriber.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updatedSubscriber = await Subscriber.update(id, body);

    if (updatedSubscriber) {
      return c.json(
        {
          message: "Subscriber updated succesfully",
          data: updatedSubscriber,
        },
        200
      );
    } else {
      return c.text("Subscriber not found or update failed", 404);
    }
  } catch (error) {
    console.error("Error updating subscriber:", error);
    return c.text("Internal Server Error", 500);
  }
});

subscriber.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const newSubscriber = await Subscriber.createEmail(body);
    return c.json(
      {
        message: "Subscriber created successfully",
        data: newSubscriber,
      },
      201
    );
  } catch (error) {
    console.error("Error creating subscriber", error);
    return c.text("Internal Server Error", 500);
  }
});


