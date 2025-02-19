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

    // project crud operation
    // create project
    app.post("/api/projects", async (req: Request, res: Response) => {
      try {
        const project = { ...req.body, createdAt: new Date() };
        console.log(project);
        const result = await projectsCollection.insertOne(project);
        if (result.acknowledged) {
          res.status(201).json({
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
        const result = await projectsCollection.find().toArray();
        console.log(result);
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // update projects
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
