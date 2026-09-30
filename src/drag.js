import {steps,validDrop} from './experiment.js';

// Pointer Events provide the same drag lifecycle for mouse, touch and pen.
export function installDragging({canvas,getLab,getState,isBusy,onDrop,notify,names}) {
 let active=null,keyboardSource=null;
 const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.hidden=true;document.body.append(ghost);
 function targetAt(x,y){
  const el=document.elementFromPoint(x,y)?.closest('[data-drop-target]');
  if(el)return el.dataset.dropTarget;
  const rect=canvas.getBoundingClientRect();
  if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return null;
  const lab=getLab(),target=steps[getState().step].target;
  // Match the visibly highlighted hit area; also accept the model itself.
  const p=lab?.screenPoint(target);
  if(p&&Math.hypot(x-p.x,y-p.y)<40)return target;
  return lab?.pick(x,y,active?.source);
 }
 function highlight(target){
  document.querySelectorAll('[data-drop-target]').forEach(el=>{
   el.classList.toggle('drop-ready',!!(active||keyboardSource));
   el.classList.toggle('drop-over',!!target&&el.dataset.dropTarget===target&&validDrop(getState(),active?.source||keyboardSource,target));
  });
 }
 function cleanup(){
  const old=active;active=null;getLab()?.endDrag();ghost.hidden=true;document.body.classList.remove('dragging');
  if(old?.capture?.hasPointerCapture(old.id))old.capture.releasePointerCapture(old.id);
  highlight(null);
 }
 document.addEventListener('pointerdown',e=>{
  if(active){if(e.target===canvas||e.target.closest('[data-drag-source]')){e.preventDefault();e.stopImmediatePropagation();}return;}
  if(e.button!==0||isBusy()||getState().completed)return;
  const handle=e.target.closest('[data-drag-source]');
  const source=handle?.dataset.dragSource||(e.target===canvas?getLab()?.pick(e.clientX,e.clientY):null);
  if(!source)return;
  e.preventDefault();e.stopImmediatePropagation();keyboardSource=null;
  active={id:e.pointerId,source,x:e.clientX,y:e.clientY,moved:false,capture:handle||canvas};
  active.capture.setPointerCapture(e.pointerId);
  getLab()?.startDrag(source,e.clientX,e.clientY);
  ghost.textContent=names[source]||'Equipment';ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
  highlight(null);
 },true);
 document.addEventListener('pointermove',e=>{
  if(!active||e.pointerId!==active.id)return;
  e.preventDefault();e.stopImmediatePropagation();
  active.moved ||= Math.hypot(e.clientX-active.x,e.clientY-active.y)>8;
  if(!active.moved)return;
  ghost.hidden=false;document.body.classList.add('dragging');ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
  getLab()?.moveDrag(e.clientX,e.clientY);highlight(targetAt(e.clientX,e.clientY));
 },{capture:true,passive:false});
 document.addEventListener('pointerup',e=>{
  if(!active||e.pointerId!==active.id)return;
  e.preventDefault();e.stopImmediatePropagation();
  const {source,moved}=active,target=targetAt(e.clientX,e.clientY);cleanup();
  if(moved)onDrop(source,target);else notify('Hold and drag the equipment onto the highlighted destination.');
 },true);
 document.addEventListener('pointercancel',e=>{if(e.pointerId===active?.id)cleanup();},true);
 document.addEventListener('lostpointercapture',e=>{if(e.pointerId===active?.id)cleanup();},true);
 window.addEventListener('blur',()=>{cleanup();keyboardSource=null;highlight(null);});
 // Explicit pick-up and drop operations also support keyboard users.
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){cleanup();keyboardSource=null;highlight(null);return;}
  if(![' ','Enter'].includes(e.key)||isBusy()||getState().completed)return;
  const source=e.target.closest('[data-drag-source]'),target=e.target.closest('[data-drop-target]');
  if(source){e.preventDefault();keyboardSource=source.dataset.dragSource;highlight(null);notify(`${names[keyboardSource]} picked up. Focus the destination and press Enter to drop. Escape cancels.`);}
  else if(target&&keyboardSource){e.preventDefault();const id=keyboardSource;keyboardSource=null;highlight(null);onDrop(id,target.dataset.dropTarget);}
 });
}
