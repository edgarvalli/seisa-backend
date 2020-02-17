const path = require("path");
const mssql_stream = require("../databases/mssql_stream");
const mysql_stream = require("../databases/mysql_stream");
const mysql = require("../databases/mysql");
const mssql = require("../databases/mssql");
const helper = require("../helpers/proyectos.helper");

const queryReportBuilder = (Segmento, FechaInicial, FechaFinal) => {
  return `
    select
        doc.CIDDOCUMENTO, doc.CSERIEDOCUMENTO, doc.CFOLIO, doc.CFECHA, doc.CRAZONSOCIAL, doc.CRFC, doc.CNETO as DOCNETO, doc.CIMPUESTO1,doc.CTOTAL as DOCTOTAL,
        prod.CCODIGOPRODUCTO, prod.CNOMBREPRODUCTO, mov.COBSERVAMOV, mov.CUNIDADESCAPTURADAS, mov.CPRECIOCAPTURADO, mov.CNETO, doc.CIDMONEDA, tp.CIMPORTE as TPUSD,
        mov.CIDDOCUMENTODE, doc.CIDDOCUMENTOORIGEN
    from admMovimientos as mov
    inner join admProductos as prod on mov.CIDPRODUCTO = prod.CIDPRODUCTO
    inner join admDocumentos as doc on doc.CIDDOCUMENTO = mov.CIDDOCUMENTO
    inner join admTiposCambio as tp on doc.CFECHA = tp.CFECHA and tp.CIDMONEDA = 2
    where
      mov.CSCMOVTO=${Segmento} and mov.CIDDOCUMENTODE=17 and mov.CFECHA between  '${FechaInicial}' and '${FechaFinal}'
    or
      mov.CSCMOVTO=${Segmento} and mov.CIDDOCUMENTODE=19 and mov.CFECHA between  '${FechaInicial}' and '${FechaFinal}'
    order by prod.CNOMBREPRODUCTO;
    `;
};
async function PresupuestoCuenta(segmento, id_cuenta_padre, cuenta = "not") {
  try {
    let query = "select sum(total) as total from seisaproyectos.movimientos ";
    query += "where segmento=" + segmento + " and ";
    query += "id_cuenta_padre=" + id_cuenta_padre;
    if (cuenta !== "not") query += ` and cuenta = '${cuenta}'`;
    const t = await mysql.query(query);
    let total = t[0].total;
    if (total === null) total = 0.0;
    return total;
  } catch (error) {
    return error;
  }
}

function TotalOrdenesCompra(segmento, cuenta) {
  return new Promise(function(resolve, reject) {
    let total = 0;
    const query = `
      select
        CASE
          WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
          WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
          WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
        END AS Total
      from admMovimientos mov
        inner join admProductos prod on prod.CIDPRODUCTO = mov.CIDPRODUCTO
        inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
        inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
      where mov.CSCMOVTO=${segmento} and prod.CCODIGOPRODUCTO like '${cuenta}' and mov.CIDDOCUMENTODE=17 and doc.CCANCELADO=0;
    `;
    mssql_stream({
      db: "adSEISA",
      query,
      onStream: async row => {
        total += row.Total;
      },
      onDone: () => resolve(total),
      onError: error => reject(error)
    });
  });
}

function TotalOtros(db, segmento, cuenta) {
  return new Promise(function(resolve, reject) {
    let total = 0;
    const query = `
      select
        CASE
          WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
          WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
          WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
        END AS Total
      from admMovimientos mov
        inner join admProductos prod on prod.CIDPRODUCTO = mov.CIDPRODUCTO
        inner join admDocumentos doc on mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
        inner join admTiposCambio tp on tp.CIDMONEDA=2 and tp.CFECHA=mov.CFECHA
      where mov.CSCMOVTO=${segmento} and prod.CCODIGOPRODUCTO not like '${cuenta}' and mov.CIDDOCUMENTODE=17 and doc.CCANCELADO=0;
    `;
    mssql_stream({
      db,
      query,
      onStream: async row => {
        total += row.Total;
      },
      onDone: () => resolve(total),
      onError: error => reject(error)
    });
  });
}

