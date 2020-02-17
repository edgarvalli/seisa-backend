Declare @lFechaIni as datetime;
Declare @lFechaFin as datetime;
Declare @lDelProducto as char(30);
Declare @lAlProducto as char(30);
Declare @AlmacenIni as char(30);
Declare @AlmacenFin as char(30);
Declare @StatusProducto as int;
Declare @Unidad as int;
Declare @IdUnidad as int;
Declare @IdMoneda as int;
Declare @idEjercicio as int;
set @lFechaIni = '20190101';
set @lFechaFin = '20190131';
set @lDelProducto = '0001';
set @lAlProducto = 'SP9-9';
set @AlmacenIni = '00';
set @AlmacenFin = '00';
set @Unidad = 0;
set @IdUnidad = 0;
set @idEjercicio = 10;
SELECT prod.cIdProducto, prod.cCodigoProducto, prod.cNombreProducto, prod.cIdUnidadBase, prod.cIdUnidadNoConvertible, prod.cStatusProducto, prod.cMetodoCosteo, prod.cCostoEstandar, prod.cErrorCosto, prod.cFechaErrorCosto, prod.cIdUnidadCompra, prod.cIdUnidadVenta, alm.cCodigoAlmacen as almCodigoAlmacen, alm.cNombreAlmacen, ROUND(ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 1 THEN cUnidades ELSE 0 END ) - SUM(CASE WHEN cAfectaExistencia = 2 THEN  cUnidades ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha < @lFechaIni AND cAfectadoInventario <> 0), 0.0),5,0) AS cUnidades, ISNULL((SELECT SUM(CASE cAfectaExistencia  WHEN 1 THEN cUnidadesNC ELSE 0 END) - SUM(CASE cAfectaExistencia WHEN 2 THEN cUnidadesNC ELSE 0 END)
    FROM admMovimientos movto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND cIdProducto = prod.cIdProducto AND movto.cFecha < @lFechaIni AND cAfectadoInventario <> 0 ), 0.0) AS cUnidadesNC, ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 1 THEN cUnidades ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0 ), 0.0) AS cEntradas, ISNULL((SELECT SUM(CASE cAfectaExistencia WHEN 1 THEN cUnidadesNC ELSE 0 END)
    FROM admMovimientos movto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0             ), 0.0) AS cEntradasNC, ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 2 THEN cUnidades ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0             ), 0.0) AS cSalidas, ISNULL((SELECT SUM(CASE cAfectaExistencia WHEN 2 THEN cUnidadesNC ELSE 0 END)
    FROM admMovimientos movto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0             ), 0.0) AS cSalidasNC, ROUND(ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 1 THEN cCostoEspecifico ELSE 0 END ) - SUM(CASE WHEN cAfectaExistencia = 2 THEN  cCostoEspecifico ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha < @lFechaIni AND cAfectadoInventario <> 0 ), 0.0),2,0) AS cCostoEspecifico, ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 1 THEN cCostoEspecifico ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0 ), 0.0) AS cCostoEntradas, ISNULL((SELECT SUM(CASE WHEN cAfectaExistencia = 2 THEN cCostoEspecifico ELSE 0 END )
    FROM admMovimientos AS Movto LEFT JOIN admProductos p ON Movto.cIdProducto = p.cIdProducto
    WHERE movto.cIdAlmacen=alm.cIdAlmacen AND movto.cIdProducto = prod.cIdProducto AND movto.cFecha >= @lFechaIni AND movto.cFecha <= @lFechaFIn AND cAfectadoInventario <> 0), 0.0) AS cCostoSalidas, ISNULL((SELECT TOP 1
        c.cUltimoCostoH
    FROM admCostosHistoricos c
    WHERE c.cIdProducto = prod.cIdProducto AND c.cIdAlmacen = 0 AND c.cFechaCostoH <= @lFechaFin
    order by c.CFECHACOSTOH desc),0) as impUltimoCosto, ISNULL(unid.cDespliegue, '') AS cDespliegue, 1 AS cFactorConversion
FROM admAlmacenes alm, admProductos AS prod LEFT JOIN admUnidadesMedidaPeso unid ON unid.cIdUnidad = prod.cIdUnidadBase
WHERE rTrim (ltrim(prod.cCodigoProducto)) between @lDelProducto and @lAlProducto and rTrim
(ltrim(alm.cCodigoAlmacen)) between @AlmacenIni and @AlmacenFin and prod.cTipoProducto = 1
ORDER BY almCodigoAlmacen, prod.cCodigoProducto