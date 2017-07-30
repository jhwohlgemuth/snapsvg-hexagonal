"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a};(function(a){if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"==typeof window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,b.hexagonal=a()}})(function(){var a=Math.PI,b=Math.sin,c=Math.cos;return function b(c,d,e){function a(h,i){if(!d[h]){if(!c[h]){var j="function"==typeof require&&require;if(!i&&j)return j(h,!0);if(g)return g(h,!0);var k=new Error("Cannot find module '"+h+"'");throw k.code="MODULE_NOT_FOUND",k}var f=d[h]={exports:{}};c[h][0].call(f.exports,function(b){var d=c[h][1][b];return a(d?d:b)},f,f.exports,b,c,d,e)}return d[h].exports}for(var g="function"==typeof require&&require,f=0;f<e.length;f++)a(e[f]);return a}({1:[function(a,b){"use strict";function c(a){return Array(a).fill(0).map(function(a,b){return b})}var d=Date.now;b.exports={debounce:function(a,b,c){var e,f,g,h,i,j=function(){var k=d()-h;k<b&&0<=k?e=setTimeout(j,b-k):(e=null,!c&&(i=a.apply(g,f),!e&&(g=f=null)))};return function(){g=this,f=arguments,h=d();var k=c&&!e;return e||(e=setTimeout(j,b)),k&&(i=a.apply(g,f),g=f=null),i}},isEmpty:function(a){return!Array.isArray(a)||0===a.length},isTouch:function(){return!!("ontouchstart"in window)||0<window.navigator.msMaxTouchPoints},range:c,zip:function(d,a){return c(d.length).map(function(b,c){return[d[c],a[c]]})}}},{}],2:[function(d,e){"use strict";var f=d("./common"),g=f.zip;e.exports=function(d,e,f){e=e||0,f=f||0;var h=a/6,i=d*b(h),j=d*c(h),k=[0,j,2*j,2*j,j,0].map(function(a){return a+e}),l=[i,0,i,i+d,2*i+d,i+d].map(function(a){return a+f}),m=g(k,l);return this.addClass("hexagon").polygon(m)}},{"./common":1}],3:[function(d,e){"use strict";var f=Object.assign,g=Math.ceil,h=d("./common"),i=h.isTouch,j=h.zip,k={style:"-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;"};e.exports=function(d){var e=d.sideLength,h=d.reverse,l=d.width,m=d.x,n=d.y;m=m||0,n=n||0;var o,p,q={fill:"#222",stroke:"#222",strokeWidth:"1px"},r={cursor:"pointer",fill:"#FFF",stroke:"#333"},s=4,t=a/6,u=e*b(t),v=e*c(t),x=e/2,y=e+u,z=l-v,w=g(l/2)+x,A=y/2+x/s;h?(o=[0,v+z,2*v+z,2*v+z,v+0,0],p=[0,0,u,u+e,u+e,0+e]):(o=[0,v+0,2*v+z,2*v+z,v+z,0],p=[u,0,0,0+e,u+e,u+e]);var B=j(o.map(function(a){return a+m}),p.map(function(a){return a+n})),C=r.fill,D=this.text(m,n,d.title).addClass("menu-item-title").attr({x:"+="+w,y:"+="+A,fill:C,fontSize:x,textAnchor:"middle"}),E=this.text(m,n,d.subtitle).addClass("menu-item-subtitle").attr({x:m+v,y:"+="+(A+x/2),fill:C,fontSize:x*0.7,textAnchor:"middle",opacity:0}),F=this.polygon(B).attr(q),G=f(this.group(F,D,E),{bar:F,width:l,height:y,title:D,subTitle:E,hoverAnimationDisabled:!1});G.addClass("hexagonalButton menu-item").attr(k),i()&&G.addClass("touch");var H=function(){if(G.hasClass("disabled")||G.hasClass("active")||G.focus(),!G.hoverAnimationDisabled&&0<E.attr("text").length){D.animate({fontSize:x*0.8,y:n+A-x/s},100),E.animate({opacity:1,x:m+w},100)}},I=function(){G.blur()};return G.enableHoverAnimation=function(){return G.hoverAnimationDisabled=!1,G.hover(H,I),G},G.disableHoverAnimation=function(){return G.hoverAnimationDisabled=!0,G.unhover(H,I),G},G.enable=function(){return G.removeClass("active").removeClass("disabled").attr({opacity:1}).enableHoverAnimation().blur()},G.disable=function(){return["bar","title","subTitle"].forEach(function(a){f(G[a].node.style,{cursor:"default"})}),G.addClass("disabled").attr({opacity:0.8}).disableHoverAnimation()},G.focus=function(){f(G.bar.node.style,f({},q,r));var a=r.stroke;return["bar","title","subTitle"].forEach(function(a){f(G[a].node.style,{cursor:"pointer"})}),G.title.node.style.fill=a,G.subTitle.node.style.fill=a,G},G.blur=function(){return f(G.bar.node.style,q),G.title.node.style.fill="#FFF",!G.hoverAnimationDisabled&&0<E.attr("text").length&&(G.title.animate({fontSize:x,y:n+A},100),G.subTitle.animate({opacity:0,x:m+v},100)),G},G.enableHoverAnimation(),G}},{"./common":1}],4:[function(d,e){"use strict";var f=Object.assign,g=Math.sqrt,h=d("./common"),i=h.debounce,j=h.isEmpty,k=1,l=4,m=a/6,n=function(a){return a.preventDefault()},o=function(a){return function(b){return a.attr({transform:"translateX("+b+")"})}};e.exports=function(a,d){function e(a){return 0<a?a*(A+g(2)*l)+(a-1)*E:-E}function h(){return C=a.map(function(b,c){var d=Array.isArray(a[c].submenu)&&0<a[c].submenu.length;return b.sideLength=A,b.width=B,b.x=0-H,b.y=E+c*(G+l+2*k),b.level=d?0:0,x.hexagonalButton(b)}),C}function p(){var a=x;w("before:reset",{menu:a}),C.forEach(function(b){0<b.submenu.length&&(b.submenu.forEach(function(a){return a.remove()}),b.submenu=[]),b.isActive=!1;var c=x.visible?I:-I,d=x.visible?I:-I;Snap.animate(c,d,o(b),50,mina.linear,function(){s(b.enable()),b.index===C.length-1&&w("reset",{menu:a})})})}function q(b){x.visible||C.forEach(function(c,d){setTimeout(function(){Snap.animate(0,I,o(c),b,mina.easein,function(){var b=x;d===a.length-1?(x.visible=!0,w("show",{menu:b})):0===d&&w("before:show",{menu:b})})},b/2*d)})}function r(b){var c=50,d=f(b,{isActive:!0,submenu:[]}),g=d.index,h=a[g].submenu;d.addClass("active").disableHoverAnimation(),d.submenu=h.map(function(a,b){var c=a.title,d=a.subtitle,f=E+g*(G+l+2*k)+e(b+1);return x.hexagonalButton({x:I-F+0*k+0*F-2*l+I,y:f,title:c,subtitle:d,sideLength:A,width:B,level:0}).attr({opacity:0})}),d.submenu.forEach(function(b,e){b.index=e;var h={menu:x,parent:d,target:b},i="click:"+g+":",j=function(){w("click:child",h),w(i+"child",h),w(i+e,h)};setTimeout(function(){f(b.node,{onclick:j,ontouchstart:j,oncontextmenu:n}),b.attr({opacity:1}),Snap.animate(0,-I,o(b),c,mina.easein,function(){a[e].submenu&&e===a[e].submenu.length-1&&w("show:submenu",h)})},c*e)}),C.filter(function(a,b){return b!==g}).forEach(function(a){Snap.animate(I,H+l+k,o(a),c,mina.linear,function(){t(a.disable())})})}function s(a){f(a.node,{onclick:J(a),ontouchstart:J(a),onmousedown:a.focus})}function t(a){f(a.node,{onclick:n,ontouchstart:n,onmousedown:n})}function u(b){C.slice(0).reverse().forEach(function(c,d){Snap.animate(I,0,o(c),b+b/2*d,mina.backout,function(){var b=x;d===a.length-1?(x.visible=!1,w("hide",{menu:b})):0===d&&w("before:hide",{menu:b})})})}function v(a){p.bind(x)(),u.bind(x)(a)}function w(a,b){var c;window.CustomEvent?c=new CustomEvent(a,{detail:b}):(c=document.createEvent("CustomEvent"),c.initCustomEvent(a,!0,!0,b)),x.node.dispatchEvent(c)}var x=f(this,{visible:!1}),y=function(){return x.visible},z=d.duration,A=d.sideLength,B=d.width,C=[],D=z||100,E=A*b(m),F=A*c(m),G=A+E,H=B+F+2*l+2*k,I=H+F+2*l,J=function(a){return function(b){b.preventDefault();var c=C[a.index],d=c.index,e=c.isActive,f=c.hasSubmenu;w("click:"+d,{menu:x,parent:null,target:c}),e?p.bind(x)():f&&(c.blur(),r(c))}},K=i(function toggleMenu(){return(y()?v:q).bind(x)(D)},D*2.5,!0);return function(){h().forEach(function(b,c){var d=!j(a[c].submenu);f(b.node,{onblur:n,oncontextmenu:n}),s(f(b,{index:c,submenu:[],hasSubmenu:d}))})}(),{on:function on(a,b){return x.node.addEventListener(a,b)},off:function off(a,b){return x.node.removeEventListener(a,b)},buttons:C,isVisible:y,reset:p,toggle:K}}},{"./common":1}],5:[function(a,b){"use strict";var c=a("./hexagon"),d=a("./hexagonalButton"),e=a("./hexagonalMenu");b.exports=function(a,b,f){Object.assign(f.prototype,{hexagon:c,hexagonalButton:d,hexagonalMenu:e})}},{"./hexagon":2,"./hexagonalButton":3,"./hexagonalMenu":4}]},{},[5])(5)});
