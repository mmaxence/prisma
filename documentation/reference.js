import * as library from '../src/index.js';
const root=document.querySelector('#effect-reference');
for(const effect of Object.values(library).filter(value=>value?.fragment)){
 const item=document.createElement('article');item.className='reference-card';
 const name=document.createElement('h3');name.textContent=effect.title;
 const code=document.createElement('code');code.textContent=effect.name;
 const description=document.createElement('p');description.textContent=effect.description;
 item.append(name,code,description);root.append(item);
}
