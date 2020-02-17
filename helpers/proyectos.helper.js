const mssql_stream = require("../databases/mssql_stream");
const mssql = require("../databases/mssql");
async function RequisicionOrigen(db, id) {
  try {
    const query = `
            select CONCAT(doc.CSERIEDOCUMENTO, ' ', doc.CFOLIO) as Folio, doc.CFECHA as Fecha
            from admMovimientos mov
            inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
            where mov.CIDMOVIMIENTO = ${id}
        `;
    const result = await mssql(db, query);
    return result.recordset[0];
  } catch (error) {
    console.log(error);
    return {};
  }
}

function PagosOrdenesCompra(db, id) {
  return new Promise(function(resolve, reject) {
    let pagado = 0;
    const query = `
        select
            CASE
                WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
                WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
                WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
            END AS Total
        from admMovimientos as mov
            inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
            inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
        where CIDMOVTOORIGEN = ${id}
    `;
    mssql_stream({
      db,
      query,
      onStream: row => (pagado += row.Total),
      onDone: () => resolve(pagado),
      onError: error => reject(error)
    });
  });
}
module.exports = {
  PagosOrdenesCompra,
  ObtenerOrdenesDeCompraReporte: function(data = [], params = {}) {
    return new Promise(function(resolve, reject) {
      const index = data.length;
      const query = `
        select 
             prod.CCODIGOPRODUCTO as Cuenta,
            prod.CNOMBREPRODUCTO as Concepto, mov.COBSERVAMOV as Detalle,
            doc.CSERIEDOCUMENTO as FolioRequisicion, doc.CFECHA as FechaRequisicion,
            CONCAT(doc.CSERIEDOCUMENTO, ' ', doc.CFOLIO) as FolioOrdenCompra,doc.CFECHA as FechaOrdenDeCompra, doc.CFECHAVENCIMIENTO as FechaOrdeDeCompraCompromiso,
            CASE
                WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
                WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
                WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
            END AS Total,
            doc.CTOTAL as Pagado,
            mov.CIDMOVIMIENTO as Id, mov.CIDMOVTOORIGEN as IdOrigen
        from admMovimientos mov
            inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
            inner join admProductos prod on prod.CIDPRODUCTO=mov.CIDPRODUCTO
            inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
        where mov.cscmovto=${params.segmento} and mov.CIDDOCUMENTODE=17 and doc.CCANCELADO=0 and doc.CFECHA between '${params.fechaInicial}'  and '${params.fechaFinal}';
        `;

      mssql_stream({
        db: params.database || "adSEISA",
        query,
        onStream: async function(row) {
          const req = await RequisicionOrigen(params.database, row.IdOrigen);
          if (req) {
            row.FolioRequisicion = req.Folio;
            row.FechaRequisicion = req.Fecha;
          } else {
            row.FolioRequisicion = "";
            row.FechaRequisicion = "";
          }
          row.Pagado = await PagosOrdenesCompra(params.database, row.Id);
          const values = Object.values(row);
          values.pop();
          values.pop();
          data[index] = Object.keys(row);
          data[index].pop();
          data[index].pop();
          data.push(values);
        },
        onDone: () => resolve(data),
        onError: error => reject(error)
      });
    });
  },
  ObtenerComprasReporte: function(data = [], params = {}) {
    return new Promise(function(resolve, reject) {
      const index = data.length;
      const query = `
          select
            doc.CFECHA as Fecha,
            CONCAT(doc.CSERIEDOCUMENTO, ' ', doc.CFOLIO) as Folio,
            prod.CCODIGOPRODUCTO as Cuenta,
            prod.CNOMBREPRODUCTO as Concepto, mov.COBSERVAMOV as Detalle,
            CASE
                WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
                WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
                WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
            END AS Total
          from admMovimientos mov
              inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
              inner join admProductos prod on prod.CIDPRODUCTO=mov.CIDPRODUCTO
              inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
          where mov.cscmovto=${params.segmento} and mov.CIDDOCUMENTODE=19 and doc.CCANCELADO=0 and mov.CIDMOVTOORIGEN <= 0 and doc.CFECHA between '${params.fechaInicial}'  and '${params.fechaFinal}';
          `;

      mssql_stream({
        db: params.database || "adSEISA",
        query,
        onStream: async function(row) {
          const values = Object.values(row);
          data[index] = Object.keys(row);
          data.push(values);
        },
        onDone: () => resolve(data),
        onError: error => reject(error)
      });
    });
  }
};
