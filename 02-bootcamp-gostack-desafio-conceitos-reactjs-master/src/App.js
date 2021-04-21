import React, {useState, useEffect} from "react";

import "./styles.css";
import api from "./services/api.js";


function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories([...response.data])
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      url: 'https://github.com/josepholiveira',
      title: 'Desafio ReactJS',
      techs: ['React', 'Node.js'],
    });
    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    
    await api.delete(`repositories/${id}`);

    const newRepositories = repositories.filter(repo => repo.id !== id);

    setRepositories(newRepositories);

  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository, index) => (
          <li key={index}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;

