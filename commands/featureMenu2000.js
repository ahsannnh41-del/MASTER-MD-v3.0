import { GOJO_2000_FEATURES } from './featureRegistry2000.js';

const RPG_WORDS = new Set(['rpg','class','inventory','equip','unequip','use','istirahat','hunt','lawan','bossinfo','boss','dungeoninfo','dungeon','toko','beli','jual','daily','joblist','kerja','nabung','tarik','transfer','rob','petshop','buypet','petinfo','setpet','quest','questclaim','achievement','ranking','leaderboard','marry','divorce']);
const ADMIN_WORDS = new Set(['mute','unmute','mutestatus','kick','promote','demote','add','warn','unwarn','checkwarn','warnlimit','groupinfo','setname','setdesc','lockgroup','unlockgroup','link','revoke','leave','hidetag','tagall','listadmin','membercount','setwelcome','setfarewell','welcome','farewell','antigb','antilink','antispam','antitoxic','antishortlink','slowmode','lockmedia','lockstiker','antilinkphising','antijudol','antipinjol','anticaps','antivirtex','antitag','antinsfw','hapusnsfw','cekstrikensfw','resetnsfwstrike','setnsfwlimit','resetprotection','antilinkall','anticall','antichat','helpproteksi','grouplockstatus','addbadword','delbadword','listbadword']);

export const totalFitur = () => GOJO_2000_FEATURES.length;
export const allMenu = () => GOJO_2000_FEATURES.slice();
export const menu = () => {
  const RPG=[], ADMIN=[], OTHER=[];
  for (const n of GOJO_2000_FEATURES) {
    if (n.startsWith('rpg') || RPG_WORDS.has(n)) RPG.push(n);
    else if (n.startsWith('admin') || ADMIN_WORDS.has(n)) ADMIN.push(n);
    else OTHER.push(n);
  }
  return { RPG, ADMIN, OTHER };
};
