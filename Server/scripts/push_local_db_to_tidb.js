'use strict';
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MAPPING_FILE = path.join(__dirname, 'cloudinary_mapping.json');
const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Keys sorted by length descending so longer subpaths replace first
const keysSorted = Object.keys(mapping).sort((a, b) => b.length - a.length);

function replaceUrls(str) {
  if (!str || typeof str !== 'string') return str;
  let res = str;
  // Also handle backslash paths
  for (const key of keysSorted) {
    if (res.includes(key)) {
      res = res.split(key).join(mapping[key]);
    }
    const winKey = key.replace(/\//g, '\\\\');
    if (res.includes(winKey)) {
      res = res.split(winKey).join(mapping[key]);
    }
    const winKeySingle = key.replace(/\//g, '\\');
    if (res.includes(winKeySingle)) {
      res = res.split(winKeySingle).join(mapping[key]);
    }
  }
  return res;
}

const tableMap = {
  roles: 'Roles',
  adminusers: 'AdminUsers',
  categories: 'Categories',
  subcategories: 'SubCategories',
  products: 'Products',
  productvariants: 'ProductVariants',
  banners: 'Banners',
  color_collections: 'color_collections',
  marketingmessages: 'MarketingMessages',
  coupons: 'Coupons',
  customers: 'Customers',
  customeraddresses: 'CustomerAddresses',
  orders: 'Orders',
  orderitems: 'OrderItems',
  carts: 'Carts',
  cartitems: 'CartItems',
  reviews: 'Reviews',
  searchkeywords: 'SearchKeywords',
  sitesettings: 'SiteSettings',
  supporttickets: 'SupportTickets',
  contactenquiries: 'ContactEnquiries',
  wishlists: 'Wishlists',
  inventorymovementlogs: 'InventoryMovementLogs',
  trendingcaches: 'TrendingCaches'
};

async function migrate() {
  console.log('🚀 Connecting to Local MySQL and TiDB Cloud...');
  const localConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'anr_garments_db'
  });

  const tidbConn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3R7gU8JDwfoeuFK.root',
    password: 'C1emfKeQXeDBUvz2',
    database: 'anr_garments',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  console.log('Connected! Disabling foreign key checks on TiDB...');
  await tidbConn.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const [locTable, tidbTable] of Object.entries(tableMap)) {
    const [rows] = await localConn.query(`SELECT * FROM \`${locTable}\``);
    console.log(`Migrating ${locTable} (${rows.length} rows) -> ${tidbTable}...`);

    await tidbConn.query(`DELETE FROM \`${tidbTable}\``);
    if (rows.length === 0) continue;

    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `\`${c}\``).join(', ');

    const BATCH_SIZE = 50;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const valuesList = [];
      const flatParams = [];

      for (const row of batch) {
        const rowPlaceholders = [];
        for (const col of cols) {
          let val = row[col];
          if (val instanceof Date && isNaN(val.getTime())) {
            val = null;
          }
          if (locTable === 'coupons') {
            if (col === 'validFrom' && !val) val = new Date();
            if (col === 'validUntil' && !val) val = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            if (col === 'value' && (val === '0.00' || !val)) {
              val = row.code === 'WELCOME20' ? 20 : (row.code === 'TWINA100' ? 100 : 10);
            }
          }
          if (typeof val === 'string') {
            val = replaceUrls(val);
          } else if (typeof val === 'object' && val !== null && !(val instanceof Date) && !Buffer.isBuffer(val)) {
            let str = JSON.stringify(val);
            str = replaceUrls(str);
            val = str;
          }
          rowPlaceholders.push('?');
          flatParams.push(val);
        }
        valuesList.push(`(${rowPlaceholders.join(', ')})`);
      }

      const sql = `INSERT INTO \`${tidbTable}\` (${colList}) VALUES ${valuesList.join(', ')}`;
      await tidbConn.query(sql, flatParams);
    }
    console.log(`  ✅ Successfully migrated ${rows.length} rows to ${tidbTable}`);
  }

  await tidbConn.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('Foreign key checks restored.');

  await localConn.end();
  await tidbConn.end();

  console.log('🎉 Migration of local data to TiDB with Cloudinary URLs complete!');
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
