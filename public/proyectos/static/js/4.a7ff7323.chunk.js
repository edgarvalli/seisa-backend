(this["webpackJsonpseisa-project"]=this["webpackJsonpseisa-project"]||[]).push([[4],{119:function(e,t,a){"use strict";var r=a(118),n=a.n(r),s="http://api.seisaenergia.com/api/proyectos";t.a={headers:{method:"get",headers:{Accept:"application/json","Content-Type":"application/json"}},get:function(e){var t,a;return n.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="get",r.next=5,n.a.awrap(fetch(s+e,this.headers));case 5:if((t=r.sent).ok){r.next=8;break}return r.abrupt("return",{error:!0,message:t.statusText});case 8:return r.next=10,n.a.awrap(t.json());case 10:return a=r.sent,r.abrupt("return",a);case 14:return r.prev=14,r.t0=r.catch(0),r.abrupt("return",{error:!0,message:r.t0});case 17:case"end":return r.stop()}}),null,this,[[0,14]])},post:function(e){var t,a,r,c=arguments;return n.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return t=c.length>1&&void 0!==c[1]?c[1]:{},o.prev=1,this.headers.body=JSON.stringify(t),this.headers.method="post",o.next=6,n.a.awrap(fetch(s+e,this.headers));case 6:if((a=o.sent).ok){o.next=9;break}return o.abrupt("return",{error:!0,message:a.statusText});case 9:return o.next=11,n.a.awrap(a.json());case 11:return r=o.sent,o.abrupt("return",r);case 15:return o.prev=15,o.t0=o.catch(1),o.abrupt("return",{error:!0,message:o.t0});case 18:case"end":return o.stop()}}),null,this,[[1,15]])},delete:function(e){var t,a;return n.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="delete",r.next=5,n.a.awrap(fetch(s+e,this.headers));case 5:if((t=r.sent).ok){r.next=8;break}return r.abrupt("return",{error:!0,message:t.statusText});case 8:return r.next=10,n.a.awrap(t.json());case 10:return a=r.sent,r.abrupt("return",a);case 14:return r.prev=14,r.t0=r.catch(0),r.abrupt("return",{error:!0,message:r.t0});case 17:case"end":return r.stop()}}),null,this,[[0,14]])}}},58:function(e,t,a){"use strict";a.r(t);var r=a(118),n=a.n(r),s=a(32),c=a(33),o=a(36),u=a(34),i=a(37),l=a(0),p=a.n(l),h=a(150),d=a(151),m=a(152),v=a(153),f=a(154),b=a(79),g=a(28),y=a(119),x=a(35),k=a(38),w=function(e){var t=e.items,a=void 0===t?[]:t,r=e.renderItem;return a.map(r)},E=function(e){var t=e.items,a=void 0===t?[]:t;if(a.length>0){var r=Object.keys(a[0]);return p.a.createElement(h.a,null,p.a.createElement(d.a,null,p.a.createElement(m.a,null,r.map((function(e){return p.a.createElement(v.a,{key:e},e)})))),p.a.createElement(f.a,null,p.a.createElement(w,{items:a,renderItem:function(e){return p.a.createElement(m.a,{key:e.Id},r.map((function(t,a){return"Total"===t?p.a.createElement(v.a,{key:e.cuenta+"_"+a},"$",e[t].toLocaleString("es-MX",{maximumFractionDigits:2})):p.a.createElement(v.a,{key:e.cuenta+"_"+a},e[t])})))}})))}return p.a.createElement("div",null)},j=[{view:"Proyectos",label:"Proyectos"},{view:"EditarProyecto",label:"Edici\xf3n"}],O=function(e){function t(){var e,a;Object(s.a)(this,t);for(var r=arguments.length,n=new Array(r),c=0;c<r;c++)n[c]=arguments[c];return(a=Object(o.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).params=a.props.navigation.params(),a.state={showLoader:!0,accounts:[]},a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.GetMoves()}},{key:"GetMoves",value:function(){var e;return n.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,e=null,!this.params.others){t.next=8;break}return t.next=5,n.a.awrap(y.a.get("/detalle-cuentas?segmento=".concat(this.params.projectCode,"&code=SP&otros=ok")));case 5:e=t.sent,t.next=11;break;case 8:return t.next=10,n.a.awrap(y.a.get("/detalle-cuentas?segmento=".concat(this.params.projectCode,"&cuenta=").concat(this.params.cuenta)));case 10:e=t.sent;case 11:if(!e.error){t.next=16;break}return alert("Ocurrio un error favor de ver la consola"),console.log(e.message),this.setState({showLoader:!1}),t.abrupt("return");case 16:this.setState({showLoader:!1,accounts:e.data}),t.next=23;break;case 19:t.prev=19,t.t0=t.catch(0),console.log(t.t0),alert("Ocurrio un error favor de ver la consola");case 23:case"end":return t.stop()}}),null,this,[[0,19]])}},{key:"render",value:function(){var e=this,t=this.state,a=t.showLoader,r=t.accounts;return p.a.createElement(p.a.Fragment,null,p.a.createElement(x.a,{show:a}),p.a.createElement(k.a,{options:j,onClick:function(t){return e.props.navigation.go(t)}}),p.a.createElement(b.a,{container:!0},p.a.createElement(b.a,{item:!0,sm:12},p.a.createElement(g.a,null,"Proyecto ",this.params.projectCode," - ",this.params.projectName))),p.a.createElement(E,{items:r}))}}]),t}(p.a.Component);t.default=O}}]);
//# sourceMappingURL=4.a7ff7323.chunk.js.map