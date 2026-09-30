export const steps = [
 {title:'Measure the solvent',short:'Measure water',tool:'water',action:'Add 50 mL water',description:'Water is our solvent. Benzoic acid is poorly soluble in cold water, but highly soluble in hot water.',source:'water',target:'beaker',hint:'Drag the water bottle onto the beaker to measure and pour 50 mL.',result:'50 mL of water is in the beaker.'},
 {title:'Add the impure sample',short:'Add sample',tool:'sample',action:'Add a spatula',description:'Transfer 3 spatulas of the benzoic acid and charcoal mixture into the water. At room temperature, the solids remain suspended.',source:'sample',target:'beaker',hint:'Drag the loaded spatula onto the beaker three times, one spatula at a time.',result:'Three spatulas added. The dark mixture contains undissolved benzoic acid and charcoal.'},
 {title:'Dissolve with heat',short:'Heat & dissolve',tool:'burner',action:'Heat the mixture',description:'Heat the beaker over a flame. Benzoic acid dissolves in the hot water; the charcoal does not.',source:'beaker',target:'burner',hint:'Drag the beaker onto the tripod above the burner to start heating.',result:'The benzoic acid has dissolved. Black charcoal remains suspended.'},
 {title:'Filter while hot',short:'Hot filtration',tool:'hotfilter',action:'Filter hot solution',description:'Filter quickly through paper while the solution is hot. Insoluble charcoal stays on the paper; dissolved benzoic acid passes into the receiving flask.',source:'beaker',target:'hotfilter',hint:'Drag the hot beaker onto the hot filtration funnel to pour the solution.',result:'Charcoal is trapped on the filter paper. The hot filtrate is clear.'},
 {title:'Let crystals grow',short:'Cool & crystallize',tool:'flask',action:'Allow to cool',description:'Let the clear filtrate cool undisturbed. As solubility falls, benzoic acid forms crystals. Any soluble impurities remain in the water.',source:'flask',target:'cooling',hint:'Drag the receiving flask onto the cooling mat and let it stand.',result:'White benzoic acid crystals have formed in the cooled solution.'},
 {title:'Collect the crystals',short:'Cold filtration',tool:'coldfilter',action:'Filter cooled mixture',description:'Use cold gravity filtration to collect the crystals on fresh filter paper. The mother liquor passes into the flask below.',source:'flask',target:'coldfilter',hint:'Drag the cooled flask onto the cold filtration funnel.',result:'Wet benzoic acid crystals are retained on the fresh filter paper.'},
 {title:'Dry your product',short:'Dry crystals',tool:'product',action:'Dry on filter paper',description:'Leave the purified benzoic acid crystals on filter paper to dry. This completes the recrystallization procedure.',source:'paper',target:'product',hint:'Drag the filter paper holding the wet crystals onto the drying dish.',result:'Purified benzoic acid crystals are dry. Recrystallization complete.'}
];
export function initialState(){return {step:0,scoops:0,completed:false};}
export function advance(state,tool){
 if(state.completed || steps[state.step].tool!==tool)return {...state};
 if(state.step===1 && state.scoops<2)return {...state,scoops:state.scoops+1};
 return {...state,scoops:state.step===1?3:state.scoops,step:Math.min(state.step+1,6),completed:state.step===6};
}

export function validDrop(state, source, target) {
 const step = steps[state.step];
 return !state.completed && step.source === source && step.target === target;
}
export function drop(state, source, target) {
 return validDrop(state, source, target) ? advance(state, steps[state.step].tool) : {...state};
}
