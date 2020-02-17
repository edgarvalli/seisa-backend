const mssql_stream = require("../databases/mssql_stream");
const mssql = require("../databases/mssql");
const XLSX = require("xlsx");
const path = require("path");

let state = 0;
const oc = {};
const data = [
  [],
  ["Reporte"],
  [],
  [],
  [
    "FECHA",
    "REQUSICION",
    "OC",
    "COMPRA",
    "CUENTA",
    "CONCEPTO",
    "DETALLE",
    "TOTAL",
    "TOTAL PAGADO",
    "ELABORO"
  ]
];
function ObtenerOrdenesCompra(db, segmento, fechaInicial, fechaFinal) {
  //   const result = {};
  const query = `
    select
      mov.CIDMOVIMIENTO as IdMov,doc.CIDDOCUMENTO as IdDoc,doc.CFECHA as Fecha, doc.CFECHAVENCIMIENTO as FechaCompromiso,
      doc.CRAZONSOCIAL as Proveedor,
      CONCAT(doc.CSERIEDOCUMENTO,' ',doc.CFOLIO) as Folio, prod.CCODIGOPRODUCTO as Cuenta,
      prod.CNOMBREPRODUCTO as Concepto, mov.COBSERVAMOV as Detalle,
      CASE
          WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
          WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
          WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
      END AS Total,
      doc.CIDDOCUMENTOORIGEN as Origen, doc.CUSUARIO as Elaboro, mov.CIDMOVTOORIGEN as IdMovOrg, doc.CIDDOCUMENTOORIGEN as IdDocOrg, doc.CTEXTOEXTRA1 as NombreCorto
      from admMovimientos mov
      inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
      inner join admProductos prod on prod.CIDPRODUCTO=mov.CIDPRODUCTO
      inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
      where mov.CSCMOVTO=${segmento} and mov.CIDDOCUMENTODE=17
        and doc.CCANCELADO = 0 and mov.CFECHA between ${fechaInicial} and ${fechaFinal} order by Cuenta;
    `;

  mssql_stream({
    db,
    query,
    onStream: async function(row) {
      try {
        const __row = row;
        // Propiedades de la requisición
        __row.folio_req = "";
        __row.folio_compra = "";
        __row.total_compra = 0;

        oc[row.Folio] = 1;
        console.log(__row);

        const mov_query = `
          select CONCAT(doc.CSERIEDOCUMENTO,' ',doc.CFOLIO) as Folio,
            CASE
                WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
                WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
                WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
            END AS Total
            from admMovimientos mov
            inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
            inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
            where mov.CIDMOVIMIENTO=${__row.IdMovOrg}
        `;

        if (__row.IdMovOrg > 0) {
          const req = await mssql("adSEISA", mov_query);
          __row.folio_req = req.recordset[0].Folio;
        }

        const compra = await mssql("adSEISA", mov_query);
        if (compra.recordset.length > 0) {
          __row.total_compra = compra.recordset[0].Total;
          __row.folio_compra = compra.recordset[0].Folio;
        }

        data.push([
          __row.Fecha,
          __row.folio_req,
          __row.Folio,
          __row.folio_compra,
          __row.Cuenta,
          __row.Concepto,
          __row.Detalle,
          __row.Total,
          __row.total_compra,
          __row.Elaboro
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    onDone: () => main(db, segmento, fechaInicial, fechaFinal),
    onError: error => console.error(error)
  });
}

function ObtenerCompras(db, segmento, fechaInicial, fechaFinal) {
  const query = `
    select
        mov.CIDMOVIMIENTO as IdMov,doc.CIDDOCUMENTO as IdDoc,doc.CFECHA as Fecha, doc.CFECHAVENCIMIENTO as FechaCompromiso,
        doc.CRAZONSOCIAL as Proveedor,
        CONCAT(doc.CSERIEDOCUMENTO,' ',doc.CFOLIO) as Folio, prod.CCODIGOPRODUCTO as Cuenta,
        prod.CNOMBREPRODUCTO as Concepto, mov.COBSERVAMOV as Detalle,
        CASE
            WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
            WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
            WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
        END AS Total,
        CASE
            WHEN doc.CIDDOCUMENTODE=17 THEN 'Orden de Compra'
            WHEN doc.CIDDOCUMENTODE=19 THEN 'Compra'
            WHEN doc.CIDDOCUMENTODE=38 THEN 'Requisicion'
            ELSE 'Otros'
        END AS Documento,
        doc.CIDDOCUMENTOORIGEN as Origen, doc.CUSUARIO as Elaboro, mov.CIDMOVTOORIGEN as IDMovOrg, doc.CIDDOCUMENTOORIGEN as IdDocOrg
    from admMovimientos mov
        inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
        inner join admProductos prod on prod.CIDPRODUCTO=mov.CIDPRODUCTO
        inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
    where mov.CSCMOVTO=${segmento} and mov.CIDDOCUMENTODE=19 and mov.CIDMOVTOORIGEN=0 and doc.CCANCELADO = 0 and mov.CFECHA between ${fechaInicial} and ${fechaFinal}  order by Cuenta;
    `;
  mssql_stream({
    db,
    query,
    onStream: row => {
      try {
        const __row = row;
        // Propiedades de la requisición
        __row.folio_req = "";
        __row.folio_compra = row.Folio;
        __row.total_compra = row.Total;

        __row.Folio = "";
        __row.Total = 0;

        data.push([
          __row.Fecha,
          __row.folio_req,
          __row.Folio,
          __row.folio_compra,
          __row.Cuenta,
          __row.Concepto,
          __row.Detalle,
          __row.Total,
          __row.total_compra,
          __row.Elaboro
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    onDone: () => main(db, segmento, fechaInicial, fechaFinal),
    onError: error => console.error(error)
  });
}

function CrearReporte(name) {
  let date = new Date();
  data[2] = ["Cantidad de Ordenes de Compra: " + Object.keys(oc).length];
  date = date.getFullYear() + date.getMonth() + date.getDate();
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, sheet, "Reporte");
  XLSX.writeFile(
    wb,
    path.resolve(path.join(__dirname, `../temp/${name}.xlsx`))
  );
}

async function main(
  db = "adSEISA",
  segmento = 32,
  fechaInicial = "2019-01-01",
  fechaFinal = "2020-02-20"
) {
  let now = new Date();
  now = now.toLocaleDateString("es-MX");
  const name = `reporte_estado_de_cuentas_${now}`;
  switch (state) {
    case 0:
      console.log("Ordenes de Compra");
      ObtenerOrdenesCompra(db, segmento, fechaInicial, fechaFinal);
      state++;
      break;
    case 1:
      console.log("Compras");
      ObtenerCompras(db, segmento, fechaInicial, fechaFinal);
      state++;
      break;
    default:
      console.log("Creando Reporte");
      CrearReporte(name);
      process.exit();
  }
}

main();
