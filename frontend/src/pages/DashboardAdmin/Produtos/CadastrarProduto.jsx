import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000"; // Certifique-se que o backend está nessa porta

export default function CadastrarProduto() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [produtoForm, setProdutoForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    imagem: "",
    categoriaId: "",
  });

  // Buscar categorias
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categoria`);
        setCategorias(res.data);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        alert("Erro ao carregar categorias");
      }
    };
    buscarCategorias();
  }, []);

  // Função para cadastrar produto (com token)
  const cadastrarProduto = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para cadastrar produtos!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/produtos`,
        {
          nome_produto: produtoForm.nome,
          descricao: produtoForm.descricao,
          preco: parseFloat(produtoForm.preco),
          estoque: parseInt(produtoForm.estoque),
          imagem: produtoForm.imagem || "https://placehold.co/250x150",
          categoria_id: parseInt(produtoForm.categoriaId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔑 ENVIA TOKEN JWT
          },
        }
      );

      alert("✅ Produto cadastrado com sucesso!");

      setProdutoForm({
        nome: "",
        descricao: "",
        preco: "",
        estoque: "",
        imagem: "",
        categoriaId: "",
      });

      navigate("/loja");
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      alert(
        "Erro: " + (err.response?.data?.error || "Falha ao cadastrar produto")
      );
    }
  };

  const imagemPreview =
    produtoForm.imagem || "https://placehold.co/250x150?text=Preview";

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#6C5CE7" }}>Cadastrar Produto</h1>

      <form onSubmit={cadastrarProduto} style={formStyle}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={produtoForm.nome}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, nome: e.target.value })
          }
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Descrição"
          value={produtoForm.descricao}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, descricao: e.target.value })
          }
          style={{ ...inputStyle, height: "80px" }}
        />

        <input
          type="number"
          placeholder="Preço"
          value={produtoForm.preco}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, preco: e.target.value })
          }
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Estoque"
          value={produtoForm.estoque}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, estoque: e.target.value })
          }
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="URL da imagem"
          value={produtoForm.imagem}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, imagem: e.target.value })
          }
          style={inputStyle}
        />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <img src={imagemPreview} alt="Preview" width={250} style={imgPreviewStyle} />
        </div>

        <select
          value={produtoForm.categoriaId}
          onChange={(e) =>
            setProdutoForm({ ...produtoForm, categoriaId: e.target.value })
          }
          required
          style={inputStyle}
        >
          <option value="">Selecione a categoria</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>
              {c.nome_categoria}
            </option>
          ))}
        </select>

        <button type="submit" style={btnStyle}>
          Cadastrar Produto
        </button>

        <button
          type="button"
          onClick={() => navigate("/loja")}
          style={btnVoltarStyle}
        >
          Voltar à Loja
        </button>
      </form>
    </div>
  );
}

// Estilos
const containerStyle = {
  backgroundColor: "#1B1E29",
  color: "white",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
};

const formStyle = {
  background: "#171A21",
  padding: "2rem",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle = {
  background: "#1B1E29",
  color: "white",
  border: "1px solid #6C5CE7",
  borderRadius: "8px",
  padding: "0.7rem",
  outline: "none",
};

const btnStyle = {
  background: "#6C5CE7",
  color: "white",
  border: "none",
  padding: "0.8rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
};

const btnVoltarStyle = {
  background: "transparent",
  color: "#A0A0A0",
  border: "1px solid #6C5CE7",
  padding: "0.6rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const imgPreviewStyle = {
  borderRadius: "8px",
  border: "1px solid #6C5CE7",
};