module.exports = {
  ReporteEstadoCuentas(db, Segmento, FechaInicial, FechaFinal) {
    return new Promise(function(complete, reject) {
      const XLSX = require("xlsx");
      //let index = 0;
      const title = `Reporte Generado ${
        new Date()
          .toISOString()
          .replace("T", " a las ")
          .split(".")[0]
      }`;
      const subtitle = `Fecha de ${FechaInicial} a ${FechaFinal}`;
      const sheet_1_data = [[""], [title], [subtitle], [""]];
      const sheet_2_data = [[""], [title], [subtitle], [""]];
      const sheet_3_data = [[""], [title], [subtitle], [""]];
      const resumen = {};

      const sheet2_header = [];
      sheet2_header[0] = "Codigo";
      sheet2_header[1] = "O.C.";
      sheet2_header[2] = "Fecha";
      sheet2_header[3] = "Proveedor";
      sheet2_header[4] = "RFC";
      sheet2_header[5] = "Cuenta";
      sheet2_header[6] = "Detalle";
      sheet2_header[7] = "Cantidad";
      sheet2_header[8] = "Precio MXN";
      sheet2_header[9] = "Total MXN";
      sheet2_header[10] = "Precio USD";
      sheet2_header[11] = "Total USD";

      const sheet1_header = [];
      sheet1_header[0] = "Codigo";
      sheet1_header[1] = "Concepto";
      sheet1_header[2] = "Total MXN";
      sheet1_header[3] = "Total USD";

      sheet_1_data.push(sheet1_header);

      sheet_2_data.push(sheet2_header);
      sheet2_header[1] = "Folio";
      sheet_3_data.push(sheet2_header);
      const wb = XLSX.utils.book_new();

      mssql_stream({
        query: queryReportBuilder(Segmento, FechaInicial, FechaFinal),
        db,
        onStream: async function(row) {
          //index++;
          const folio = row.CCODIGOPRODUCTO;
          let usd = row.CPRECIOCAPTURADO;
          let mxn = row.CPRECIOCAPTURADO;
          switch (row.CIDMONEDA) {
            case 1:
              usd = usd / row.TPUSD;
              break;
            case 2:
              mxn = mxn * row.TPUSD;
              break;
          }

          if (resumen[folio]) {
            resumen[folio].usd += usd * row.CUNIDADESCAPTURADAS;
            resumen[folio].mxn += mxn * row.CUNIDADESCAPTURADAS;
          } else {
            resumen[folio] = {};
            resumen[folio].folio = folio;
            resumen[folio].concepto = row.CNOMBREPRODUCTO;
            resumen[folio].usd = usd * row.CUNIDADESCAPTURADAS;
            resumen[folio].mxn = mxn * row.CUNIDADESCAPTURADAS;
          }

          if (row.CIDDOCUMENTODE === 17) {
            sheet_2_data.push([
              row.CCODIGOPRODUCTO,
              row.CSERIEDOCUMENTO + " " + row.CFOLIO,
              row.CFECHA,
              row.CRAZONSOCIAL,
              row.CRFC,
              row.CNOMBREPRODUCTO,
              row.COBSERVAMOV,
              row.CUNIDADESCAPTURADAS,
              mxn,
              mxn * row.CUNIDADESCAPTURADAS,
              usd,
              usd * row.CUNIDADESCAPTURADAS
            ]);
          } else {
            if (row.CIDDOCUMENTOORIGEN > 0) {
              const OC = await mssql(
                db,
                `select * from admDocumentos where CIDDOCUMENTO=${row.CIDDOCUMENTOORIGEN}`
              );
              console.log(OC);
            }
            sheet_3_data.push([
              row.CCODIGOPRODUCTO,
              row.CSERIEDOCUMENTO + " " + row.CFOLIO,
              row.CFECHA,
              row.CRAZONSOCIAL,
              row.CRFC,
              row.CNOMBREPRODUCTO,
              row.COBSERVAMOV,
              row.CUNIDADESCAPTURADAS,
              mxn,
              mxn * row.CUNIDADESCAPTURADAS,
              usd,
              usd * row.CUNIDADESCAPTURADAS,
              row.CIDDOCUMENTOORIGEN
            ]);
          }
        },
        onError: function(error) {
          reject(error);
        },
        onDone: function() {
          //console.log(index);

          for (let folio in resumen) {
            sheet_1_data.push([
              resumen[folio].folio,
              resumen[folio].concepto,
              resumen[folio].mxn,
              resumen[folio].usd
            ]);
          }

          const ws1 = XLSX.utils.aoa_to_sheet(sheet_1_data);
          const ws2 = XLSX.utils.aoa_to_sheet(sheet_2_data);
          const ws3 = XLSX.utils.aoa_to_sheet(sheet_3_data);
          XLSX.utils.book_append_sheet(wb, ws1, "Resumen");
          XLSX.utils.book_append_sheet(wb, ws2, "OC");
          XLSX.utils.book_append_sheet(wb, ws3, "Compras");
          XLSX.writeFile(
            wb,
            path.resolve(
              path.join(__dirname, "../temp/reporte_estado_de_cuentas.xlsx")
            )
          );
          complete(true);
        }
      });
    });
  },
  EstadoCuentas(database, segmento, proyecto, fechaInicial, fechaFinal) {
    return new Promise(async function(resolve, reject) {
      try {
        const XLSX = require("xlsx");
        const path = require("path");
        const wb = XLSX.utils.book_new();
        const now = new Date();
        const name = `reporte_${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const ordenesCompraData = await helper.ObtenerOrdenesDeCompraReporte(
          [
            [""],
            ["Reporte de Ordenes de Compra | " + proyecto.toUpperCase()],
            [""]
          ],
          {
            database,
            segmento,
            fechaInicial,
            fechaFinal
          }
        );
        const compraData = await helper.ObtenerComprasReporte(
          [[""], ["Reporte de Compras | " + proyecto.toUpperCase()], [""]],
          {
            database,
            segmento,
            fechaInicial,
            fechaFinal
          }
        );
        const sheet1 = XLSX.utils.aoa_to_sheet(ordenesCompraData);
        const sheet2 = XLSX.utils.aoa_to_sheet(compraData);
        XLSX.utils.book_append_sheet(wb, sheet1, "OC");
        XLSX.utils.book_append_sheet(wb, sheet2, "Compras sin OC");
        XLSX.writeFile(
          wb,
          path.resolve(path.join(__dirname, `../temp/${name}.xlsx`))
        );
        resolve(name);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  },
  ProyectosDBCompac: function(db) {
    return new Promise(function(resolve, reject) {
      const proyectos = [];
      mssql_stream({
        db,
        query:
          "select * from admProyectos where cidproyecto > 0 order by CFECHAALTA;",
        onStream: row => proyectos.push(row),
        onDone: () => resolve(proyectos),
        onError: error => reject(error)
      });
    });
  },
  Cuentas(segmento) {
    return new Promise(function(resolve, reject) {
      const cuentas = [];
      mysql_stream({
        db: "seisaproyectos",
        query: "select * from cuentas",
        onStream: async row => {
          row.presupuesto = await PresupuestoCuenta(segmento, row.id);
          row.ordenesCompra = await TotalOrdenesCompra(
            projectCode,
            `${row.code}-%`
          );
          cuentas.push(row);
        },
        onEnd: () => resolve(cuentas),
        onError: error => reject(error)
      });
    });
  },
  SubCuentas(db, code, segmento, id_cuenta) {
    return new Promise(function(resolve, reject) {
      const subcuentas = [];
      mssql_stream({
        db,
        query: `
          select
            CIDPRODUCTO as id, CCODIGOPRODUCTO as codigo,CNOMBREPRODUCTO as nombre from admProductos
          where CCODIGOPRODUCTO like '${code}-%'
        `,
        onStream: async row => {
          try {
            row.ordenesCompra = await TotalOrdenesCompra(segmento, row.codigo);
            row.presupuesto = await PresupuestoCuenta(
              segmento,
              id_cuenta,
              row.codigo
            );
            subcuentas.push(row);
          } catch (ex) {
            console.log(ex);
          }
        },
        onDone: () => resolve(subcuentas),
        onError: error => reject(error)
      });
    });
  },
  DetalleCuentas(db, segmento, cuenta, otros = false) {
    return new Promise(async function(resolve, reject) {
      const query = `
        select 
          mov.CIDMOVIMIENTO Id,
          CONCAT(doc.CSERIEDOCUMENTO, ' ', doc.CFOLIO) as Folio,
          prod.CCODIGOPRODUCTO Cuenta,
          prod.CNOMBREPRODUCTO Nombre,
          mov.COBSERVAMOV Descripcion,
          CASE
            WHEN doc.CIDMONEDA=1 THEN ROUND(mov.CNETO/tp.CIMPORTE, 2)
                WHEN doc.CIDMONEDA=2 THEN ROUND(mov.CNETO,2)
                WHEN doc.CIDMONEDA=3 THEN ROUND((mov.CNETO * doc.CTIPOCAMBIO)/ tp.CIMPORTE, 2)
          END AS Total
        from admMovimientos mov
          inner join admTiposCambio as tp on tp.CIDMONEDA = 2 and tp.CFECHA = mov.CFECHA
          inner join admDocumentos doc on mov.CIDDOCUMENTO = doc.CIDDOCUMENTO
          inner join admProductos prod on mov.CIDPRODUCTO = prod.CIDPRODUCTO
        where
          mov.CSCMOVTO = ${segmento}
          and mov.CIDDOCUMENTODE=17
          and (prod.CCODIGOPRODUCTO ${
            otros ? "not like" : "like"
          } '${cuenta}%' or mov.CTEXTOEXTRA3 ${
        otros ? "not like" : "like"
      } '${cuenta}SP%');
      `;

      const data = [];

      mssql_stream({
        db,
        query,
        onStream: async row => data.push(row),
        onDone: () => resolve(data),
        onError: error => reject(error)
      });
    });
  },
  TotalOtrosCuentas(db, cuenta, segmento) {
    return new Promise(async function(resolve, reject) {
      const total = await TotalOtros(db, segmento, cuenta).catch(error =>
        reject(error)
      );

      resolve(total);
    });
  },
  TienePresupuesto(segmento, id_cuenta_padre, cuenta) {
    return new Promise(async function(resolve, reject) {
      try {
        const result = await mysql.query(
          `select * from seisaproyectos.movimientos where segmento=${segmento} and id_cuenta_padre=${id_cuenta_padre} and cuenta='${cuenta}'`
        );
        if (result.length > 0) {
          resolve({ exist: true, id: result[0].id });
        } else {
          resolve({ exist: false, id: 0 });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  AgregarPresupuesto(
    existe = false,
    idCuentaPadre,
    cuenta,
    segmento,
    total,
    id
  ) {
    return new Promise(async function(resolve, reject) {
      try {
        let query = null;
        if (existe) {
          query = `update seisaproyectos.movimientos set total=${total} where id=${id}`;
        } else {
          query = `insert into seisaproyectos.movimientos (id_cuenta_padre,segmento,cuenta,total) values (${idCuentaPadre}, ${segmento},'${cuenta}', ${total})`;
        }
        await mysql.query(query);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }
};
