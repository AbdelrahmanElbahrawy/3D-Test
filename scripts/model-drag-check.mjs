import {chromium} from '@playwright/test';
import * as THREE from 'three';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(800);
 // Hide only the HTML handles to exercise raycasting on the actual bottle mesh.
 await page.addStyleTag({content:'.scene-handle{pointer-events:none!important}'});
 const r=await page.locator('#scene').boundingBox();const camera=new THREE.PerspectiveCamera(39,r.width/r.height,.1,80);camera.position.set(8,7.1,11.5);camera.lookAt(0,2.1,0);camera.updateMatrixWorld();
 const project=a=>{const v=new THREE.Vector3(...a).project(camera);return {x:r.x+(v.x+1)*r.width/2,y:r.y+(1-v.y)*r.height/2};};
 const a=project([-3.5,2.8,.05]),b=project([-1.2,2.7,1.05]);
 await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:10});await page.mouse.up();await page.waitForFunction(()=>document.querySelector('#action').dataset.busy==='false');assert.equal(await page.locator('#step-title').textContent(),'Add the impure sample');
 // A guide-card drag uses the same drop validation and increments exactly once.
 const src=await page.locator('#drag-source').boundingBox(),dst=await page.locator('#drop-target').boundingBox();await page.mouse.move(src.x+src.width/2,src.y+src.height/2);await page.mouse.down();await page.mouse.move(dst.x+dst.width/2,dst.y+dst.height/2,{steps:10});await page.mouse.up();await page.waitForFunction(()=>document.querySelector('#action').dataset.busy==='false');assert.match(await page.locator('#hint').textContent(),/1\/3 spatulas/);
 console.log('Direct 3D model pickup/drop and guide-card drag both passed.');
}finally{await browser.close();}
