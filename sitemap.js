

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDZEiPKwBXshLCdYqQ1kyaEzKz_SJYJH2k",
  authDomain: "mwtether.firebaseapp.com",
  projectId: "mwtether",
  storageBucket: "mwtether.firebasestorage.app",
  messagingSenderId: "95370110625",
  appId: "1:95370110625:web:e53bde7c65bb9da57d32e0"
});

const db = getFirestore(app);

// Fetch all articles, sorted by timestamp desc
async function generateSitemap() {
  const q = query(collection(db, 'videos'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  const articles = snap.docs.map(d => ({ id: d.id, timestamp: d.data().timestamp }));

  // Build XML with real data
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mwtether.online/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mwtether.online/about.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  articles.forEach(article => {
    const date = article.timestamp?.seconds 
      ? new Date(article.timestamp.seconds * 1000).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    xml += `
  <url>
    <loc>https://mwtether.online/info.html?id=${article.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  return xml;
}

// Generate and display
generateSitemap().then(xml => {
  const contentType = 'application/xml; charset=utf-8';
  document.documentElement.innerHTML = `<pre style="white-space:pre-wrap;word-wrap:break-word;">${xml}</pre>`;
  document.head.innerHTML = `<title>sitemap.xml</title><meta charset="UTF-8">`;
  
  console.log('Sitemap generated! Copy the XML above to verify.');
});
