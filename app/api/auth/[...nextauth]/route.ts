import {NextResponse} from 'next/server';
// Old OAuth links cannot create sessions after the switch to class-code access.
const removed=()=>NextResponse.json({error:'Use o código da turma na página inicial.'},{status:410});
export const GET=removed;
export const POST=removed;
