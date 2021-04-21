const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const repo = {
    id,
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repo);

  return response.status(201).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  

  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid uuid."});
  }

  if(repoIndex < 0){
    return response.status(400).json({error: "Repositorie not found."});
  }

  const likes = repositories[repoIndex].likes;

  const repo = {
    id,
    title,
    url,
    techs,
    likes
  };
  
  repositories[repoIndex] = repo;
  return response.status(200).json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid uuid."});
  }
  if(repoIndex < 0){
    return response.status(400).json({error: "Repositorie not found."});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json({"message": "Removed!"});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid uuid."});
  }
  if(repoIndex < 0){
    return response.status(400).json({error: "Repositorie not found."});
  }

  const {title, url, techs, likes} = repositories[repoIndex];
  const incLikes = likes + 1;

  const repo = {
    id,
    title,
    url,
    techs,
    likes: incLikes
  }

  repositories[repoIndex] = repo;

  return response.status(200).json(repo);

});

module.exports = app;
