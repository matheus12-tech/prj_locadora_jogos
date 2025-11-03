import axios from "axios";

const BASE_URL = "http://localhost:3000";

export async function listarCategorias() {
  try {
    const res = await axios.get(`${BASE_URL}/categoria`);
    return res.data;
  } catch (err) {
    console.error("Erro ao listar categorias:", err);
    return [];
  }
}