import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advance,initialState,steps,drop,validDrop} from './experiment.js';
test('full practical requires water, three spatulas, heating and both filtrations',()=>{let s=initialState();s=advance(s,'water');assert.equal(s.step,1);for(let i=0;i<3;i++)s=advance(s,'sample');assert.equal(s.step,2);assert.equal(s.scoops,3);for(const tool of ['burner','hotfilter','flask','coldfilter','product'])s=advance(s,tool);assert.equal(s.completed,true);assert.deepEqual(advance(s,'water'),s);});
test('out-of-order interactions cannot skip dissolution or filtration',()=>{for(let step=0;step<7;step++){const s={step,scoops:0,completed:false};for(const tool of steps.map(x=>x.tool).filter(x=>x!==steps[step].tool))assert.deepEqual(advance(s,tool),s);}});

test('every operation requires both the correct dragged source and destination',()=>{
 let s=initialState();
 for(let i=0;i<9;i++){
  const {source,target}=steps[s.step];
  assert.equal(validDrop(s,source,null),false);
  assert.deepEqual(drop(s,source,source),s);
  assert.deepEqual(drop(s,'unrelated',target),s);
  s=drop(s,source,target);
 }
 assert.equal(s.completed,true);
 assert.deepEqual(drop(s,'paper','product'),s);
});
