(this["webpackJsonpseisa-project"]=this["webpackJsonpseisa-project"]||[]).push([[6],{119:function(e,t,a){"use strict";var r=a(118),n=a.n(r),s="/api/proyectos";t.a={headers:{method:"get",headers:{Accept:"application/json","Content-Type":"application/json"}},get:function(e){var t,a;return n.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="get",r.next=5,n.a.awrap(fetch(s+e,this.headers));case 5:if((t=r.sent).ok){r.next=8;break}return r.abrupt("return",{error:!0,message:t.statusText});case 8:return r.next=10,n.a.awrap(t.json());case 10:return a=r.sent,r.abrupt("return",a);case 14:return r.prev=14,r.t0=r.catch(0),r.abrupt("return",{error:!0,message:r.t0});case 17:case"end":return r.stop()}}),null,this,[[0,14]])},post:function(e){var t,a,r,o=arguments;return n.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},c.prev=1,this.headers.body=JSON.stringify(t),this.headers.method="post",c.next=6,n.a.awrap(fetch(s+e,this.headers));case 6:if((a=c.sent).ok){c.next=9;break}return c.abrupt("return",{error:!0,message:a.statusText});case 9:return c.next=11,n.a.awrap(a.json());case 11:return r=c.sent,c.abrupt("return",r);case 15:return c.prev=15,c.t0=c.catch(1),c.abrupt("return",{error:!0,message:c.t0});case 18:case"end":return c.stop()}}),null,this,[[1,15]])},delete:function(e){var t,a;return n.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="delete",r.next=5,n.a.awrap(fetch(s+e,this.headers));case 5:if((t=r.sent).ok){r.next=8;break}return r.abrupt("return",{error:!0,message:t.statusText});case 8:return r.next=10,n.a.awrap(t.json());case 10:return a=r.sent,r.abrupt("return",a);case 14:return r.prev=14,r.t0=r.catch(0),r.abrupt("return",{error:!0,message:r.t0});case 17:case"end":return r.stop()}}),null,this,[[0,14]])}}},60:function(e,t,a){"use strict";a.r(t);var r=a(118),n=a.n(r),s=a(32),o=a(33),c=a(36),u=a(34),l=a(37),i=a(0),p=a.n(i),m=a(79),d=a(28),h=a(150),g=a(151),f=a(152),v=a(153),E=a(154),j=a(80),b=a(109),x=a(119),y=a(35),w=a(38),C=function(e){var t=e.items,a=void 0===t?[]:t,r=e.renderItem;return a.map(r)},k=[{view:"Proyectos",label:"Proyectos"},{view:"EditarProyecto",label:"Edici\xf3n"}],O=function(e){function t(){var e,a;Object(s.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).params=a.props.navigation.params(),a.state={cuentas:[],others:0,showLoader:!0},a}return Object(l.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){this.GetCategories()}},{key:"GetCategories",value:function(){var e,t;return n.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e={cuentas:[],others:1,showLoader:!1},console.log(this.params),a.next=4,n.a.awrap(x.a.get("/cuentas?projectId=".concat(this.params.projectId,"&projectCode=").concat(this.params.projectCode)));case 4:if(!(t=a.sent).error){a.next=10;break}return alert("Favor de revisar error en la consola"),console.log(t.message),this.setState({showLoader:!1}),a.abrupt("return");case 10:return e.cuentas=t.data,a.next=13,n.a.awrap(x.a.get("/otras-cuentas?segmento=".concat(this.params.projectCode)));case 13:if(!(t=a.sent).error){a.next=19;break}return alert("Favor de revisar error en la consola"),console.log(t.message),this.setState({showLoader:!1}),a.abrupt("return");case 19:e.others=t.data,this.setState(e);case 21:case"end":return a.stop()}}),null,this)}},{key:"render",value:function(){var e=this,t=this.state,a=t.showLoader,r=t.cuentas;return p.a.createElement(p.a.Fragment,null,p.a.createElement(y.a,{show:a}),p.a.createElement(w.a,{options:k,onClick:function(t){return e.props.navigation.go(t)}}),p.a.createElement(m.a,{container:!0},p.a.createElement(m.a,{item:!0,sm:12},p.a.createElement(d.a,null,"Proyecto ",this.params.projectCode," - ",this.params.projectName)),p.a.createElement(h.a,null,p.a.createElement(g.a,null,p.a.createElement(f.a,null,p.a.createElement(v.a,null,"Codigo"),p.a.createElement(v.a,null,"Nombre"),p.a.createElement(v.a,null,"Presupuesto"),p.a.createElement(v.a,null,"Ordenes de Compra"),p.a.createElement(v.a,null,"Resta"),p.a.createElement(v.a,null,"Acciones"))),p.a.createElement(E.a,null,p.a.createElement(C,{items:r,renderItem:function(t){return p.a.createElement(f.a,{key:t.id},p.a.createElement(v.a,null,t.code),p.a.createElement(v.a,null,t.name),p.a.createElement(v.a,null,"$",t.presupuesto.toLocaleString("es-Mx",{maximumFractionDigits:2})),p.a.createElement(v.a,null,"$",t.ordenesCompra.toLocaleString("es-Mx",{maximumFractionDigits:2})),p.a.createElement(v.a,null,"$",(t.presupuesto-t.ordenesCompra).toLocaleString("es-Mx",{maximumFractionDigits:2})),p.a.createElement(v.a,null,p.a.createElement(j.a,{onClick:function(){return e.props.navigation.go("Subcuentas",{projectId:e.params.projectId,projectCode:e.params.projectCode,projectName:e.params.projectName,accountCode:t.code,accountId:t.id})}},p.a.createElement(b.a,null,"format_align_justify"))))}}),p.a.createElement(f.a,null,p.a.createElement(v.a,null,"Otros"),p.a.createElement(v.a,null,"OTROS"),p.a.createElement(v.a,{colSpan:3},this.state.others.toLocaleString("es-Mx",{maximumFractionDigits:2})),p.a.createElement(v.a,null,p.a.createElement(j.a,{onClick:function(){return e.props.navigation.go("DetalleCuentasOtros",{others:!0,projectId:e.params.projectId,projectCode:e.params.projectCode,projectName:e.params.projectName})}},p.a.createElement(b.a,null,"format_align_justify"))))))))}}]),t}(p.a.Component);t.default=O}}]);
//# sourceMappingURL=6.7f8ffebd.chunk.js.map