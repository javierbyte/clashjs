(this.webpackJsonpclashjs=this.webpackJsonpclashjs||[]).push([[0],[,,,,function(t,e){var n=["north","east","south","west"],i=["north","east","south","west","shoot"],o=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];switch(i){case n[0]:return t[1]===e[1]&&t[0]>e[0];case n[1]:return t[0]===e[0]&&t[1]<e[1];case n[2]:return t[1]===e[1]&&t[0]<e[0];case n[3]:return t[0]===e[0]&&t[1]>e[1]}};t.exports={randomMove:function(){return Math.random()>.33?"move":i[Math.floor(Math.random()*i.length)]},getDirection:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];t=t||[],e=e||[];var n=Math.abs(t[0]-e[0]),i=Math.abs(t[1]-e[1]);return n>i?t[0]-e[0]>0?"north":"south":t[1]-e[1]>0?"west":"east"},isVisible:o,canKill:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return e.some((function(e){return e.isAlive&&o(t.position,e.position,t.direction)}))},safeRandomMove:function(){return Math.random()>.33?"move":n[Math.floor(Math.random()*n.length)]},fastGetDirection:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=Math.abs(t[0]-e[0]);return n?t[0]-e[0]>0?"north":"south":t[1]-e[1]>0?"west":"east"},turn:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1?arguments[1]:void 0,i=n.indexOf(t);return n[(i+e)%4]},getDistance:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=Math.abs(t[0]-e[0]),i=Math.abs(t[1]-e[1]);return i+n}}},,,,,,,,,,function(t,e){var n,i,o,a,r="0123456789",s="abcdefghijklmnoprstuvxuyz",c=s.toUpperCase(),l="+/";t.exports=e={},n=function(){return[r,s,c,l].join("")},i=function(){return[r,s,c].join("")},o=function(){return[c,r].join("")},a=function(t,e){var n,i="";for(n=0;n<e;n+=1)i+=t[Math.ceil(100*Math.random()%t.length||1)-1];return i},e.generateBase64String=function(t){return a(n(),t)},e.generateBase62String=function(t){return a(i(),t)},e.generateBase32String=function(t){return a(o(),t)},e.generateBase10String=function(t){return a(r,t)}},,function(t,e,n){t.exports={manuelmhtr:n(24),ericku:n(25),siegfried:n(26),horror:n(27),elperron:n(28),yuno:n(29),xmontoya:n(30),margeux:n(31)}},function(t,e,n){t.exports=n(32)},,,,,,,function(t,e,n){var i=n(4),o={north:"vertical",east:"horizontal",south:"vertical",west:"horizontal"},a={info:{name:"Manuelmhtr",style:3},ai:function(t,e,n){var a=[],r={vulnerabilityLevel:null,canKill:null,nearestAmmo:null,nearestEnemy:null,canMove:null};function s(t){var e=0;if(a.forEach((function(n){i.isVisible(n.position,t,n.direction)&&n.ammo>0?e=Math.max(e,1):c(n.position,t)&&(n.ammo>0||1===n.nearestAmmoDistance)&&(e=Math.max(e,.5))})),0===e){var n=[t[0]+1,t[1]+1],o=[t[0]-1,t[1]-1];a.forEach((function(t){t.ammo>0&&(c(t.position,n)||c(t.position,o))&&(e=Math.max(e,.25))}))}return e}function c(t,e){var n=!1;return n=(n=(n=(n=n||t[1]===e[1]&&t[0]>e[0])||t[0]===e[0]&&t[1]<e[1])||t[1]===e[1]&&t[0]<e[0])||t[0]===e[0]&&t[1]>e[1]}function l(t,e){var n=Math.abs(t[0]-e.position[0]),i=Math.abs(t[1]-e.position[1]);return Math.min(i,n)}function u(){var e=t.direction,i=r.vulnerabilityLevel,o=0;return[{direction:"north",position:[t.position[0]-1,t.position[1]]},{direction:"east",position:[t.position[0],t.position[1]+1]},{direction:"south",position:[t.position[0]+1,t.position[1]]},{direction:"west",position:[t.position[0],t.position[1]-1]}].forEach((function(a){a.vulnerability=s(a.position),a.distanceLeft=function(e){if("north"===e)return t.position[0];if("east"===e)return n.gridSize-t.position[1];if("south"===e)return n.gridSize-t.position[0];if("west"===e)return t.position[1]}(a.direction),a.canMove=m(t.position,a.direction);var r=a.vulnerability<i||a.vulnerability===i&&a.distanceLeft>o;a.canMove&&r&&(e=a.direction,i=a.vulnerability,o=a.distanceLeft)})),e===t.direction?d():e}function m(t,e){return"north"===e?t[0]>0:"east"===e?t[1]<n.gridSize:"south"===e?t[0]<n.gridSize:"west"===e?t[1]>0:void 0}function f(e){if(i.isVisible(t.position,e.position,t.direction))return"shoot";var n=function(){var n=c(t.position,e.position),a=o[e.direction];return n?i.fastGetDirection(t.position,e.position):"vertical"===a?e.position[1]>t.position[1]?"east":"west":e.position[0]>t.position[0]?"south":"north"}(),a=l(t.position,e);return n===t.direction&&(a>1||0===e.ammo)?"move":n}function d(){var e;return"north"===t.direction?e=[t.position[0]-1,t.position[1]]:"east"===t.direction?e=[t.position[0],t.position[1]+1]:"south"===t.direction?e=[t.position[0]+1,t.position[1]]:"west"===t.direction&&(e=[t.position[0],t.position[1]-1]),1===s(e)?null:"move"}function h(e){var n=i.fastGetDirection(t.position,e);return n===t.direction?d():n}return e.forEach((function(t){!0===t.isAlive&&(t.nearestAmmoDistance=function(t){var e=null;return n.ammoPosition.forEach((function(n){var o=i.getDistance(t,n);(null===e||o<e)&&(e=o)})),e}(t.position),a.push(t))})),r.vulnerabilityLevel=s(t.position),r.canKill=t.ammo>0&&i.canKill(t,e),r.nearestAmmo=function(t){var e=null,o=null;return n.ammoPosition.forEach((function(n){var a=i.getDistance(t,n);(null===o||a<o)&&(e={position:n,distance:o=a})})),e}(t.position),r.nearestEnemy=function(t){var e=null,n=null;return a.forEach((function(i){var o=l(t,i);(null===n||o<n)&&(e={instance:i,distance:n=o})})),e}(t.position),r.canMove=m(t.position,t.direction),1===r.vulnerabilityLevel||r.vulnerabilityLevel>=.5&&!0!==r.canKill?function(){if(1===r.vulnerabilityLevel){var e,n=r.canMove;return a.forEach((function(n){n.ammo>0&&i.isVisible(n.position,t.position,n.direction)&&(e=n)})),e&&o[e.direction]===o[t.direction]&&(n=!1),n?"move":e&&t.ammo>0?f(e):u()}return u()}():!0===r.canKill?"shoot":0===t.ammo&&r.nearestAmmo?h(r.nearestAmmo.position):t.ammo>0&&r.nearestEnemy?r.nearestAmmo&&r.nearestAmmo.distance<r.nearestEnemy.distance?h(r.nearestAmmo.position):f(r.nearestEnemy.instance):u()}};t.exports=a},function(t,e,n){var i=n(4),o=["north","east","south","west"],a=function(t,e){var n,o=function(t,e){if(e.ammoPosition.length){var n=t.position,o=e.ammoPosition[0];return e.ammoPosition.forEach((function(t){i.getDistance(n,t)<i.getDistance(n,o)&&(o=t)})),o}}(t,e);if(o)return(n=i.fastGetDirection(t.position,o))!==t.direction?n:"move"},r=function(t,e,n,a){var r=JSON.parse(JSON.stringify(e));if("move"===t)switch(e.direction){case o[0]:r.position[0]>0&&r.position[0]--;break;case o[1]:r.position[1]<a.gridSize[1]&&r.position[1]++;break;case o[2]:r.position[0]<a.gridSize[0]&&r.position[0]++;break;case o[3]:r[1]>0&&r.position[1]--}return!function(t,e){return e.filter((function(t){return t.isAlive})).map((function(e){return i.canKill(e,[t],e.direction)})).filter((function(t){return!0===t})).length>0}(r,n)},s=function(t,e,n){var i=r("north",t,e,n),o=r("move",t,e,n);return i&&t.ammo?l(t,e)||c(t,e):o?"move":void 0},c=function(t,e){var n=function(t,e){var n,o=e.slice(0,e.length);return o=o.filter((function(t){return t.isAlive})),n=o[0],o.forEach((function(e){i.getDistance(t,e)<i.getDistance(t,n)&&(n=e)})),n}(t,e),o=i.fastGetDirection(t.position,n.position);return o!==t.direction?o:"move"},l=function(t,e){var n="north"===t.direction?"south":"north",a=JSON.parse(JSON.stringify(t));return e=e.filter((function(t){return t.isAlive})),o.forEach((function(t){a.direction=t,i.canKill(a,e)&&(n=t)})),n},u={info:{name:"Gurren",style:0},ai:function(t,e,n){return t.ammo?function(t,e,n){var o;return i.canKill(t,e)?"shoot":(o=l(t,e))&&r(o,t,e,n)?o:s(t,e,n)||"stay"}(t,e,n):Math.random()>.8?"move":function(t,e,n){var o;return(o=a(t,n))&&r(o,t,e,n)?o:s(t,e,n)||i.safeRandomMove()}(t,e,n)}};t.exports=u},function(t,e,n){var i=n(4),o={info:{name:"Siegfried",style:4},ai:function(t,e,n){var o;return i.canKill(t,e)&&t.ammo?"shoot":n.ammoPosition.length?(o=i.getDirection(t.position,n.ammoPosition[0]))!==t.direction?o:"move":i.randomMove()}};t.exports=o},function(t,e,n){var i=n(4),o={info:{name:"Horror",style:10},ai:function(t,e,n){var o;return i.canKill(t,e)&&t.ammo?"shoot":n.ammoPosition.length?(o=i.fastGetDirection(t.position,n.ammoPosition[0]))!==t.direction?o:"move":i.safeRandomMove()}};t.exports=o},function(t,e,n){var i=n(4),o=0,a=null,r={1:"north",2:"east",3:"south",4:"west"},s=0,c={info:{name:"ElPerron",style:7},ai:function(t,e,n){var c,l;if(i.canKill(t,e)&&t.ammo)return"shoot";if(0==t.ammo||1==s){var u=function(){var e=t.position,i=22,o=null;for(var a in n.ammoPosition){var r=n.ammoPosition[a],s=Math.abs(e[1]-r[1])+Math.abs(e[0]-r[0]);s<i&&(i=s,o=r)}return o}();return c=i.getDirection(t.position,u),null!=(l=a)&&l[0]==t.position[0]&&l[1]==t.position[1]&&(s=0),a=u,c!==t.direction?c:"move"}return++o>4&&(o=1,s++),r[o]}};t.exports=c},function(t,e,n){var i=n(4),o=["north","east","south","west"],a=function(t,e){var n=e.reduce((function(e,n){return(-1===e[0]||i.getDistance(t,n)<e[0])&&(e[0]=i.getDistance(t,n),e[1]=n),e}),[-1,0]);return i.fastGetDirection(t,n[1])},r={info:{name:"Yuno",style:9},ai:function(t,e,n){var r,s,c,l;return i.canKill(t,e)&&t.ammo?"shoot":t.ammo?(c=t.position,l=e.map((function(t){return t.position})),(s=o.reduce((function(t,e){return t||l.reduce((function(t,n){return t||(i.isVisible(c,n,e)?e:null)}),null)}),null))||(s=a(t.position,e.map((function(t){return t.position}))))!==t.direction?s:"move"):n.ammoPosition.length?(r=a(t.position,n.ammoPosition))!==t.direction?r:"move":Math.random()>.9?"move":i.safeRandomMove()}};t.exports=r},function(t,e,n){var i=n(4),o={info:{name:"Xmontoya89",style:1},ai:function(t,e,n){var o;return i.canKill(t,e)&&t.ammo?"shoot":n.ammoPosition.length?(o=i.fastGetDirection(t.position,n.ammoPosition[0]))!==t.direction?o:i.safeRandomMove():"move"}};t.exports=o},function(t,e,n){var i=n(4),o=!0,a={info:{name:"margeux",style:5},ai:function(t,e,n){var a,r;return t.ammo>0&&(o=!1),0==t.ammo&&(o=!0),n.ammoPosition.length&&o?(a=i.fastGetDirection(t.position,n.ammoPosition[0]))!==t.direction?a:"move":o?i.canKill(t,e)&&t.ammo?"shoot":n.ammoPosition.length?(a=i.fastGetDirection(t.position,n.ammoPosition[0]))!==t.direction?a:"move":i.safeRandomMove():(r=i.fastGetDirection(t.position,e[0].position))!==t.direction?i.fastGetDirection(e[0].position,t.position)!==e[0].position?r:i.safeRandomMove():i.canKill(t,e)&&t.ammo?"shoot":i.safeRandomMove()}};t.exports=a},function(t,e,n){"use strict";n.r(e);var i=n(0),o=n.n(i),a=n(13),r=n.n(a),s=n(11),c=n(2),l=n(3),u=n(6),m=n(5),f=n(1),d=n.n(f),h=function(t){Object(u.a)(n,t);var e=Object(m.a)(n);function n(){return Object(c.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t,e=this.props.gridSize,n=100/e,i=[];for(t=0;t<e*e;t++)i.push(o.a.createElement("div",{style:{height:n+"vmin",width:n+"vmin"},className:"clash-tile",key:t}));return o.a.createElement("div",null,i)}}]),n}(o.a.Component),v=function(t){Object(u.a)(n,t);var e=Object(m.a)(n);function n(){return Object(c.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t=this.props,e=t.gridSize,n=t.ammoPosition,i=100/e,a=d.a.map(n,(function(t,e){return o.a.createElement("div",{key:e,className:"clash-ammo",style:{top:i*t[0]+"vmin",left:i*t[1]+"vmin",width:i+"vmin",height:i+"vmin"}})}));return o.a.createElement("div",{style:{zIndex:1},className:"clash-layer animation-glow"},a)}}]),n}(o.a.Component);var p=function(t){var e=t.gridSize,n=t.playerStates,i=t.playerInstances,a=t.speed,r=n.map((function(t){return t.directionAngle})),s=100/e,c=d.a.map(n,(function(t,e){var n,c=t.id,l=i.find((function(t){return t.id===c})).info;return o.a.createElement("div",{key:e,className:"clash-player-container",style:{transition:"transform ".concat(2*a+16,"ms"),width:s+"vmin",height:s+"vmin",opacity:t.isAlive?1:.5,zIndex:t.isAlive?2:0,transform:"translateY(".concat(s*t.position[0],"vmin) translateX(").concat(s*t.position[1],"vmin) scale(").concat(t.isAlive?1.25:.75,")")}},o.a.createElement("div",{className:"clash-player -name-".concat(t.name),style:{transition:"transform ".concat(2*a+16,"ms"),width:s+"vmin",height:s+"vmin",filter:"grayscale(".concat(t.isAlive?"0%":"100%",")"),backgroundImage:(n=t.style,d.a.isPlainObject(n)?"url(static/rockets/".concat(n.type,")"):"url(static/rockets/rocket".concat(n,".png)")),transform:"rotate(".concat(90*r[e]+(t.isAlive?0:45),"deg)")}}),o.a.createElement("div",{className:"clash-player-name",style:{textDecoration:t.isAlive?"none":"line-through"}},l.name,new Array(Math.min(t.ammo,3)).fill("\ud83d\ude80").join("")))}));return o.a.createElement("div",{className:"clash-layer"},c)},g=n(9),y=n(8);var E=function(t){var e=o.a.useState(!1),n=Object(y.a)(e,2),i=n[0],a=n[1],r=window.innerHeight<1080,s=i||!r,c=t.gameStats,l=t.rounds,u=t.total,m=Object.keys(c).map((function(t){return Object(g.a)(Object(g.a)({},c[t]),{},{id:t})})).sort((function(t,e){return e.score-t.score}));return o.a.createElement("div",{className:"stats ".concat(r?"-clickable":""),onClick:function(){a(!i)}},s?o.a.createElement("div",{style:{textAlign:"center",padding:"0.25rem 0 0.5rem",color:"#2ecc71"}},"Round ",l," of ",u):o.a.createElement("div",{style:{textAlign:"center",padding:"0.25rem 0 0.5rem"}},"Click to see stats"),s&&o.a.createElement("table",null,o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"Player"),o.a.createElement("th",{style:{padding:0}}),o.a.createElement("th",{alt:"Eliminations",style:{textAlign:"right"}},"E"),o.a.createElement("th",{alt:"Wins",style:{textAlign:"right"}},"W"),o.a.createElement("th",{alt:"Score",style:{textAlign:"right"}},"S"))),o.a.createElement("tbody",null,d.a.map(m,(function(t,e){return o.a.createElement("tr",{key:e,className:"player-stats ".concat(t.isAlive?"":"-dead")},o.a.createElement("td",{className:"player-name"},t.name),o.a.createElement("td",{style:{padding:0},className:"player-dead-emoji"},o.a.createElement("span",{role:"img","aria-label":"dead"},"\ud83d\udc80")),o.a.createElement("td",{className:"stats-results"},t.kills),o.a.createElement("td",{className:"stats-results"},t.wins),o.a.createElement("td",{className:"stats-results"},t.score))})))))},S=["north","east","south","west"],b=function(t){Object(u.a)(n,t);var e=Object(m.a)(n);function n(){return Object(c.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t=this.props,e=t.shoots,n=100/t.gridSize,i=d.a.map(e,(function(t,e){return o.a.createElement("div",{key:e,className:"clash-shoot animation-shot",style:{top:n*t.origin[0]+"vmin",left:n*t.origin[1]+"vmin",transform:"translatex("+n/2+"vmin) translatey("+n/2+"vmin) rotate("+90*(S.indexOf(t.direction)-1)+"deg) "}})}));return o.a.createElement("div",{className:"clash-layer"},i)}}]),n}(o.a.Component);function w(t,e){var n=Object(i.useRef)();Object(i.useEffect)((function(){n.current=t})),Object(i.useEffect)((function(){var t=setInterval((function(){n.current()}),e);return function(){return clearInterval(t)}}),[e])}function x(t){var e=o.a.useState(!1),n=Object(y.a)(e,2),i=n[0],a=n[1],r=t.hide;return w((function(){a(!0)}),16),o.a.createElement("div",{className:"notifications-element ".concat(t.id%2===0?"-alt":""," ").concat(i&&!r?"":"-hide")},o.a.createElement("div",{className:"notifications-element-text"},t.text))}var k=function(t){var e=o.a.useState((new Date).getTime()),n=Object(y.a)(e,2),i=n[0],a=n[1],r=t.notifications.filter((function(t){return t&&t.text})).filter((function(t){return i<t.expire})).sort((function(t,e){return t.date-e.date})).slice(-7);return w((function(){a((new Date).getTime())}),50),o.a.createElement("div",{className:"notifications"},r.map((function(t,e){var n=e<=r.length-7,a=i<t.expire-500;return o.a.createElement(x,Object.assign({hide:n||!a,key:t.id},t))})))},M=n(14),A=n.n(M),O=function(){function t(e){Object(c.a)(this,t),this.id=A.a.generateBase32String(8),this.info=e.info,this.name=e.info.name,this.ai=e.ai}return Object(l.a)(t,[{key:"execute",value:function(t,e,n){try{return this.ai(t,e,n)}catch(i){console.error("!",i)}}}]),t}(),D=n(1),P=n(4),j=["north","east","south","west"],N=function(t,e){return t<0?0:t>e-1?e-1:t},I=function(t){var e=t.playerIndex,n=t.playerAction,i=t.playerStates,o=t.playerInstances,a=t.gameEnvironment,r=t.evtCallback,s=t.coreCallback,c=i[e];if(-1!==j.indexOf(n)){var l=(j.indexOf(n)+4)%4-(j.indexOf(c.direction)+4)%4;return 3===l&&(l=-1),-3===l&&(l=1),i[e].direction=n,i[e].directionAngle=i[e].directionAngle+l,i}if("move"===n){switch(c.direction){case j[0]:c.position[0]--;break;case j[1]:c.position[1]++;break;case j[2]:c.position[0]++;break;case j[3]:c.position[1]--}c.position[0]=N(c.position[0],a.gridSize),c.position[1]=N(c.position[1],a.gridSize),a.ammoPosition.forEach((function(t,e){t[0]===c.position[0]&&t[1]===c.position[1]&&(a.ammoPosition.splice(e,1),c.ammo+=1)}))}if("shoot"===n&&c.ammo>0){c.ammo-=1;var u=[],m=[];r("SHOOT",{shooter:e,origin:c.position,direction:c.direction}),i.forEach((function(t,e){t.isAlive&&P.isVisible(c.position,t.position,c.direction)&&(u.push(e),t.isAlive=!1)})),u.length&&(m=D.filter(i,(function(t){return t.isAlive})),s("KILL",{killer:o[e],killed:D.map(u,(function(t){return o[t]}))}),r("KILL",{killer:o[e],killed:D.map(u,(function(t){return o[t]}))}),1===m.length&&(s("WIN",{winner:o[e]}),r("WIN",{winner:o[e]})))}return i},z=n(15),R=["north","east","south","west"],C=new(n.n(z).a),G={running:!1,currentPlayer:0,gameEnvironment:{gridSize:13,ammoPosition:[]},suddenDeathCount:0,totalRounds:7,rounds:0,playerInstances:[],playerStates:[],playerDefinition:{},gameStats:{}};var K=function(t){function e(t,e){console.info("ClashCore: Emit",{name:t,payload:e}),C.emit("CLASHJS",{name:t,payload:e})}function n(t,n){e(t,n)}function i(t,n){if("KILL"===t){var i=n.killer,o=n.killed;G.gameStats[i.id].kills+=o.length,d.a.forEach(G.playerInstances,(function(t){var e=G.gameStats[t.id];o.indexOf(t)>-1&&(G.alivePlayerCount--,e.deaths++),e.deaths?e.kdr=e.kills/e.deaths:e.kdr=e.kills})),G.suddenDeathCount=0}("WIN"===t&&(G.gameStats[n.winner.id].wins++,G.suddenDeathCount=0,G.rounds>=G.totalRounds)||"DRAW"===t&&(G.suddenDeathCount=0,G.rounds>=G.totalRounds))&&e("GAME_OVER")}function o(){var t=[Math.floor(Math.random()*G.gameEnvironment.gridSize),Math.floor(Math.random()*G.gameEnvironment.gridSize)];G.gameEnvironment.ammoPosition.some((function(e){return e[0]===t[0]&&e[1]===t[1]}))?o():G.gameEnvironment.ammoPosition.push(t)}return G.playerInstances=t.map((function(t){var e=new O(t);return G.gameStats[e.id]={id:e.id,name:e.name,kills:0,wins:0},e})),{newGame:function(){G.gameEnvironment={gridSize:13,ammoPosition:[]},G.rounds=G.rounds+1,G.suddenDeathCount=0,G.playerInstances=d.a.shuffle(d.a.cloneDeep(G.playerInstances)),G.playerStates=G.playerInstances.map((function(t){var e=G.gameEnvironment.gridSize,n=Math.floor(4*Math.random());return{name:t.name,id:t.id,style:t.info.style,position:[Math.floor(Math.random()*e),Math.floor(Math.random()*e)],direction:R[n],directionAngle:n,ammo:0,isAlive:!0}})),G.currentPlayer=0,G=Object(g.a)({},G),o()},getAlivePlayerCount:function(){return G.playerStates.filter((function(t){return t.isAlive})).length},getState:function(){var t=G.gameStats,e=function(e){var n=t[e];n.score=5*n.wins+n.kills,n.isAlive=G.playerStates.find((function(t){return t.id===e})).isAlive};for(var n in t)e(n);return JSON.parse(JSON.stringify({gameEnvironment:G.gameEnvironment,gameStats:t,rounds:G.rounds,totalRounds:G.totalRounds,playerStates:G.playerStates,playerInstances:G.playerInstances}))},nextPly:function(){var t=d.a.cloneDeep(G.playerStates);if(G.suddenDeathCount++,170===G.suddenDeathCount&&e("PRE_DRAW"),!(G.suddenDeathCount>200&&(e("DRAW"),G.rounds>=G.totalRounds))){var a,r,s=t.filter((function(t,e){return e!==G.currentPlayer&&t.isAlive}));return G.playerStates[G.currentPlayer].isAlive&&(a=G.currentPlayer,r=G.playerInstances[G.currentPlayer].execute(t[G.currentPlayer],s,d.a.cloneDeep(G.gameEnvironment)),G.playerStates=I({playerIndex:a,playerAction:r,playerStates:G.playerStates,playerInstances:G.playerInstances,gameEnvironment:G.gameEnvironment,evtCallback:n,coreCallback:i})),G.currentPlayer=(G.currentPlayer+1)%G.playerInstances.length,G.gameEnvironment.ammoPosition.length<G.playerStates.length/1.3&&Math.random()>.93&&o(),Math.random()>.98&&o(),this.getState()}e("GAME_OVER")},addListener:function(t){C.addListener("CLASHJS",t)}}},L=n(16),W=n.n(L),J=d.a.shuffle(d.a.map(W.a,(function(t){return t}))),T=document.location.search.includes("debug"),V=T?32:200,B=T?32:100,H=K(J);H.newGame();var _=function(t){Object(u.a)(n,t);var e=Object(m.a)(n);function n(t){var i;return Object(c.a)(this,n),(i=e.call(this,t)).state={clashState:null,shoots:[],speed:V,notifications:[],finished:!1},i}return Object(l.a)(n,[{key:"componentWillMount",value:function(){var t=this;H.addListener((function(e){var n=e.name,i=e.payload;if("SHOOT"!==n){if("KILL"===n)return t.handleKill(i);if("WIN"===n){var a=d.a.get(i,["winner","info","name"]);return a&&t.pushNotification({text:o.a.createElement("div",{style:{color:"#2ecc71"}},o.a.createElement("strong",null,a)," won this one!")}),void t.newGame()}return"DRAW"===n?(t.pushNotification({text:o.a.createElement("strong",{style:{color:"#f39c12"}},"We got a draw!")}),void t.newGame()):("PRE_DRAW"===n&&t.pushNotification({text:"They are too strong!"}),"GAME_OVER"===n?t.endGame():void 0)}t.setState((function(t){return{shoots:[].concat(Object(s.a)(t.shoots),[{direction:i.direction,origin:i.origin.slice(),time:(new Date).getTime()}])}}))})),this.nextTurn()}},{key:"newGame",value:function(){H.getState().rounds>=H.getState().totalRounds||(this.pushNotification({text:"Starting a new game!"}),this.setState({speed:V},(function(){H.newGame()})))}},{key:"nextTurn",value:function(){var t=this,e=this.state,n=e.speed;e.finished||this.setState({clashState:H.nextPly(),speed:this.state.speed>B?parseInt(.99*this.state.speed,10):B},(function(){H.getAlivePlayerCount()>=2&&window.setTimeout((function(){t.nextTurn()}),n)}))}},{key:"handleKill",value:function(t){var e=t.killer,n=t.killed;this.pushNotification({text:"".concat(e.name," eliminated ").concat(d.a.map(n,(function(t){return t.name})).join(","))})}},{key:"endGame",value:function(){var t=H.getState(),e=d.a.sortBy(t.gameStats,(function(t){return-1*t.score+-.1*t.wins}))[0];this.pushNotification({expire:1/0,text:o.a.createElement("b",{style:{color:"#2ecc71",fontWeight:600}},"Congratulations ",e.name,"!")}),this.pushNotification({expire:1/0,text:o.a.createElement("div",null,o.a.createElement("button",{style:{border:"none",height:"2rem",padding:"0 1rem",fontSize:"14px",borderRadius:"4"},onClick:function(){window.location.reload()}},"Start Again"))}),this.setState({shoots:[],finished:!0})}},{key:"pushNotification",value:function(t){var e=t.text,n=t.expire;this.setState((function(t){return{notifications:[].concat(Object(s.a)(t.notifications),[{expire:n||(new Date).getTime()+7e3,date:(new Date).getTime(),text:e,id:t.notifications.length}])}}))}},{key:"render",value:function(){if(!this.state)return null;var t=this.state,e=t.shoots,n=t.speed,i=t.notifications,a=H.getState(),r=a.gameStats,s=a.playerStates,c=a.playerInstances,l=a.rounds,u=a.totalRounds,m=a.gameEnvironment;return o.a.createElement("div",{className:"clash"},o.a.createElement(h,{gridSize:m.gridSize}),o.a.createElement(b,{shoots:e.slice(),gridSize:m.gridSize}),o.a.createElement(v,{gridSize:m.gridSize,ammoPosition:m.ammoPosition}),o.a.createElement(p,{speed:n,gridSize:m.gridSize,playerInstances:c,playerStates:s}),o.a.createElement(k,{notifications:i}),o.a.createElement(E,{rounds:l,total:u,gameStats:r}),T&&o.a.createElement("pre",{className:"debugger"},o.a.createElement("b",null,"playerInstances"),JSON.stringify(c,0,2),o.a.createElement("hr",null),o.a.createElement("b",null,"playerStates"),JSON.stringify(s,0,2)))}}]),n}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}],[[17,1,2]]]);
//# sourceMappingURL=main.a7b4b6dc.chunk.js.map