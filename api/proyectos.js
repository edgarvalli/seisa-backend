const express = require("express");
const router = express.Router();
const model = require("../models/proyectos.model");

router.get("/lista", async function(_, res) {
  try {
    const data = await model.ProyectosDBCompac("adSEISA");
    res.json({
      error: false,
      data
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/cuentas", async function(req, res) {
  try {
    const { projectCode, projectId } = req.query;
    const data = await model.Cuentas(projectId, projectCode);
    res.json({
      error: false,
      data
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/subcuentas", async function(req, res) {
  try {
    const { code = "SP1", segmento = 1, idCuenta = 1 } = req.query;
    const data = await model.SubCuentas("adSEISA", code, segmento, idCuenta);
    res.json({
      error: false,
      data
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/otras-cuentas", async function(req, res) {
  try {
    const { code = "SP", segmento = 74 } = req.query;
    const data = await model.TotalOtrosCuentas("adSEISA", code, segmento);
    res.json({
      error: false,
      data
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/detalle-cuentas", async function(req, res) {
  try {
    const { cuenta = "SP", segmento = 74, otros = "not" } = req.query;
    const data = await model.DetalleCuentas(
      "adSEISA",
      segmento,
      cuenta,
      otros === "ok" ? true : false
    );
    res.json({
      error: false,
      data
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/tiene-presupuesto", async function(req, res) {
  try {
    const { cuenta = "SP11-1", segmento = 74, idCuentaPadre = 11 } = req.query;
    const data = await model.TienePresupuesto(segmento, idCuentaPadre, cuenta);
    res.json({ error: false, data });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.post("/agregar-presupuesto", async function(req, res) {
  try {
    const {
      existe = false,
      idCuentaPadre,
      cuenta,
      segmento,
      id,
      total
    } = req.body;
    const result = await model.AgregarPresupuesto(
      existe,
      idCuentaPadre,
      cuenta,
      segmento,
      total,
      id
    );

    res.json({
      error: false,
      data: [],
      inserted: result
    });
  } catch (message) {
    res.json({
      error: true,
      message
    });
  }
});

router.get("/estado-cuentas", async function(req, res) {
  const { segmento, fechaInicial, fechaFinal, proyecto } = req.query;
  const errorHandle = message => res.json({ error: true, message });
  if (!segmento) errorHandle("Debe defninir el segmento");
  if (!fechaInicial) errorHandle("Debe definir la fecha inicial");
  if (!fechaFinal) errorHandle("Debe definir la fecha final");
  if (fechaFinal < fechaInicial)
    errorHandle("La fecha inicial debe ser menor a la final");

  const data = await model.EstadoCuentas(
    "adSEISA",
    segmento,
    proyecto || "",
    fechaInicial,
    fechaFinal
  );
  res.json({ data });
});

router.get("/reporte/:name", function(req, res) {
  const { name } = req.params;
  const path = require("path");
  res.sendFile(path.join(__dirname, `../temp/${name}.xlsx`))
})

module.exports = router;
