"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a};(function(a){if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"==typeof window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,b.hexagonal=a()}})(function(){var a=Math.PI,b=Math.sin,c=Math.cos;return function b(c,d,e){function a(h,i){if(!d[h]){if(!c[h]){var j="function"==typeof require&&require;if(!i&&j)return j(h,!0);if(g)return g(h,!0);var k=new Error("Cannot find module '"+h+"'");throw k.code="MODULE_NOT_FOUND",k}var f=d[h]={exports:{}};c[h][0].call(f.exports,function(b){var d=c[h][1][b];return a(d?d:b)},f,f.exports,b,c,d,e)}return d[h].exports}for(var g="function"==typeof require&&require,f=0;f<e.length;f++)a(e[f]);return a}({1:[function(a,b){"use strict";function c(a){return Array(a).fill(0).map(function(a,b){return b})}var d=Date.now;b.exports={debounce:function(a,b,c){var e,f,g,h,i,j=function(){var k=d()-h;k<b&&0<=k?e=setTimeout(j,b-k):(e=null,!c&&(i=a.apply(g,f),!e&&(g=f=null)))};return function(){g=this,f=arguments,h=d();var k=c&&!e;return e||(e=setTimeout(j,b)),k&&(i=a.apply(g,f),g=f=null),i}},isEmpty:function(a){Array.isArray(a)&&0!==a.length},isTouch:function(){return!!("ontouchstart"in window)||0<window.navigator.msMaxTouchPoints},range:c,zip:function(d,a){return c(d.length).map(function(b,c){return[d[c],a[c]]})}}},{}],2:[function(d,e){"use strict";var f=d("./common"),g=f.zip;e.exports=function(d,e,f){e=e||0,f=f||0;var h=a/6,i=d*b(h),j=d*c(h),k=[0,j,2*j,2*j,j,0].map(function(a){return a+e}),l=[i,0,i,i+d,2*i+d,i+d].map(function(a){return a+f}),m=g(k,l);return this.addClass("hexagon").polygon(m)}},{"./common":1}],3:[function(d,e){"use strict";var f=Object.assign,g=Math.ceil,h=d("./common"),i=h.isTouch,j=h.zip,k={style:"-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;"};e.exports=function(d){var e=d.sideLength,h=d.reverse,l=d.width,m=d.x,n=d.y;m=m||0,n=n||0;var o,p,q={fill:"#222",stroke:"#222",strokeWidth:"1px"},r={cursor:"pointer",fill:"#FFF",stroke:"#333"},s=4,t=a/6,u=e*b(t),v=e*c(t),x=e/2,y=e+u,z=l-v,w=g(l/2)+x,A=y/2+x/s;h?(o=[0,v+z,2*v+z,2*v+z,v+0,0],p=[0,0,u,u+e,u+e,0+e]):(o=[0,v+0,2*v+z,2*v+z,v+z,0],p=[u,0,0,0+e,u+e,u+e]);var B=j(o.map(function(a){return a+m}),p.map(function(a){return a+n})),C=r.fill,D=this.text(m,n,d.title).addClass("menu-item-title").attr({x:"+="+w,y:"+="+A,fill:C,fontSize:x,textAnchor:"middle"}),E=this.text(m,n,d.subtitle).addClass("menu-item-subtitle").attr({x:m+v,y:"+="+(A+x/2),fill:C,fontSize:x*0.7,textAnchor:"middle",opacity:0}),F=this.polygon(B).attr(q),G=f(this.group(F,D,E),{bar:F,width:l,height:y,title:D,subTitle:E,hoverAnimationDisabled:!1});G.addClass("hexagonalButton menu-item").attr(k),i()&&G.addClass("touch");var H=function(){if(G.hasClass("disabled")||G.hasClass("active")||G.focus(),!G.hoverAnimationDisabled&&0<E.attr("text").length){D.animate({fontSize:x*0.8,y:n+A-x/s},100),E.animate({opacity:1,x:m+w},100)}},I=function(){G.blur()};return G.enableHoverAnimation=function(){return G.hoverAnimationDisabled=!1,G.hover(H,I),G},G.disableHoverAnimation=function(){return G.hoverAnimationDisabled=!0,G.unhover(H,I),G},G.enable=function(){return G.removeClass("active").removeClass("disabled").attr({opacity:1}).enableHoverAnimation().blur()},G.disable=function(){return["bar","title","subTitle"].forEach(function(a){f(G[a].node.style,{cursor:"default"})}),G.addClass("disabled").attr({opacity:0.8}).disableHoverAnimation()},G.focus=function(){f(G.bar.node.style,f({},q,r));var a=r.stroke;return["bar","title","subTitle"].forEach(function(a){f(G[a].node.style,{cursor:"pointer"})}),G.title.node.style.fill=a,G.subTitle.node.style.fill=a,G},G.blur=function(){return f(G.bar.node.style,q),G.title.node.style.fill="#FFF",!G.hoverAnimationDisabled&&0<E.attr("text").length&&(G.title.animate({fontSize:x,y:n+A},100),G.subTitle.animate({opacity:0,x:m+v},100)),G},G.enableHoverAnimation(),G}},{"./common":1}],4:[function(d,e){"use strict";var f=Object.assign,g=Array.isArray,h=Math.sqrt,i=d("./common"),j=i.debounce,k=i.isEmpty,l=1,n=4,m=a/6,o=function(a){return a.preventDefault()},p=function(a){return function(b){return a.attr({transform:"translateX("+b+")"})}};e.exports=function(a,d){function e(a){return 0<a?a*(B+h(2)*n)+(a-1)*F:-F}function i(){return D=a.map(function(b,c){var d=Array.isArray(a[c].submenu)&&0<a[c].submenu.length;return b.sideLength=B,b.width=C,b.x=0-H,b.y=F+c*(I+n+2*l),b.level=d?0:0,z.hexagonalButton(b)}),D}function q(){var a=z;x("before:reset",{menu:a}),D.forEach(function(b){0<b.submenu.length&&(b.submenu.forEach(function(a){return a.remove()}),b.submenu=[]),b.isActive=!1;var c=z.visible?J:-J,d=z.visible?J:-J;Snap.animate(c,d,p(b),50,mina.linear,function(){t(b.enable()),b.index===D.length-1&&x("reset",{menu:a})})})}function r(b){z.visible||D.forEach(function(c,d){setTimeout(function(){Snap.animate(0,J,p(c),b,mina.easein,function(){var b=z;d===a.length-1?(z.visible=!0,x("show",{menu:b})):0===d&&x("before:show",{menu:b})})},b/2*d)})}function s(b){var c=50,d=f(b,{isActive:!0,submenu:[]}),h=d.index,i=a[h].submenu;g(i)&&(d.addClass("active").disableHoverAnimation(),d.submenu=i.map(function(a,b){var c=a.title,d=a.subtitle,f=F+h*(I+n+2*l)+e(b+1);return z.hexagonalButton({x:J-G+0*l+0*G-2*n+J,y:f,title:c,subtitle:d,sideLength:B,width:C,level:0}).attr({opacity:0})}),d.submenu.forEach(function(b,e){b.index=e;var g={menu:z,parent:d,target:b},i="click:"+h+":",j=function(){x("click:child",g),x(i+"child",g),x(i+e,g)};setTimeout(function(){f(b.node,{onclick:j,ontouchstart:j,oncontextmenu:o}),b.attr({opacity:1}),Snap.animate(0,-J,p(b),c,mina.easein,function(){a[e].submenu&&e===a[e].submenu.length-1&&x("show:submenu",g)})},c*e)}),D.filter(function(a,b){return b!==h}).forEach(function(a){Snap.animate(J,H+n+l,p(a),c,mina.linear,function(){u(a.disable())})}))}function t(a){f(a.node,{onclick:K(a),ontouchstart:K(a),onmousedown:a.focus})}function u(a){f(a.node,{onclick:o,ontouchstart:o,onmousedown:o})}function v(b){D.slice(0).reverse().forEach(function(c,d){Snap.animate(J,0,p(c),b+b/2*d,mina.backout,function(){var b=z;d===a.length-1?(z.visible=!1,x("hide",{menu:b})):0===d&&x("before:hide",{menu:b})})})}function w(a){q.bind(z)(),v.bind(z)(a)}function x(a,b){var c;window.CustomEvent?c=new CustomEvent(a,{detail:b}):(c=document.createEvent("CustomEvent"),c.initCustomEvent(a,!0,!0,b)),z.node.dispatchEvent(c)}var z=f(this,{visible:!1}),y=function(){return z.visible},A=d.duration,B=d.sideLength,C=d.width,D=[],E=A||100,F=B*b(m),G=B*c(m),I=B+F,H=C+G+2*n+2*l,J=H+G+2*n,K=function(a){return function(b){b.preventDefault();var c=D[a.index],d=c.index,e=c.isActive,f=c.hasSubmenu;x("click:"+d,{menu:z,parent:null,target:c}),e?q.bind(z)():f&&(c.blur(),s(c))}},L=j(function toggleMenu(){return(y()?w:r).bind(z)(E)},E*2.5,!0);return function(){i().forEach(function(b,c){var d=!k(a[c].submenu);f(b.node,{onblur:o,oncontextmenu:o}),t(f(b,{index:c,submenu:[],hasSubmenu:d}))})}(),{on:function on(a,b){return z.node.addEventListener(a,b)},off:function off(a,b){return z.node.removeEventListener(a,b)},buttons:D,isVisible:y,reset:q,toggle:L}}},{"./common":1}],5:[function(a,b){"use strict";var c=a("./hexagon"),d=a("./hexagonalButton"),e=a("./hexagonalMenu");b.exports=function(a,b,f){Object.assign(f.prototype,{hexagon:c,hexagonalButton:d,hexagonalMenu:e})}},{"./hexagon":2,"./hexagonalButton":3,"./hexagonalMenu":4}]},{},[5])(5)});
