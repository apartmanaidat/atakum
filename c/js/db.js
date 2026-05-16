// ============================================================
// APARTMAN SİSTEMİ - localStorage VERİTABANI
// ============================================================
const DB = {
  get(col) { try { return JSON.parse(localStorage.getItem('birlik_'+col)||'[]'); } catch{ return []; } },
  set(col,data) { localStorage.setItem('birlik_'+col,JSON.stringify(data)); },
  getObj(col) { try { return JSON.parse(localStorage.getItem('birlik_'+col)||'{}'); } catch{ return {}; } },
  setObj(col,data) { localStorage.setItem('birlik_'+col,JSON.stringify(data)); },
  nextId(col) { const a=this.get(col); return a.length ? Math.max(...a.map(i=>i.id||0))+1 : 1; },
  insert(col,obj) { const a=this.get(col); const n={...obj,id:this.nextId(col)}; a.push(n); this.set(col,a); return n; },
  update(col,id,obj) { const a=this.get(col); const i=a.findIndex(x=>x.id==id); if(i>=0){a[i]={...a[i],...obj};this.set(col,a);} },
  delete(col,id) { this.set(col,this.get(col).filter(x=>x.id!=id)); },
  findOne(col,fn) { return this.get(col).find(fn)||null; },
  find(col,fn) { return fn?this.get(col).filter(fn):this.get(col); }
};

// ── AYARLAR ──
function getAyarlar() {
  const d = DB.getObj('ayarlar');
  return {
    basYil: d.basYil || 2025,
    basAy:  d.basAy  || 1,
    apartmanAdi: d.apartmanAdi || 'Apartman Yönetim Sistemi'
  };
}
function setAyarlar(obj) { DB.setObj('ayarlar', { ...getAyarlar(), ...obj }); }

// ── TARİFE ──
function getTarife(yil, ay) {
  const t = DB.findOne('tarifeler', t => t.yil==yil && t.ay==ay);
  if (t) return t.tutar;
  const all = DB.get('tarifeler')
    .filter(t => t.yil < yil || (t.yil==yil && t.ay<=ay))
    .sort((a,b) => a.yil!=b.yil ? b.yil-a.yil : b.ay-a.ay);
  return all.length ? all[0].tutar : 200;
}

// ── BAŞLANGIÇ VERİLERİ ──
function setupInitialData() {
  if (localStorage.getItem('birlik_initialized')) return;
  const users = [
    {id:1,  ad_soyad:"YÖNETİCİ",              daire_no:0,  telefon:"905078867460", sifre:"5555", rol:"yonetici"},
    {id:2,  ad_soyad:"İSMET ERDEM",            daire_no:1,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:3,  ad_soyad:"FİRDEVS KURU",           daire_no:2,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:4,  ad_soyad:"İBRAHİM İNEL",           daire_no:3,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:5,  ad_soyad:"MUAZZEZ ATLI",           daire_no:4,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:6,  ad_soyad:"ŞİRİN SARIÇOBAN",        daire_no:5,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:7,  ad_soyad:"ALİ SARISALTIK",         daire_no:6,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:8,  ad_soyad:"EMİNE AYNACI",           daire_no:7,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:9,  ad_soyad:"ŞEHNAZ ALKAN",           daire_no:8,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:10, ad_soyad:"PERİHAN OĞUZ",           daire_no:9,  telefon:"905078867460", sifre:"5555", rol:"sakin"},
    {id:11, ad_soyad:"SERFİNAZ VAROL",         daire_no:10, telefon:"905078867460", sifre:"5555", rol:"sakin"},
  ];
  DB.set('users', users);
  const tar = [];
  let tid=1;
  // 2026 tüm yıl: 50 TL (başlangıç 2026/01)
  for(let ay=1;ay<=12;ay++) tar.push({id:tid++,yil:2026,ay,tutar:50});
  for(let ay=1;ay<=12;ay++) tar.push({id:tid++,yil:2027,ay,tutar:50});
  DB.set('tarifeler', tar);
  DB.set('aidatlar', []);
  DB.set('gelirler', []);
  DB.set('giderler', []);
  DB.setObj('ayarlar', {basYil:2026, basAy:1, apartmanAdi:'Birlik Apartmanı'});
  localStorage.setItem('birlik_initialized','1');
}

// ── VERİ AKTARIMI ──
function exportAllData() {
  const keys = ['users','tarifeler','aidatlar','gelirler','giderler','ayarlar'];
  const data = {};
  keys.forEach(k => {
    const raw = localStorage.getItem('birlik_'+k);
    if (raw) data[k] = JSON.parse(raw);
  });
  data._exportDate = new Date().toISOString();
  data._version = '1.0';
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'apartman-yedek-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  showToast('Veriler dışa aktarıldı ✅','success');
}

