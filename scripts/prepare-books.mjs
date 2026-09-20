import fs from 'node:fs';
const paths={forma:['forma','index.html','prancha-0909-v1'],histo:['forma','histo-embrio.html','prancha-histo-embrio-v1'],molecula:['molecula','index.html','prancha-molecula-v1'],genetica:['genetica','index.html','prancha-genetica-v1'],ari:['ari','index.html','']};
const books={};for(const [id,[dir,file,key]]of Object.entries(paths)){books[id]={dir,key,html:(fs.existsSync('public/cadernos/'+dir+'/'+file)?fs.readFileSync('public/cadernos/'+dir+'/'+file,'utf8'):JSON.parse(fs.readFileSync('content/books.json'))[id].html)};}fs.writeFileSync('content/books.json',JSON.stringify(books));

for(const [dir,file] of Object.values(paths))fs.rmSync(`public/cadernos/${dir}/${file}`,{force:true});
