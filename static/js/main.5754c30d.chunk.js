(this["webpackJsonpcurrency-exchange"]=this["webpackJsonpcurrency-exchange"]||[]).push([[0],{28:function(e,n,t){e.exports=t(41)},39:function(e,n,t){},41:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),c=t(12),o=t.n(c),u=t(10),i=(t(38),t(39),t(9)),s=t(4),l=t(3),p=t(8),d=t.n(p),f=t(6),g=function(e){var n=/^[0-9]+\.?[0-9]{0,2}/.exec(e);return null!==n?n[0]:""},b={isLoading:!1,hasError:!1},h="rate/RATE_FETCH_STARTED",v="rate/RATE_FETCH_SUCCEEDED",m="rate/RATE_FETCH_FAILED";var x={pockets:{EUR:{currency:"EUR",amount:"230"},USD:{currency:"USD",amount:"350"},GBP:{currency:"GBP",amount:"650"}},selectedCurrency:{source:"EUR",target:"GBP"},currentValue:{source:"",target:""},lastActiveInput:{source:!1,target:!1}},y=1e13-1,E="exchange/CHANGE_AMOUNT",O="exchange/EXCHANGE_CURRENCY",j="exchange/CHANGE_CURRENCY_PAIR",C="exchange/SWAP_CURRENCY_PAIR";var w=function(e){return e.exchange.selectedCurrency},k=function(e){return e.exchange.currentValue},R=function(e){return e.exchange.pockets||{}},F=Object(f.a)(w,(function(e){return e.source})),I=Object(f.a)(w,(function(e){return e.target})),_=Object(f.a)(k,(function(e){return e.source})),A=Object(f.a)(R,w,(function(e,n){var t=n.source,r=n.target;return{source:e[t].amount,target:e[r].amount}})),S=function(e){return e.exchange.lastActiveInput},V=Object(f.a)((function(e){return e.rate||{}}),F,I,(function(e,n,t){return e[n]&&e[n][t]})),D=Object(f.a)(F,_,R,(function(e,n,t){return parseFloat(n)>parseFloat(t[e].amount)})),N=Object(f.a)(D,_,(function(e,n){var t=parseFloat(n);return isNaN(t)||0===t||e})),T=Object(f.a)(R,(function(e){return Object.keys(e)})),P=Object(f.a)(T,w,(function(e,n){var t=n.source,r=n.target;return{source:e.filter((function(e){return e!==r})),target:e.filter((function(e){return e!==t}))}})),U=Object(f.a)(V,k,(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=arguments.length>1?arguments[1]:void 0,t=n.source,r=n.target,a=parseFloat(t);return isNaN(a)||0===a?{source:"",target:""}:{source:d()(r).div(e).toFixed(2),target:d()(t).times(e).toFixed(2)}})),z=Object(i.b)({exchange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x,n=arguments.length>1?arguments[1]:void 0;switch(n.type){case j:var t=n.origin,r=n.currency;return Object(l.a)({},e,{selectedCurrency:Object(l.a)({},e.selectedCurrency,Object(s.a)({},t,r)),currentValue:{source:"",target:""}});case C:return Object(l.a)({},e,{selectedCurrency:{source:e.selectedCurrency.target,target:e.selectedCurrency.source},currentValue:{source:e.currentValue.target,target:e.currentValue.source},lastActiveInput:{source:e.lastActiveInput.target,target:e.lastActiveInput.source}});case E:var a,c,o=n.origin,u=n.amount,i=n.rate,p=void 0===i?1:i,f="source"===o?"target":"source",b=g(u),h="source"===o?y:d()(y).times(p),v=(a={},Object(s.a)(a,o,!0),Object(s.a)(a,f,!1),a);if(""===b)return Object(l.a)({},e,{lastActiveInput:v,currentValue:{source:"",target:""}});if(parseFloat(b)>h)return e;var m=2===b.split(".").length?b:d()(b),w="source"===o?d()(m).times(p).toFixed(2):d()(m).div(p).toFixed(2);return Object(l.a)({},e,{lastActiveInput:v,currentValue:(c={},Object(s.a)(c,o,m.toString()),Object(s.a)(c,f,w.toString()),c)});case O:var k,R=e.selectedCurrency.source,F=e.currentValue.source,I=e.selectedCurrency.target,_=e.currentValue.target;return Object(l.a)({},e,{pockets:Object(l.a)({},e.pockets,(k={},Object(s.a)(k,R,Object(l.a)({},e.pockets[R],{amount:d()(e.pockets[R].amount).minus(F).toString()})),Object(s.a)(k,I,Object(l.a)({},e.pockets[I],{amount:d()(e.pockets[I].amount).add(_).toString()})),k)),currentValue:{source:"",target:""}});default:return e}},rate:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b,n=arguments.length>1?arguments[1]:void 0;switch(n.type){case h:return Object(l.a)({},e,{isLoading:!0,hasError:!1});case v:var t,r=n.rates;return Object(l.a)({},e,(t={},Object(s.a)(t,r.base,r.rates),Object(s.a)(t,"isLoading",!1),Object(s.a)(t,"hasError",!1),t));case m:return Object(l.a)({},e,{isLoading:!1,hasError:!0});default:return e}}}),B=t(1),L=t(2);function H(){var e=Object(B.a)(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n"]);return H=function(){return e},e}var G=L.a.div(H()),X="#f3f4f5",W="#475b6b",Y="#0056b2",J="#eb008d";function M(){var e=Object(B.a)(["\n  max-width: 550px;\n  width: 100%;\n  height: 660px;\n  margin-top: 20px;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid ",";\n  border-radius: 16px;\n  background-color: ",";\n  overflow: hidden;\n"]);return M=function(){return e},e}var $=L.a.div(M(),X,X),q=t(11),K=t.n(q),Q=t(20),Z=t(21),ee=t(24),ne=t(22),te=t(26),re=t(25),ae=function(e,n){var t;return K.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,K.a.awrap(fetch("".concat("https://api.exchangeratesapi.io/latest","?base=").concat(e,"&symbols=").concat(n.join(","))));case 3:return t=r.sent,r.abrupt("return",t.json());case 7:throw r.prev=7,r.t0=r.catch(0),new Error(r.t0);case 10:case"end":return r.stop()}}),null,null,[[0,7]])};function ce(){var e=Object(B.a)(["\n  font-size: 22px;\n  font-weight: 400;\n  margin-left: 10px;\n"]);return ce=function(){return e},e}function oe(){var e=Object(B.a)(["\n  border: 0;\n  background-color: transparent;\n  font-size: 28px;\n  cursor: pointer;\n"]);return oe=function(){return e},e}function ue(){var e=Object(B.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0 12px;\n  background-color: #fff;\n"]);return ue=function(){return e},e}var ie=L.a.div(ue()),se=L.a.button(oe()),le=L.a.h1(ce()),pe=function(e){var n=e.onClose;return a.a.createElement(ie,null,a.a.createElement(se,{"aria-label":"Close currency exchange section","data-testid":"close-button",onClick:n},"\xd7"),a.a.createElement(le,null,"Exchange"))};function de(){var e=Object(B.a)(["\n  background-color: ",";\n  color: #fff;\n  font-size: 14px;\n  padding: 12px;\n  width: calc(100% - 36px);\n  margin: 0 18px 20px;\n  border: 0;\n  border-radius: 22px;\n  font-weight: 500;\n  font-size: 16px;\n  cursor: pointer;\n  box-shadow: 0px 4px 8px 2px #eb008d52;\n  transition: background-color 250ms ease-in-out;\n\n  &:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n\n    &:hover {\n      background-color: ",";\n    }\n  }\n  &:hover {\n    background-color: #cc097e;\n  }\n"]);return de=function(){return e},e}var fe=L.a.button(de(),J,J),ge=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=navigator.language;return Intl.NumberFormat(n,Object(l.a)({style:"currency"},e)).format};function be(){var e=Object(B.a)(["\n  color: ",";\n  background-color: #fff;\n  border: 2px solid ",";\n  padding: 4px 16px;\n  border-radius: 12px;\n  font-size: 14px;\n"]);return be=function(){return e},e}var he=L.a.div(be(),Y,X),ve=function(e){var n=e.sourceCurrency,t=e.targetCurrency,r=e.targetRate,c=ge({currency:n,minimumFractionDigits:0}),o=ge({currency:t,maximumFractionDigits:4});return a.a.createElement(he,{"data-testid":"exchange-rate"},a.a.createElement("span",{"data-testid":"source-currency-rate"},c(1))," = ",a.a.createElement("span",{"data-testid":"current-rate"},r?o(r):"..."))};function me(){var e=Object(B.a)(["\n  width: 32px;\n  height: 32px;\n  background-color: #fff;\n  border: 2px solid ",";\n  font-size: 14px;\n  border-radius: 100%;\n  color: ",";\n  text-align: center;\n  cursor: pointer;\n"]);return me=function(){return e},e}var xe=L.a.button(me(),X,Y),ye=t(23),Ee=t.n(ye);function Oe(){var e=Object(B.a)(["\n  & input {\n    border: 0;\n    font-size: 28px;\n    text-align: right;\n    background-color: transparent;\n\n    &::placeholder {\n      color: #8b959e;\n    }\n  }\n"]);return Oe=function(){return e},e}function je(){var e=Object(B.a)(["\n  font-size: 28px;\n  vertical-align: top;\n"]);return je=function(){return e},e}function Ce(){var e=Object(B.a)(["\n  display: flex;\n  align-items: center;\n"]);return Ce=function(){return e},e}function we(){var e=Object(B.a)(["\n  color: ",";\n  font-size: 14px;\n  padding-top: 8px;\n  padding-left: 8px;\n"]);return we=function(){return e},e}function ke(){var e=Object(B.a)(["\n  background-color: transparent;\n  border: 0;\n  font-size: 24px;\n  cursor: pointer;\n"]);return ke=function(){return e},e}function Re(){var e=Object(B.a)(["\n  min-width: 130px;\n"]);return Re=function(){return e},e}function Fe(){var e=Object(B.a)(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 12px;\n  background-color: ",";\n  height: 120px;\n"]);return Fe=function(){return e},e}var Ie=L.a.div(Fe(),(function(e){return{source:"#fff",target:X}[e.origin]})),_e=L.a.div(Re()),Ae=L.a.select(ke()),Se=L.a.div(we(),(function(e){return e.lowBalance?"red":W})),Ve=L.a.div(Ce()),De=L.a.span(je()),Ne=Object(L.a)(Ee.a)(Oe()),Te=Object(u.b)((function(e,n){return{realTimeValue:U(e)[n.origin],isActive:S(e)[n.origin],balance:A(e)[n.origin],amount:k(e)[n.origin],lowBalance:D(e),rate:V(e)}}),(function(e,n){return{onCurrencyChange:function(t){e(function(e,n){return{type:j,origin:e,currency:n}}(n.origin,t))},onAmountChange:function(t,r){e(function(e,n,t){return{type:E,origin:e,amount:n,rate:t}}(n.origin,t,r))}}}))((function(e){var n=e.origin,t=e.currency,r=e.balance,c=e.amount,o=e.rate,u=e.isActive,i=e.realTimeValue,s=e.lowBalance,l=e.supportedPockets,p=e.onCurrencyChange,d=e.onAmountChange;return a.a.createElement(Ie,{origin:n},a.a.createElement(_e,null,a.a.createElement(Ae,{"data-testid":"".concat(n,"-currency-selector"),value:t,"aria-label":"source"===n?"Select source currency":"Select target currency",onChange:function(e){var n=e.target;return p(n.value)}},l.map((function(e){return a.a.createElement("option",{key:e},e)}))),a.a.createElement(Se,{"data-testid":"".concat(n,"-balance"),lowBalance:"source"===n&&s},"Balance: ",ge({currency:t})(r))),a.a.createElement(Ve,null,parseFloat(c)>0&&a.a.createElement(De,null,"source"===n?"-":"+"),a.a.createElement(Ne,{"data-testid":"".concat(n,"-input"),type:"text",autoFocus:"source"===n,"aria-label":"source"===n?"Enter source amount":"Enter target amount",placeholder:"0",value:u?c:i,onChange:function(e){var n=e.target;return d(n.value,o)}})))}));function Pe(){var e=Object(B.a)(["\n  padding: 12px;\n  background-color: #000;\n  color: #fff;\n  margin: 0 18px 20px;\n  border-radius: 4px;\n  text-align: center;\n"]);return Pe=function(){return e},e}function Ue(){var e=Object(B.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: -16px;\n  padding: 0 12px;\n"]);return Ue=function(){return e},e}function ze(){var e=Object(B.a)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  flex-grow: 1;\n"]);return ze=function(){return e},e}var Be=L.a.form(ze()),Le=L.a.div(Ue()),He=L.a.div(Pe()),Ge=function(e){function n(e){var t;return Object(Q.a)(this,n),(t=Object(ee.a)(this,Object(ne.a)(n).call(this,e))).scheduleRateFetcher=function(e){var n=t.props.supportedPockets.target;t.clearFetcherInstance(),t.updateRates(e,n),t.fetcherInstance=setInterval((function(){return t.updateRates(e,n)}),1e4)},t.updateRates=function(e,n){var r;return K.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return t.props.fetchRate(e),a.prev=1,a.next=4,K.a.awrap(ae(e,n));case 4:r=a.sent,t.props.fetchRateSuccess(r),a.next=11;break;case 8:a.prev=8,a.t0=a.catch(1),t.props.fetchRateError(e);case 11:case"end":return a.stop()}}),null,null,[[1,8]])},t.handleVisibilityChange=function(e){e?t.scheduleRateFetcher(t.props.sourceCurrency):t.clearFetcherInstance()},t.clearFetcherInstance=function(){t.fetcherInstance&&(clearInterval(t.fetcherInstance),t.fetcherInstance=null)},t.closeSection=function(){alert("Closing section")},t.submitForm=function(e){t.props.exchangeCurrency(),e.preventDefault()},t.scheduleRateFetcher(t.props.sourceCurrency),t}return Object(te.a)(n,e),Object(Z.a)(n,[{key:"componentDidUpdate",value:function(e){e.sourceCurrency!==this.props.sourceCurrency&&this.scheduleRateFetcher(this.props.sourceCurrency)}},{key:"componentWillUnmount",value:function(){this.clearFetcherInstance()}},{key:"render",value:function(){var e=this.props,n=e.sourceCurrency,t=e.targetCurrency,r=e.targetRate,c=e.isExchangeDisabled,o=e.rateHasError,u=e.supportedPockets,i=e.swapPockets;return a.a.createElement(re.a,{onChange:this.handleVisibilityChange},a.a.createElement(a.a.Fragment,null,a.a.createElement(pe,{onClose:this.closeSection}),a.a.createElement(Be,{onSubmit:this.submitForm},a.a.createElement("div",null,a.a.createElement(Te,{origin:"source",currency:n,supportedPockets:u.source}),a.a.createElement(Le,null,a.a.createElement(xe,{type:"button","data-testid":"swap-button","aria-label":"Swap source and target currencies",onClick:i},"\u21c5"),a.a.createElement(ve,{sourceCurrency:n,targetCurrency:t,targetRate:r}),a.a.createElement("div",null)),a.a.createElement(Te,{origin:"target",currency:t,supportedPockets:u.target})),o&&a.a.createElement(He,{role:"alert","data-testid":"error-message"},"Fetching exchange rates failed"),!o&&a.a.createElement(fe,{type:"submit","data-testid":"exchange-button",disabled:c},"Exchange"))))}}]),n}(a.a.Component),Xe=Object(f.b)({pocketCurrencies:T,targetRate:V,supportedPockets:P,sourceCurrency:F,targetCurrency:I,isExchangeDisabled:N,rateIsLoading:function(e){return e.rate.isLoading},rateHasError:function(e){return e.rate.hasError}}),We=Object(u.b)(Xe,(function(e){return{exchangeCurrency:function(){e({type:O})},swapPockets:function(){e({type:C})},fetchRate:function(n){e({type:h})},fetchRateSuccess:function(n){e(function(e){return{type:v,rates:e}}(n))},fetchRateError:function(n){e({type:m})}}}))(Ge),Ye=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object(i.c)(z,e,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__())}({}),Je=function(){return a.a.createElement(u.a,{store:Ye},a.a.createElement(G,null,a.a.createElement($,null,a.a.createElement(We,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(Je,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[28,1,2]]]);
//# sourceMappingURL=main.5754c30d.chunk.js.map