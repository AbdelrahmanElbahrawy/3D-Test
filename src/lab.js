import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export function createLab(canvas){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e2e8dc');scene.fog=new THREE.Fog('#e2e8dc',17,36);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const camera=new THREE.PerspectiveCamera(39,1,.1,80);const home=new THREE.Vector3(8,7.1,11.5);camera.position.copy(home);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,2.1,0);controls.enableDamping=true;controls.minDistance=6;controls.maxDistance=19;controls.maxPolarAngle=Math.PI/2.1;controls.minPolarAngle=.25;controls.maxAzimuthAngle=1.2;controls.minAzimuthAngle=-1.2;
 scene.add(new THREE.HemisphereLight('#fcfff0','#929d80',2.0));const sun=new THREE.DirectionalLight('#fff5d8',2.8);sun.position.set(-5,10,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});sun.shadow.bias=-.001;scene.add(sun);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...extra});
 const cream=mat('#e5e7d8'),sage=mat('#9da991'),dark=mat('#3b443d'),steel=mat('#adb6ad',{metalness:.65,roughness:.28}),white=mat('#f4f3df');
 const glass=mat('#d4ece2',{transparent:true,opacity:.36,roughness:.12,metalness:.05,side:THREE.DoubleSide,depthWrite:false});
 const meshes=[];const groups={};
 function mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=!material.transparent;m.receiveShadow=true;parent.add(m);return m;}
 const box=(p,x,y,z,w,h,d,m)=>mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
 const cyl=(p,x,y,z,r1,r2,h,m)=>mesh(new THREE.CylinderGeometry(r1,r2,h,48),m,p,x,y,z);
 function ring(p,x,y,z,r,m){const a=mesh(new THREE.TorusGeometry(r,.018,8,48),m,p,x,y,z);a.rotation.x=Math.PI/2;return a;}
 function label(p,text,x,y,z,w=1,h=.36){const c=document.createElement('canvas');c.width=512;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#f6f4df';ctx.fillRect(0,0,512,160);ctx.fillStyle='#566647';ctx.font='600 39px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,94);return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}),p,x,y,z);}
 function group(id,x,z){const g=new THREE.Group();g.position.set(x,2.08,z);scene.add(g);groups[id]=g;return g;}
 function beaker(g,x,y,z,r=.43,h=1.03){cyl(g,x,y+h/2,z,r,r,h,glass);ring(g,x,y+h,z,r,glass);cyl(g,x,y+.025,z,r,r,.05,glass);for(let i=1;i<5;i++){box(g,x+r*.65,y+h*i/5,z+r*.77,.12,.013,.014,white);}return g;}
 function flask(g,x,y,z){const pts=[[.08,0],[.42,.04],[.46,.12],[.39,.42],[.16,.82],[.14,1.05]].map(a=>new THREE.Vector2(...a));mesh(new THREE.LatheGeometry(pts,48),glass,g,x,y,z);ring(g,x,y+1.05,z,.14,glass);}
 box(scene,0,-.12,0,50,.2,50,cream);box(scene,0,4,-4.2,26,10,.25,mat('#e2e7dc'));
 for(let i=-12;i<13;i++){box(scene,i,3.7,-4.04,.015,5,.01,mat('#cfd8c8'));}for(let i=0;i<7;i++)box(scene,0,i,-4.03,26,.012,.01,mat('#cfd8c8'));
 // Tall windows and a quiet back bench anchor the room.
 box(scene,-6,5,-3.9,4.5,3,.1,white);box(scene,-6,5,-3.8,4.2,2.7,.08,mat('#edf4dc',{emissive:'#d9ebc0',emissiveIntensity:.5}));box(scene,-6,5,-3.7,.07,2.7,.1,white);box(scene,-6,5,-3.7,4.2,.06,.1,white);
 box(scene,1,1,-3.2,9,2,1.3,sage);box(scene,1,2.04,-3.2,9.3,.16,1.5,cream);for(let i=-3;i<6;i++){box(scene,i,1,-2.53,.02,1.8,.02,cream);box(scene,i+.4,1.65,-2.49,.3,.04,.04,steel);}
 box(scene,2,4.4,-3.78,5,.12,.6,mat('#aab69c'));for(let i=0;i<6;i++){cyl(scene,.1+i*.68,4.8,-3.7,.15,.17,.65,mat(i%2?'#8e9d76':'#d0c8a3'));cyl(scene,.1+i*.68,5.14,-3.7,.12,.12,.09,dark);}
 label(scene,'ORGANIC CHEMISTRY',1,5.7,-4,3.4,.6);
 box(scene,0,1,0,9,1.9,3.7,sage);box(scene,0,1.98,0,9.5,.2,4.15,mat('#edeedf'));box(scene,0,1.82,0,9.35,.1,4.02,mat('#697862'));
 for(let i=-4;i<4;i+=1.35){box(scene,i+.65,.94,1.86,1.29,1.65,.06,mat('#a6b198'));box(scene,i+.65,1.58,1.93,.45,.05,.06,steel);}
 // Water bottle and sample container.
 const water=group('water',-3.5,.05);cyl(water,0,.53,0,.34,.37,1.06,glass);cyl(water,0,.44,0,.32,.34,.8,mat('#afcecf',{transparent:true,opacity:.6}));cyl(water,0,1.09,0,.22,.3,.2,glass);cyl(water,0,1.25,0,.23,.23,.16,mat('#d6dfbd'));label(water,'DISTILLED',0,.67,.375,.58,.2);label(water,'WATER',0,.46,.375,.58,.2);
 const sample=group('jar',-2.4,.65);cyl(sample,0,.3,0,.3,.3,.6,mat('#665039',{transparent:true,opacity:.9}));cyl(sample,0,.64,0,.32,.32,.11,dark);label(sample,'C₆H₅COOH',0,.35,.306,.5,.18);label(sample,'+ CHARCOAL',0,.18,.307,.5,.12);const scoop=group('sample',-2,.9);const spatula=box(scoop,0,.06,0,.09,.025,.8,steel);spatula.rotation.y=-.4;cyl(scoop,-.12,.09,.29,.11,.08,.03,mat('#55594b'));
 const burner=group('burner',-.85,0);cyl(burner,0,.06,0,.3,.34,.12,dark);cyl(burner,0,.33,0,.07,.1,.48,steel);cyl(burner,0,.54,0,.1,.1,.08,steel);
 for(let i=0;i<3;i++){const angle=i*Math.PI*2/3;const leg=cyl(burner,Math.cos(angle)*.43,.65,Math.sin(angle)*.43,.025,.025,1.3,steel);leg.rotation.z=Math.cos(angle)*.12;leg.rotation.x=Math.sin(angle)*-.12;}ring(burner,0,1.25,0,.48,dark);box(burner,0,1.29,0,.95,.025,.95,steel);const vessel=group('beaker',-1.2,1.05);beaker(vessel,0,0,0);
 const liquid=cyl(vessel,0,.25,0,.408,.408,.44,mat('#b6d6d1',{transparent:true,opacity:.7}));liquid.visible=false;
 const solids=new THREE.Group();vessel.add(solids);for(let i=0;i<42;i++){const m=mesh(new THREE.DodecahedronGeometry(.035+(i%3)*.012),mat(i%3===0?'#33372e':'#fffbed'),solids,Math.sin(i*4)*.32,.05+(i%5)*.025,Math.cos(i*6)*.3);}
 solids.visible=false;
 const flame=mesh(new THREE.ConeGeometry(.095,.45,24),mat('#8bc4ef',{emissive:'#3b9bff',emissiveIntensity:2,transparent:true,opacity:.8}),burner,0,.83,0);flame.visible=false;
 function filtration(id,x,z){const g=group(id,x,z);box(g,0,.045,0,1.1,.09,.85,dark);cyl(g,-.47,.94,0,.024,.024,1.85,steel);box(g,-.23,1.55,0,.5,.03,.035,steel);const receiver=new THREE.Group();g.add(receiver);flask(receiver,.12,.1,0);const funnel=cyl(g,.12,1.48,0,.38,.055,.5,glass);cyl(g,.12,1.16,0,.04,.04,.26,glass);const paper=cyl(g,.12,1.55,0,.335,.035,.36,white);return {g,paper,receiver};}
 const hot=filtration('hotfilter',.85,-.25);const cold=filtration('coldfilter',2.35,-.25);
 groups.flask=hot.receiver;
 const filtrate=cyl(hot.receiver,.12,.28,0,.35,.38,.29,mat('#d2e3c8',{transparent:true,opacity:.68}));filtrate.visible=false;
 const residue=cyl(hot.g,.12,1.7,0,.22,.05,.05,mat('#393d32'));residue.visible=false;
 const mother=cyl(cold.g,.12,.28,0,.35,.38,.29,mat('#d1ddbc',{transparent:true,opacity:.6}));mother.visible=false;
 const product=group('product',3.5,.9);cyl(product,0,.045,0,.47,.47,.09,glass);cyl(product,0,.1,0,.43,.43,.012,white);
 function crystals(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);for(let i=0;i<40;i++){const a=mesh(new THREE.OctahedronGeometry(.04,0),white,g,Math.sin(i*2.3)*.23,(i%4)*.013,Math.cos(i*4.2)*.2);a.scale.set(.65,1,2.4);a.rotation.set(i,i*.2,i*.5);}g.visible=false;return g;}
 const growing=crystals(hot.receiver,.12,.23,0),wet=crystals(cold.g,.12,1.73,0),dry=crystals(product,0,.15,0);
 const cooling=group('cooling',.55,1.12);box(cooling,0,.035,0,1.15,.07,.9,mat('#bdcda8'));label(cooling,'COOL',0,.11,.46,.6,.15);
 const paperGroup=new THREE.Group();cold.g.add(paperGroup);paperGroup.add(cold.paper,wet);groups.paper=paperGroup;
 // Small supporting details: folded filter papers, measuring cylinder and goggles.
 const papers=group('papers',-2.7,-.8);for(let i=0;i<4;i++)cyl(papers,0,.015+i*.009,0,.32,.32,.008,white);
 const measure=group('measure',-2.3,-.65);cyl(measure,.45,.04,0,.22,.22,.08,glass);cyl(measure,.45,.5,0,.12,.12,.95,glass);for(let i=1;i<9;i++)box(measure,.5,i*.1, .11,.09,.009,.01,white);
 for(const [id,g]of Object.entries(groups))g.traverse(o=>{if(o.isMesh){o.userData.tool=id;meshes.push(o);}});
 groups.beaker.traverse(o=>{if(o.isMesh)o.userData.tool='beaker';});hot.receiver.traverse(o=>{if(o.isMesh)o.userData.tool='flask';});paperGroup.traverse(o=>{if(o.isMesh)o.userData.tool='paper';});
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 let drag=null,current={step:0};
 const anchors={water:[-3.5,2.8,.05],sample:[-2.05,2.22,.9],beaker:[-1.2,2.7,1.05],burner:[-.85,3.37,0],hotfilter:[.97,3.8,-.25],flask:[.97,2.7,-.25],coldfilter:[2.47,3.8,-.25],paper:[2.47,3.82,-.25],product:[3.5,2.23,.9],cooling:[.55,2.2,1.12]};
 function point(id){let a=anchors[id];if(id==='beaker'&&current.step>=3)a=[-.85,4,0];if(id==='flask'&&current.step>=5)a=[.55,2.7,1.12];return new THREE.Vector3(...a);}
 function screenPoint(id){const p=point(id).project(camera),r=canvas.getBoundingClientRect();return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};}
 function setRay(x,y){const r=canvas.getBoundingClientRect();mouse.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);}
 function pick(x,y,exclude){setRay(x,y);return ray.intersectObjects(meshes).find(h=>{if(h.object.userData.tool===exclude)return false;let o=h.object;while(o){if(!o.visible)return false;o=o.parent;}return true;})?.object.userData.tool;}
 function startDrag(id,x,y){const g=groups[id];if(!g)return;controls.enabled=false;const normal=camera.getWorldDirection(new THREE.Vector3());const plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,point(id));setRay(x,y);const origin=ray.ray.intersectPlane(plane,new THREE.Vector3());drag={g,position:g.position.clone(),plane,origin};}
 function moveDrag(x,y){if(!drag?.origin)return;setRay(x,y);const p=ray.ray.intersectPlane(drag.plane,new THREE.Vector3());if(p){const delta=p.sub(drag.origin);drag.g.position.copy(drag.position).add(delta);}}
 function endDrag(){if(drag)drag.g.position.copy(drag.position);drag=null;controls.enabled=true;}
 const sourceHandle=document.querySelector('#scene-source'),targetHandle=document.querySelector('#scene-target');
 function placeHandles(){
  const r=canvas.getBoundingClientRect();
  const positions=[sourceHandle,targetHandle].map(el=>{const id=el.dataset.dragSource||el.dataset.dropTarget;if(!id||el.hidden)return null;const p=screenPoint(id);return {el,x:Math.max(60,Math.min(r.width-65,p.x-r.left)),y:Math.max(95,Math.min(r.height-85,p.y-r.top))};});
  const [a,b]=positions;
  if(a&&b&&Math.abs(a.x-b.x)<(a.el.offsetWidth+b.el.offsetWidth)/2+12&&Math.abs(a.y-b.y)<60){const mid=(a.y+b.y)/2;a.y=mid-36;b.y=mid+36;}
  for(const p of positions){if(p){p.el.style.left=p.x+'px';p.el.style.top=p.y+'px';}}
 }
 const resize=new ResizeObserver(()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(canvas);
 let heating=false;function animate(t){requestAnimationFrame(animate);controls.update();placeHandles();if(heating)flame.scale.set(1,.95+Math.sin(t*.015)*.12,1);renderer.render(scene,camera);}requestAnimationFrame(animate);
 return {pick,screenPoint,startDrag,moveDrag,endDrag,resetView(){camera.position.copy(home);controls.target.set(0,2.1,0);},zoom(f){camera.position.sub(controls.target).multiplyScalar(f).add(controls.target);},update(s,busy=false){current=s;const heated=s.step>=3||(busy&&s.step===2),cooled=s.step>=5||(busy&&s.step===4);vessel.position.set(heated?-.85:-1.2,heated?3.4:2.08,heated?0:1.05);hot.receiver.position.set(cooled?-.42:0,0,cooled?1.37:0);liquid.visible=s.step>0;solids.visible=s.step>=2||s.scoops>0;solids.children.forEach((m,i)=>{m.visible=s.step<=2||i%3===0;});liquid.material.color.set(s.step>=2&&s.step<4?'#858879':'#b6d6d1');liquid.visible=s.step>0&&s.step<4;solids.visible=solids.visible&&s.step<4;flame.visible=busy&&s.step===2;heating=flame.visible;filtrate.visible=s.step>=4&&s.step<6;residue.visible=s.step>=4;growing.visible=s.step===5;mother.visible=s.step>=6;wet.visible=s.step===6&&!s.completed;dry.visible=s.completed;cold.paper.visible=!s.completed;}};
}
