!function(e){var n={};function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=8)}([function(e,n){e.exports=require("Reactive")},function(e,n){e.exports=require("Animation")},function(e,n){e.exports=require("FaceTracking")},function(e,n){e.exports=require("Time")},function(e,n){e.exports=require("TouchGestures")},function(e,n){e.exports=require("Diagnostics")},function(e,n){e.exports=require("Scene")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.hello=function(e,n){return"helloooooo"}},function(e,n,t){"use strict";var i=function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n}(t(7));var o=t(6),r=t(5),c=t(4),a=t(3),l=t(2),u=t(1),s=(t(0),o.root.child("Device").child("Camera").child("Focal Distance")),d=s.child("2DCanvas0"),f=d.child("scoreText"),h=(s.child("lives").child("2DCanvas1").child("text1"),o.root.child("Device").child("Camera").child("Focal Distance").child("facetracker0")),m=l.face(0).mouth.openness.gt(.3).and(l.count.gt(0)),p=l.face(0).mouth.center,v=s.child("endScreen"),g=s.child("startScreen"),x=v.child("2DCanvas1").child("scoreText"),b=v.child("2DCanvas1").child("restartButton"),D=g.child("2DCanvas1").child("startButton"),y=[{element:s.child("chicken0")},{element:s.child("chicken1")},{element:s.child("chicken2")}],S=s.child("lives"),T=[S.child("life0"),S.child("life1"),S.child("life2"),S.child("life3"),S.child("life4")];r.log("hello "+i.hello(1,2));var C,M=0,O=0,_="start",q=function(e){var n=Math.floor(3e3*Math.random())+1e3;e.element.name;e.randomTimeId=a.setTimeout(function(){e.element.hidden=!1,e.mover=E(e)},n)},E=function(e){var n=u.timeDriver({durationMilliseconds:4e3,loopCount:1,mirror:!1}),t=e.element,i=u.samplers.linear(27,-40),o=u.animate(n,i);e.animationSignal=o,e.animationDriver=n,t.transform.y=o,n.start(),n.onCompleted().subscribe(function(n){"playing"===_&&q(e)}),e.animationSignal.lt(-15).monitor().subscribe(function(e){r.log("LOSE LIFE");P(-1)})},j=(m.monitor().subscribe(function(e){if(1==e.newValue&&"playing"===_){var n=p.x.lastValue,t=p.y.lastValue;y.forEach(function(e){var i=e.element,o=i.transform.x.lastValue,c=i.transform.y.lastValue;j(n,t,o,c,15,15)&&(M+=5,f.text="score: "+M.toString(),x.text="Congratulations!\n You Scored:\n "+M.toString(),r.log("EAT!"),e.animationDriver.reset())})}}),function(e,n,t,i,o,r){var c=t-e,a=i-n;return c*=c,a*=a,Math.hypot(t-e,i-n)<=o}),k=function(){_="playing",f.text="score: "+M.toString(),O+=5,S.hidden=!1,h.hidden=!1,d.hidden=!1,g.hidden=!0,V(O),y.forEach(function(e){q(e)})},P=function(e){O?V(O+=e):(r.log("game over!"),w())},V=function(e){T.forEach(function(n,t){n.hidden=!(t<e)})},F=function(e){x.text="Congratulations!\n You Scored:\n "+M.toString(),v.hidden=!e},w=function(){_="stopped",S.hidden=!0,h.hidden=!0,d.hidden=!0,F(!0),y.forEach(function(e){e.animationDriver.reset(),e.animationDriver.stop(),a.clearTimeout(e.randomTimeId)})};C=b,c.onTap(C).subscribe(function(e){r.log("restart!"),F(!1),M=0,k()}),function(e){c.onTap(e).subscribe(function(e){r.log("start!"),k()})}(D)}]);