const express = require("express");
const cors = require("cors");

const { uuid,  isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const techs = [];
let countLikes = 0;

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository Id."})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repositorie);
  
  return response.status(200).json(repositorie);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found"});
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repoIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found"});
  }

  repositories.splice(repoIndex, 1);

  return response.send(204);
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);  

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found"});
  }

  const { title, url, techs, likes } = repositories[repoIndex];

  countLikes = likes + 1;

  repositories[repoIndex].likes = countLikes;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
