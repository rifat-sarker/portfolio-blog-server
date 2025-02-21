import { Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// types
// Define Project interface
type Project = {
  title: string;
  image: string;
  live: string;
  code: string;
  description: string;
  category: "Frontend" | "Backend" | "Full Stack";
};

type Blog = {
  title: string;
  content: string;
  image: string;
  category: "Technology" | "Lifestyle" | "Health" | "Education" | "Business";
};

type Message = {
  text: string;
};

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("portfolio-blog");
    const collection = db.collection("users");
    const projectsCollection: Collection<Project> = db.collection("projects");
    const blogsCollection: Collection<Blog> = db.collection("blogs");
    const messageCollection: Collection<Message> = db.collection("messages");

    // projects crud operation
    // create project
    app.post("/api/projects", async (req: Request, res: Response) => {
      try {
        console.log("Received Data:", req.body); // ✅ Debugging
        const project = { ...req.body, createdAt: new Date() };
        console.log(project);
        const result = await projectsCollection.insertOne(project);
        if (result.acknowledged) {
          res.status(201).json({
            success: true,
            message: "Project created successfully",
            id: result.insertedId,
          });
        } else {
          res.status(400).json({ message: "Failed to create project" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //get projects
    app.get("/api/projects", async (req: Request, res: Response) => {
      try {
        const projects = await projectsCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Projects fetched successfully",
          data: projects,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // update project
    app.patch("/api/projects/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const updatedProject = req.body;

        if (!updatedProject || Object.keys(updatedProject).length === 0) {
          return res.status(400).json({ message: "No update data provided" });
        }

        const result = await projectsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProject, $currentDate: { createdAt: true } }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Project updated successfully" });
        } else {
          res.status(404).json({ message: "Project not found or no changes" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // delete project
    app.delete("/api/projects/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        // Check if ID is valid
        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid project ID" });
        }

        const result = await projectsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Project deleted successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Project not found" });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // blogs crud operation
    // create blog
    app.post("/api/blog", async (req: Request, res: Response) => {
      try {
        const blog = { ...req.body, createdAt: new Date() };
        console.log(blog);
        const result = await blogsCollection.insertOne(blog);
        if (result.acknowledged) {
          res.status(201).json({
            success: true,
            message: "Blog created successfully",
            id: result.insertedId,
          });
        } else {
          res.status(400).json({ message: "Failed to create blog" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //get blogs
    app.get("/api/blog", async (req: Request, res: Response) => {
      try {
        const blogs = await blogsCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Blogs fetched successfully",
          data: blogs,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // update blog
    app.patch("/api/blog/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const updatedBlog = req.body;

        if (!updatedBlog || Object.keys(updatedBlog).length === 0) {
          return res.status(400).json({ message: "No update data provided" });
        }

        const result = await blogsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedBlog, $currentDate: { createdAt: true } }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Blog updated successfully" });
        } else {
          res.status(404).json({ message: "Blog not found or no changes" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // delete blog
    app.delete("/api/blog/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        // Check if ID is valid
        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid blog ID" });
        }

        const result = await blogsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Blog deleted successfully" });
        } else {
          res.status(404).json({ success: false, message: "Blog not found" });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // message management
    // send message to db
    app.post("/api/message", async (req: Request, res: Response) => {
      try {
        const result = await messageCollection.insertOne({
          ...req.body,
          createdAt: new Date(),
        });
        if (result.acknowledged) {
          res.status(201).json({
            success: true,
            message: "Message sent successfully",
            id: result.insertedId,
          });
        } else {
          res.status(400).json({ message: "Failed to send message" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //get messages
    app.get("/api/message", async (req: Request, res: Response) => {
      try {
        const messages = await messageCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Message fetched successfully",
          data: messages,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
