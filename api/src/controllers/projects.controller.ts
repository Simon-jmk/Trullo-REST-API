import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import prisma from '../models/prismaClient';


export const createProject = async (req: Request, res: Response) => {
  // Validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { ownerId, name, description } = req.body; // Extract ownerId, name, and description from the body

  // Check if ownerId is provided
  if (!ownerId) {
    return res.status(400).json({ error: 'ownerId is required' });
  }

  try {
    // Create a new project in the database with ownerId
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId, // Include ownerId in the data
      },
    });

    // Respond with the created project
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Example function to get all projects (optional)
export const getProjects = async (req: Request, res: Response) => {
  try {
    // Fetch all projects from the database
    const projects = await prisma.project.findMany({
      include: {
        owner: true, // Include owner details if necessary
        tasks: true,  // Include tasks associated with the project if needed
      },
    });

    // Respond with the list of projects
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export async function updateProject(req: Request, res: Response) {
  const projectId = parseInt(req.params.id);
  const { name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  const projectId = parseInt(req.params.id);

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

export const validateProject = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'), // Ensure 'name' is not empty
  body('description')
    .notEmpty()
    .withMessage('Description is required'), // Ensure 'description' is not empty
  // You can add more validation checks if necessary, for example:
  // body('ownerId').isInt().withMessage('Owner ID must be an integer'),
];