function importAllData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const keys = ['users','tarifeler','aidatlar','gelirler','giderler'];
      keys.forEach(k => { if(data[k]) DB.set(k, data[k]); });
      if(data.ayarlar) DB.setObj('ayarlar', data.ayarlar);
      localStorage.setItem('birlik_initialized','1');
      showToast('Veriler içe aktarıldı ✅ Sayfa yenileniyor...','success');
      setTimeout(()=>location.reload(), 1500);
    } catch(err) {
      showToast('Geçersiz dosya!','error');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  const keys = ['users','tarifeler','aidatlar','gelirler','giderler','ayarlar','initialized'];
  keys.forEach(k => localStorage.removeItem('birlik_'+k));
  showToast('Tüm veriler silindi. Sayfa yenileniyor...','error');
  setTimeout(()=>location.reload(), 1500);
}

// ── SESSION ──
function setCurrentUser(u) { sessionStorage.setItem('birlikUser',JSON.stringify(u)); }
function getCurrentUser() { try{return JSON.parse(sessionStorage.getItem('birlikUser'));}catch{return null;} }
function logout() { sessionStorage.removeItem('birlikUser'); window.location.href=getBase()+'index.html'; }
function getBase() { return location.pathname.includes('/pages/') ? '../' : ''; }
function requireAuth() { const u=getCurrentUser(); if(!u){window.location.href='../index.html';return null;} return u; }
function requireAdmin() { const u=getCurrentUser(); if(!u||u.rol!=='yonetici'){window.location.href='../index.html';return null;} return u; }

// ── TOAST ──
function showToast(msg, type='success') {
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg; t.className='toast show '+type;
  clearTimeout(t._t); t._t=setTimeout(()=>t.className='toast',3000);
}

// ── FORMAT ──
function formatTL(v){ return '₺'+parseFloat(v||0).toFixed(2); }
function todayStr(){ return new Date().toISOString().split('T')[0]; }

// ════════════════════════════════════════════════════════════════
// BORÇ HESAPLAMA — Ana mantık
// Başlangıç tarihinden BUGÜNE KADAR (bu ay dahil) her ay için:
//   - O aya ait tarife tutarı = tahakkuk
//   - Eğer aidatlar tablosunda kayıt varsa odenen alınır
//   - Kayıt yoksa o ay hiç ödenmemiş demektir (odenen=0)
//   - Gelecek aylar HESABA KATILMAZ
//
// Döndürür: [ { yil, ay, tutar, odenen, kalan, durum, kayitId? }, ... ]
//   durum: 'odendi' | 'kismi' | 'beklemede'
// ════════════════════════════════════════════════════════════════
function getSakinBorcDetay(userId) {
  const ayar = getAyarlar();
  const now   = new Date();
  const simdiYil = now.getFullYear();
  const simdiAy  = now.getMonth() + 1; // 1-12

  const satirlar = [];

  let y = ayar.basYil;
  let m = ayar.basAy;

  while (y < simdiYil || (y === simdiYil && m <= simdiAy)) {
    const tarife = getTarife(y, m);
    const kayit  = DB.findOne('aidatlar', a => a.user_id == userId && a.yil == y && a.ay == m);

    const odenen = kayit ? (kayit.odenen || 0) : 0;
    const kalan  = tarife - odenen;
    let durum;
    if (odenen >= tarife)       durum = 'odendi';
    else if (odenen > 0)        durum = 'kismi';
    else                        durum = 'beklemede';

    satirlar.push({
      yil: y, ay: m,
      tutar: tarife,
      odenen,
      kalan: Math.max(0, kalan),
      durum,
      kayitId: kayit ? kayit.id : null
    });

    m++;
    if (m > 12) { m = 1; y++; }
  }

  return satirlar;
}

// Bir sakin için toplam borç (kalan) — bugüne kadar
function getSakinToplamBorc(userId) {
  const satirlar = getSakinBorcDetay(userId);
  let toplam = 0;
  satirlar.forEach(s => { toplam += s.kalan; });
  return toplam;
}

// Peşin ödemeleri bul — bugünden sonraki aylara yapılmış ödemeler
function getSakinPesinOdemeler(userId) {
  const now = new Date();
  const simdiYil = now.getFullYear();
  const simdiAy  = now.getMonth() + 1;

  return DB.find('aidatlar', a =>
    a.user_id == userId &&
    (a.yil > simdiYil || (a.yil === simdiYil && a.ay > simdiAy)) &&
    (a.odenen || 0) > 0
  ).sort((a,b) => a.yil!==b.yil ? a.yil-b.yil : a.ay-b.ay);
}

setupInitialData();
