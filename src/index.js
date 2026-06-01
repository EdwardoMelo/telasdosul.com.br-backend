const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRouter");
const subCategoryRoutes = require('./routes/subCategoryRouter');
const variationRoutes = require('./routes/variationRoutes');
const priceLineRoutes = require('./routes/priceLineRoutes');
const userTypeRouter = require('./routes/userTypeRouter'); // Adjust path as needed
const contactRouter = require('./routes/contactRouter'); // Adjust path as needed
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());


const morgan = require("morgan");
const prisma = require("./prisma/client");
(async () => {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    console.log("Conex o com o banco de dados realizada com sucesso!");
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ");
    console.error(error);
  }
})();
app.use(express.json());
app.use(morgan('dev')); // Outras opções: 'dev', 'short', 'tiny'
app.use("/usuarios", userRoutes);
app.use('/tipos_usuarios', userTypeRouter); // Mount the router
app.use("/contato", contactRouter);
app.use("/variacoes-produto", variationRoutes);
app.use("/linhas-preco", priceLineRoutes);
app.use("/produtos", productRoutes);
app.use("/categorias", categoryRoutes)
app.use("/subcategorias", subCategoryRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app
