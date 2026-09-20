import raw from '@/content/catalog.json';
export type Item={id:string;subject:string;week:number;module:string;kind:'read'|'mcq'|'recall'|'written';title:string;source:string;version:string;options?:string[];answer?:number;explanation?:string;rubric?:string[];hint?:string;visual?:string;solutionVisual?:string;body?:string};
export const items=raw.items as Item[];export const subjects=raw.subjects;export const byId=new Map(items.map(i=>[i.id,i]));
export function publicItem(i:Item){const{answer,explanation,rubric,solutionVisual,hint,...safe}=i;return {...safe,hasHint:!!hint};}
export const index=items.map(({id,subject,week,module,kind,title})=>({id,subject,week,module,kind,title}));
