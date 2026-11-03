function userName(c={}){return c.pushName||c.name||c.username||'Kak';}
function prefix(c={}){return c.prefix||'.';}
function header(c,title='MASTER MD'){
 const n=userName(c),p=prefix(c);
 return `╭━━━〔 ✦ ${title} ✦ 〕━━━╮
│ 👋 Halo, *${n}*!
│ Selamat datang di *MASTER MD*
│ 👑 Developer: *AHSAN*
│
│ 🤖 Bot : MASTER MD
│ ⚡ Mode : ${c.mode||'Public'}
│ 📚 Fitur : ${c.totalFeatures||'2.000+'}
╰━━━━━━━━━━━━━━━━━━━━╯`;
}
function block(title,items,c){
 if(!items?.length)return '';
 const p=prefix(c);
 return `\n╭─〔 ${title} 〕\n${items.map(x=>`│ ${p}${x}`).join('\n')}\n╰──────────────────`;
}
function menu(c={},g={}){
 return header(c)+
 block('⚔️ RPG & ADVENTURE',g.rpg,c)+
 block('🛡️ ADMIN',g.admin,c)+
 block('🎮 FUN & GAMES',g.fun,c)+
 block('🛠️ TOOLS',g.tools,c)+
 block('🎨 MEDIA',g.media,c)+
 block('👤 USER',g.user,c)+
 `\n\n💡 Ketik *${prefix(c)}allmenu* untuk melihat semua fitur.`;
}
function allmenu(c={},g={}){
 let out=header(c,'ALL MENU');
 for(const [k,v] of Object.entries(g)) out+=block(k.toUpperCase(),v,c);
 return out+`\n\n✨ Total fitur : *${c.totalFeatures||Object.values(g).reduce((n,a)=>n+a.length,0)}*`;
}
module.exports={menu,allmenu};