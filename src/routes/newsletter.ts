import { Hono } from "hono";
import { Newsletter } from "../models/newsletter";
import { Subscriber } from "../models/subscriber";

export const newsletter = new Hono();

newsletter.get("/", async (c) => {
  const newsletter = await Newsletter.findAll();

  return c.json(
    {
      data: newsletter,
    },
    200
  );
});

newsletter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const newsletter = await Newsletter.findID(id);

  return c.json(
    {
      data: newsletter,
    },
    200
  );
});

newsletter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updatedNewsletter = await Newsletter.updateNewsletter(
      id,
      body
    );

    if (updatedNewsletter) {
      return c.json(
        {
          message: "Newsletter updated succesfully",
          data: updatedNewsletter,
        },
        200
      );
    } else {
      return c.text("Newsletter not found or update failed", 404);
    }
  } catch (error) {
    console.error("Error updating newsletter:", error);
    return c.text("Internal Server Error", 500);
  }
});

newsletter.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const newNewsletter = await Newsletter.createNewsletter(body);
    return c.json(
      {
        message: "Newsletter created successfully",
        data: newNewsletter,
      },
      201
    );
  } catch (error) {
    console.error("Error creating Newsletter", error);
    return c.text("Internal Server Error", 500);
  }
});

newsletter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deletedNewsletter = await Newsletter.deleteNewsletter(id);

  return c.json(
    {
      data: deletedNewsletter,
      message: "Newsletter deleted",
    },
    200
  );
});
