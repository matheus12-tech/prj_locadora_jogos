import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // ajuste a porta se necessário

export async function loginUser(email, senha) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    return response.data; // { message, token, role, nome }
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error('Erro de conexão com o servidor.');
    }
  }
}

export async function cadastroUser(nome, email, senha) {
  try {
    const response = await axios.post(`${API_URL}/cadastro`, { nome, email, senha });
    return response.data; // { message }
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error('Erro de conexão com o servidor.');
    }
  }
}