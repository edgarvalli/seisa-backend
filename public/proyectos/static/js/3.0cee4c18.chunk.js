(this["webpackJsonpseisa-project"]=this["webpackJsonpseisa-project"]||[]).push([[3],{119:function(e,t,a){"use strict";var n=a(118),r=a.n(n),c="http://api.seisaenergia.com/api/proyectos";t.a={headers:{method:"get",headers:{Accept:"application/json","Content-Type":"application/json"}},get:function(e){var t,a;return r.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="get",n.next=5,r.a.awrap(fetch(c+e,this.headers));case 5:if((t=n.sent).ok){n.next=8;break}return n.abrupt("return",{error:!0,message:t.statusText});case 8:return n.next=10,r.a.awrap(t.json());case 10:return a=n.sent,n.abrupt("return",a);case 14:return n.prev=14,n.t0=n.catch(0),n.abrupt("return",{error:!0,message:n.t0});case 17:case"end":return n.stop()}}),null,this,[[0,14]])},post:function(e){var t,a,n,s=arguments;return r.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return t=s.length>1&&void 0!==s[1]?s[1]:{},o.prev=1,this.headers.body=JSON.stringify(t),this.headers.method="post",o.next=6,r.a.awrap(fetch(c+e,this.headers));case 6:if((a=o.sent).ok){o.next=9;break}return o.abrupt("return",{error:!0,message:a.statusText});case 9:return o.next=11,r.a.awrap(a.json());case 11:return n=o.sent,o.abrupt("return",n);case 15:return o.prev=15,o.t0=o.catch(1),o.abrupt("return",{error:!0,message:o.t0});case 18:case"end":return o.stop()}}),null,this,[[1,15]])},delete:function(e){var t,a;return r.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,void 0!==this.headers.body&&delete this.headers.body,this.headers.method="delete",n.next=5,r.a.awrap(fetch(c+e,this.headers));case 5:if((t=n.sent).ok){n.next=8;break}return n.abrupt("return",{error:!0,message:t.statusText});case 8:return n.next=10,r.a.awrap(t.json());case 10:return a=n.sent,n.abrupt("return",a);case 14:return n.prev=14,n.t0=n.catch(0),n.abrupt("return",{error:!0,message:n.t0});case 17:case"end":return n.stop()}}),null,this,[[0,14]])}}},133:function(e,t,a){"use strict";var n=a(2),r=a(18),c=a(1),s=a(0),o=a.n(s),u=(a(5),a(3)),i=a(4),l=a(113),d=o.a.forwardRef((function(e,t){var a,r=e.classes,s=e.className,i=e.component,d=void 0===i?"li":i,p=e.disableGutters,m=void 0!==p&&p,h=e.role,b=void 0===h?"menuitem":h,v=e.selected,f=e.tabIndex,g=Object(n.a)(e,["classes","className","component","disableGutters","role","selected","tabIndex"]);return e.disabled||(a=void 0!==f?f:-1),o.a.createElement(l.a,Object(c.a)({button:!0,role:b,tabIndex:a,component:d,selected:v,disableGutters:m,classes:{dense:r.dense},className:Object(u.a)(r.root,s,v&&r.selected,!m&&r.gutters),ref:t},g))}));t.a=Object(i.a)((function(e){return{root:Object(c.a)({},e.typography.body1,Object(r.a)({minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",width:"auto",overflow:"hidden",whiteSpace:"nowrap"},e.breakpoints.up("sm"),{minHeight:"auto"})),gutters:{},selected:{},dense:Object(c.a)({},e.typography.body2,{minHeight:"auto"})}}),{name:"MuiMenuItem"})(d)},65:function(e,t,a){"use strict";a.r(t);var n=a(118),r=a.n(n),c=a(32),s=a(33),o=a(36),u=a(34),i=a(37),l=a(0),d=a.n(l),p=a(119),m=a(35),h=a(79),b=a(28),v=a(156),f=a(133),g=a(149),j=a(159),E=a(148),x=a(1),y=a(2),O=(a(5),a(3)),w=a(4),A=a(122),C=d.a.forwardRef((function(e,t){var a=e.children,n=e.classes,r=e.className,c=e.component,s=void 0===c?"div":c,o=e.disablePointerEvents,u=void 0!==o&&o,i=e.disableTypography,l=void 0!==i&&i,p=e.position,m=e.variant,h=Object(y.a)(e,["children","classes","className","component","disablePointerEvents","disableTypography","position","variant"]),v=Object(A.b)()||{},f=m;return m&&v.variant,v&&!f&&(f=v.variant),d.a.createElement(A.a.Provider,{value:null},d.a.createElement(s,Object(x.a)({className:Object(O.a)(n.root,r,u&&n.disablePointerEvents,v.hiddenLabel&&n.hiddenLabel,{filled:n.filled}[f],{start:n.positionStart,end:n.positionEnd}[p],{dense:n.marginDense}[v.margin]),ref:t},h),"string"!==typeof a||l?a:d.a.createElement(b.a,{color:"textSecondary"},a)))})),k=Object(w.a)({root:{display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap"},filled:{"&$positionStart:not($hiddenLabel)":{marginTop:16}},positionStart:{marginRight:8},positionEnd:{marginLeft:8},disablePointerEvents:{pointerEvents:"none"},hiddenLabel:{},marginDense:{}},{name:"MuiInputAdornment"})(C),I=a(80),P=a(109),D=a(150),S=a(151),T=a(152),_=a(153),R=a(154),G=function(e){var t=e.items,a=void 0===t?[]:t,n=e.renderItem;return a.map(n)},N=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];return(a=Object(o.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).params=a.props.navigation.params(),a.state={subaccounts:[],projectAccounts:[],loading:!0,values:{childAccount:"",budget:""}},a.handleChange=function(e){var t=e.target,n=t.name,r=t.value,c=a.state.values;c[n]=r,a.setState({values:c})},a.pushChildAccount=function(){var e,t,n,c,s,o,u;return r.a.async((function(i){for(;;)switch(i.prev=i.next){case 0:if(i.prev=0,e=a.state,t=e.values,n=e.subaccounts,c=e.projectAccounts,""!==t.childAccount){i.next=4;break}return i.abrupt("return",alert("Por favor seleccione una cuenta"));case 4:if(""!==t.budget){i.next=6;break}return i.abrupt("return",alert("Por favor agregue un monto de presupuesto"));case 6:return s=n[parseInt(t.childAccount)],o={project_id:a.params.projectId,project_code:a.params.projectCode,project_name:a.params.projectName,account_id:a.params.account.id,account_code:a.params.account.code,account_name:a.params.account.name,subaccount_id:s.CIDPRODUCTO,subaccount_code:s.CCODIGOPRODUCTO,subaccount_name:s.CNOMBREPRODUCTO,subaccount_budget:parseFloat(t.budget)},i.next=10,r.a.awrap(p.a.post("/project-account-add",{item:o}));case 10:u=i.sent,o.id=u.data.insertId,c.push(o),a.setState({projectAccounts:c,values:{childAccount:"",budget:""}}),i.next=19;break;case 16:i.prev=16,i.t0=i.catch(0),alert(i.t0);case 19:case"end":return i.stop()}}),null,null,[[0,16]])},a.removeAccount=function(e){var t,n,c;return r.a.async((function(s){for(;;)switch(s.prev=s.next){case 0:if(t=a.state.projectAccounts,n=t[e],!window.confirm("\xbfDeseas eliminar la partida "+n.subaccount_name+" realmente?")){s.next=11;break}return s.next=6,r.a.awrap(p.a.delete("/project-account-delete?id="+n.id));case 6:if(!(c=s.sent).error){s.next=9;break}return s.abrupt("return",alert(c.message));case 9:t.splice(e,1),a.setState({projectAccounts:t});case 11:case"end":return s.stop()}}))},a}return Object(i.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.GetAccounts(),this.GetProjectAccounts(),this.setState({loading:!1})}},{key:"GetAccounts",value:function(){var e,t,a;return r.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,e=this.params.account.code,n.next=4,r.a.awrap(p.a.get("/subcuentas?code="+e));case 4:if(!(t=n.sent).error){n.next=7;break}return n.abrupt("return",alert(t.error));case 7:a=t.data,this.setState({subaccounts:a}),n.next=14;break;case 11:n.prev=11,n.t0=n.catch(0),alert(n.t0);case 14:case"end":return n.stop()}}),null,this,[[0,11]])}},{key:"GetProjectAccounts",value:function(){var e,t;return r.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,r.a.awrap(p.a.get("/project-accounts?projectId=".concat(this.params.projectId,"&accountId=").concat(this.params.account.id)));case 3:if(!(e=a.sent).error){a.next=6;break}return a.abrupt("return",alert(e.error));case 6:t=e.data,this.setState({projectAccounts:t}),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),alert(a.t0);case 13:case"end":return a.stop()}}),null,this,[[0,10]])}},{key:"render",value:function(){var e=this,t=this.state,a=t.loading,n=t.subaccounts,r=t.values,c=t.projectAccounts;return d.a.createElement(d.a.Fragment,null,d.a.createElement(m.a,{show:a}),d.a.createElement(h.a,{container:!0,spacing:4},d.a.createElement(h.a,{item:!0,sm:12},d.a.createElement(b.a,null,"Agregar cuentas a ",this.params.account.name)),d.a.createElement(h.a,{item:!0,sm:4},d.a.createElement(v.a,{id:"standard-select-currency",select:!0,fullWidth:!0,name:"childAccount",label:"Agregar cuenta",value:r.childAccount||"",onChange:this.handleChange,helperText:"Por favor selecciona una opcion"},n.map((function(e,t){return d.a.createElement(f.a,{key:e.CCODIGOPRODUCTO,value:"".concat(t)},e.CCODIGOPRODUCTO+"   "+e.CNOMBREPRODUCTO)})))),d.a.createElement(h.a,{item:!0,sm:2},d.a.createElement(g.a,{fullWidth:!0},d.a.createElement(j.a,{htmlFor:"standard-adornment-amount"},"Presupuesto USD"),d.a.createElement(E.a,{id:"standard-adornment-amount",name:"budget",type:"number",min:"2",value:r.budget||"",onChange:this.handleChange,startAdornment:d.a.createElement(k,{position:"start"},"$")}))),d.a.createElement(h.a,{item:!0,sm:2},d.a.createElement(I.a,{variant:"contained",color:"primary",onClick:this.pushChildAccount},d.a.createElement(P.a,null,"add"))),d.a.createElement(D.a,null,d.a.createElement(S.a,null,d.a.createElement(T.a,null,d.a.createElement(_.a,null,"Codigo"),d.a.createElement(_.a,null,"Descripcion"),d.a.createElement(_.a,null,"Presupuesto"),d.a.createElement(_.a,null,"Acciones"))),d.a.createElement(R.a,null,d.a.createElement(G,{items:c,renderItem:function(t,a){return d.a.createElement(T.a,{key:t.project_id},d.a.createElement(_.a,null,t.subaccount_code),d.a.createElement(_.a,null,t.subaccount_name),d.a.createElement(_.a,null,"$",t.subaccount_budget.toLocaleString("es-Mx",{maximumFractionDigits:2})),d.a.createElement(_.a,null,d.a.createElement(I.a,{onClick:function(){return e.removeAccount(a)},variant:"text",color:"secondary"},"Eliminar")))}})))))}}]),t}(d.a.Component);t.default=N}}]);
//# sourceMappingURL=3.0cee4c18.chunk.js.map