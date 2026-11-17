'use strict';
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dsmeesnx9',
  api_key: '363622779391499',
  api_secret: '7wkzMXFLzA7smdBmBxYIaJ3v03o'
});

const MAPPING_FILE = path.join(__dirname, 'cloudinary_mapping.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

function getAllFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
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

async function main() {
  console.log('🚀 Starting Local MySQL to TiDB Cloud & Cloudinary Migration...');

  // 1. Load existing mapping if any
  let mapping = {};
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
      console.log(`Loaded ${Object.keys(mapping).length / 2} existing Cloudinary mappings.`);
    } catch (e) {
      mapping = {};
    }
  }

  // 2. Upload all files from uploads/ to Cloudinary
  const files = getAllFiles(UPLOADS_DIR);
  console.log(`Found ${files.length} local files in Server/uploads.`);

  let uploadCount = 0;
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const relFromUploads = path.relative(UPLOADS_DIR, filePath).replace(/\\/g, '/');
    const folderName = path.dirname(relFromUploads) === '.' ? 'general' : path.dirname(relFromUploads);
    const baseKey1 = `/uploads/${relFromUploads}`;
    const baseKey2 = `uploads/${relFromUploads}`;

    if (mapping[baseKey1]) {
      continue; // already uploaded
    }

    const ext = path.extname(filePath).toLowerCase();
    let resourceType = 'auto';
    if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) {
      resourceType = 'image';
    } else if (['.mp4', '.mov', '.webm', '.avi'].includes(ext)) {
      resourceType = 'video';
    } else {
      resourceType = 'raw';
    }

    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder: `anr_garments/${folderName}`,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: false
      });

      const url = uploadRes.secure_url;
      mapping[baseKey1] = url;
      mapping[baseKey2] = url;
      uploadCount++;
      if (uploadCount % 10 === 0 || i === files.length - 1) {
        console.log(`Uploaded ${uploadCount} new files to Cloudinary (${i + 1}/${files.length})...`);
        fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
      }
    } catch (err) {
      console.error(`Error uploading ${filePath}:`, err.message);
    }
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log('✅ Cloudinary upload phase complete!');

  // Build sorted keys for replacement
  const keysSorted = Object.keys(mapping).sort((a, b) => b.length - a.length);

  function replaceUrls(str) {
    if (!str || typeof str !== 'string') return str;
    let res = str;
    for (const key of keysSorted) {
      if (res.includes(key)) {
        res = res.split(key).join(mapping[key]);
      }
    }
    return res;
  }

  // 3. Connect to local MySQL & TiDB
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

  console.log('Connected to local MySQL and TiDB Cloud!');
  await tidbConn.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const [locTable, tidbTable] of Object.entries(tableMap)) {
    const [rows] = await localConn.query(`SELECT * FROM \`${locTable}\``);
    console.log(`Processing ${locTable} -> ${tidbTable} (${rows.length} rows)...`);

    await tidbConn.query(`DELETE FROM \`${tidbTable}\``);
    if (rows.length === 0) continue;

    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `\`${c}\``).join(', ');

    // Process rows and batch insert
    const BATCH_SIZE = 50;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const valuesList = [];
      const flatParams = [];

      for (const row of batch) {
        const rowPlaceholders = [];
        for (const col of cols) {
          let val = row[col];
          if (typeof val === 'string') {
            val = replaceUrls(val);
          } else if (typeof val === 'object' && val !== null && !(val instanceof Date) && !Buffer.isBuffer(val)) {
            // JSON column
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
    console.log(`  ✅ Inserted ${rows.length} rows into TiDB \`${tidbTable}\``);
  }

  await tidbConn.query('SET FOREIGN_KEY_CHECKS = 1;');

  await localConn.end();
  await tidbConn.end();

  console.log('🎉 Full Migration from Local to TiDB Cloud & Cloudinary successfully finished!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
