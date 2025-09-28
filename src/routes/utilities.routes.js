import {Router} from "express";
import { commonUtilitiesInit, gasesDelCaribeInit } from "../services/puppeter.js";

const router = Router();

router.get("/", async(_, res) => {

  const aaa = await commonUtilitiesInit("https://gp.aaa.com.co/login");
  const aire = await commonUtilitiesInit("https://caribesol.facture.co/Login?returnurl=%2fMis-Facturas%2fListado-de-Facturas#/List");
  const gasesDelCaribe = await gasesDelCaribeInit("https://portal.gascaribe.com/");
  res.status(200).json({
     aire,
    tripleA:aaa,
    gasesDelCaribe
  });
});


export default router;