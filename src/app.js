import express from "express";
import cors from "cors";


import utilitiesRouter from "./routes/utilities.routes.js";




export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/utilities",utilitiesRouter)



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});