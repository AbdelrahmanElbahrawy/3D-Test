import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[];
async function center(page,selector){const b=await page.locator(selector).boundingBox();assert.ok(b,selector);return {x:b.x+b.width/2,y:b.y+b.height/2};}
async function mouseDrag(page,source,target){const a=await center(page,source),b=typeof target==='string'?await center(page,target):target;await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:12});await page.mouse.up();}
async function ready(page){await page.waitForFunction(()=>document.querySelector('#action').dataset.busy==='false');}
async function reset(page){await page.locator('#repeat').click();await page.locator('#confirm-reset').click();assert.equal(await page.locator('#percent').textContent(),'0%');}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(800);
 await page.locator('#scene-source').click();assert.equal(await page.locator('#percent').textContent(),'0%');
 await mouseDrag(page,'#scene-source',{x:50,y:100});assert.equal(await page.locator('#percent').textContent(),'0%');
 await mouseDrag(page,'.tool[data-drag-source="paper"]','#scene-target');assert.equal(await page.locator('#percent').textContent(),'0%');
 // Cancellation restores the dragged object and allows the next drag.
 const a=await center(page,'#scene-source');await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(a.x+60,a.y);await page.keyboard.press('Escape');await page.mouse.up();assert.equal(await page.locator('#percent').textContent(),'0%');
 await page.screenshot({path:'/tmp/bench-drag-desktop.png'});
 // Every operation is a real mouse drag between 3D scene handles.
 for(let i=0;i<9;i++){await mouseDrag(page,'#scene-source','#scene-target');await ready(page);console.log('Mouse operation',i+1,await page.locator('#step-title').textContent());}
 assert.equal(await page.locator('#step-title').textContent(),'A clearer result.');await reset(page);
 // Explicit keyboard pickup and drop remains available without click-to-advance.
 await page.locator('#drag-source').focus();await page.keyboard.press('Space');await page.locator('#drop-target').focus();await page.keyboard.press('Enter');await ready(page);assert.equal(await page.locator('#step-title').textContent(),'Add the impure sample');
 await page.locator('#protocol').click();assert.equal(await page.locator('#protocol-dialog').evaluate(x=>x.open),true);await page.locator('#close-protocol').click();
 await page.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto('http://127.0.0.1:5173');await mobile.waitForTimeout(800);
 const cdp=await mobile.context().newCDPSession(mobile);
 async function touchDrag(source,target,cancel=false){const a=await center(mobile,source),b=await center(mobile,target);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...a,id:1}]});for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/10,y:a.y+(b.y-a.y)*i/10,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});}
 await touchDrag('#scene-source','#scene-target',true);assert.equal(await mobile.locator('#percent').textContent(),'0%');
 await mobile.screenshot({path:'/tmp/bench-drag-touch.png'});
 for(let i=0;i<9;i++){await touchDrag('#scene-source','#scene-target');await ready(mobile);console.log('Touch operation',i+1,await mobile.locator('#step-title').textContent());}
 assert.equal(await mobile.locator('#percent').textContent(),'100%');assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('Passed: complete mouse and real touch drag workflows, tap rejection, wrong source/target, off-bench release, Escape/touch cancellation, keyboard pickup/drop, reset, protocol and mobile layout.');
}finally{await browser.close();}
