import bcrypt from "bcrypt";

const senha = "senha123"; // a senha que você quer para o admin

(async () => {
  const hash = await bcrypt.hash(senha, 10);
  console.log("Hash da senha:", hash);
})();
