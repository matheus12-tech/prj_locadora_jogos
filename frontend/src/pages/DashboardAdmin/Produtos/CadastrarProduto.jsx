import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000"; // porta do backend

export default function CadastrarProduto() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [produtoForm, setProdutoForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    categoriaId: "",
  });
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

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

  // Função para cadastrar produto
  const cadastrarProduto = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para cadastrar produtos!");
      navigate("/login");
      return;
    }

    try {
      // 🔹 Monta o FormData para enviar arquivos
      const formData = new FormData();
      formData.append("nome_produto", produtoForm.nome);
      formData.append("descricao", produtoForm.descricao);
      formData.append("preco", produtoForm.preco);
      formData.append("estoque", produtoForm.estoque);
      formData.append("categoria_id", produtoForm.categoriaId);
      if (imagem) formData.append("imagem", imagem);

      await axios.post(`${BASE_URL}/produtos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Produto cadastrado com sucesso!");

      setProdutoForm({
        nome: "",
        descricao: "",
        preco: "",
        estoque: "",
        categoriaId: "",
      });
      setImagem(null);
      setPreview(null);

      navigate("/loja");
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      alert(
        "Erro: " + (err.response?.data?.error || "Falha ao cadastrar produto")
      );
    }
  };

  // Preview da imagem antes de enviar
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

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

        {/* Campo de upload de imagem */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImagemChange}
          style={inputStyle}
        />

        {preview && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <img
              src={preview}
              alt="Preview"
              width={250}
              style={imgPreviewStyle}
            />
          </div>
        )}

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

// ----------------- ESTILOS -----------------
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
