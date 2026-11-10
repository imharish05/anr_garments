'use strict';
const { ColorCollection } = require('../models');
const { deleteFile } = require('../utils/fileHelper');
const { toAbsoluteUrl } = require('../utils/imageUrl');
const path = require('path');

const handleDBError = (err, res, type = 'color') => {
  console.error(`[Color DB Error - ${type}]`, err);
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ success: false, message: `A ${type} with this name already exists.` });
  }
  if (err.name === 'SequelizeValidationError') {
    const msg = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
    return res.status(400).json({ success: false, message: msg });
  }
  return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
};

const formatColor = (item, req) => {
  if (!item) return item;
  const json = typeof item.toJSON === 'function' ? item.toJSON() : { ...item };
  if (json.image) {
    json.image = toAbsoluteUrl(json.image, req);
  }
  return json;
};

const DEFAULT_COLORS = [
  { name: "Royal Blue", hex: "#1E40AF", description: "Top Seller for Surgery & OT", badge: "Most ordered", link: "#scrubs-collection", sortOrder: 0, isActive: true },
  { name: "Ceil / Sky Blue", hex: "#60A5FA", description: "Standard Clinical Ward Pastel", badge: "Most ordered", link: "#scrubs-collection", sortOrder: 1, isActive: true },
  { name: "Navy Blue", hex: "#1A175A", description: "ANR Signature Deep Navy", badge: "Most ordered", link: "#scrubs-collection", sortOrder: 2, isActive: true },
  { name: "Teal Blue", hex: "#0D9488", description: "Dental & Modern Clinic Tone", badge: "", link: "#scrubs-collection", sortOrder: 3, isActive: true },
  { name: "Hunter Green", hex: "#15803D", description: "Operation Theatre Glare-Free", badge: "Most ordered", link: "#scrubs-collection", sortOrder: 4, isActive: true },
  { name: "Forest Green", hex: "#14532D", description: "Critical Care Specialist", badge: "", link: "#scrubs-collection", sortOrder: 5, isActive: true },
  { name: "Lavender", hex: "#A855F7", description: "Pediatrics & Wellness", badge: "", link: "#scrubs-collection", sortOrder: 6, isActive: true },
  { name: "Wine / Burgundy", hex: "#831843", description: "Consultant & Dermatology", badge: "", link: "#scrubs-collection", sortOrder: 7, isActive: true },
  { name: "Blush Pink", hex: "#F472B6", description: "Maternity & Nursing", badge: "", link: "#scrubs-collection", sortOrder: 8, isActive: true },
  { name: "Beige / Khaki", hex: "#D4B996", description: "Admin & Executive Staff", badge: "", link: "#scrubs-collection", sortOrder: 9, isActive: true },
  { name: "Slate Grey", hex: "#64748B", description: "Lab & Diagnostics", badge: "", link: "#scrubs-collection", sortOrder: 10, isActive: true },
  { name: "Midnight Black", hex: "#0F172A", description: "Aesthetic Medicine & Surgery", badge: "", link: "#scrubs-collection", sortOrder: 11, isActive: true },
  { name: "Doctor White", hex: "#FFFFFF", description: "Lab Coats & Consultation Aprons", badge: "Most ordered", link: "#scrubs-collection", sortOrder: 12, isActive: true },
];

/**
 * Ensure table has data: auto-seeds if table is empty
 */
const autoSeedIfEmpty = async () => {
  try {
    const count = await ColorCollection.count();
    if (count === 0) {
      await ColorCollection.bulkCreate(DEFAULT_COLORS);
      console.log('[ColorCollection] Successfully auto-seeded 13 hospital department colors.');
    }
  } catch (err) {
    console.warn('[ColorCollection Auto-Seed Warning]:', err.message);
  }
};

// Initial sync and auto-seed non-blocking
ColorCollection.sync({ alter: true })
  .then(() => autoSeedIfEmpty())
  .catch((e) => console.warn('[ColorCollection Sync Warning]:', e.message));

/**
 * GET /api/colors
 * Public returns active items ordered by sortOrder
 * Admin (?all=true) returns all items
 */
const getAll = async (req, res) => {
  try {
    const { all } = req.query;
    const showAll = all === 'true' || all === true;

    const where = {};
    if (!showAll) where.isActive = true;

    let items = await ColorCollection.findAll({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    if (items.length === 0 && !showAll) {
      await autoSeedIfEmpty();
      items = await ColorCollection.findAll({
        where,
        order: [
          ['sortOrder', 'ASC'],
          ['id', 'ASC'],
        ],
      });
    }

    const formatted = items.map((it) => formatColor(it, req));
    return res.json({ success: true, colors: formatted, total: formatted.length });
  } catch (err) {
    return handleDBError(err, res, 'colors');
  }
};

/**
 * GET /api/colors/:id
 */
const getById = async (req, res) => {
  try {
    const item = await ColorCollection.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
    return res.json({ success: true, color: formatColor(item, req) });
  } catch (err) {
    return handleDBError(err, res, 'color');
  }
};

/**
 * POST /api/colors
 */
const create = async (req, res) => {
  try {
    const { name, hex, link, badge, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Color name is required.' });
    }

    if (!hex || !hex.trim()) {
      return res.status(400).json({ success: false, message: 'Hex color code is required.' });
    }

    let imagePath = null;
    if (req.file) {
      // Store relative path e.g. uploads/colors/filename.png
      imagePath = `uploads/colors/${req.file.filename}`;
    }

    const maxSort = await ColorCollection.max('sortOrder');
    const sortOrder = Number.isInteger(maxSort) ? maxSort + 1 : 0;

    const color = await ColorCollection.create({
      name: name.trim(),
      hex: hex.trim(),
      image: imagePath,
      link: link ? link.trim() : '#scrubs-collection',
      badge: badge ? badge.trim() : null,
      description: description ? description.trim() : null,
      sortOrder,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Color created successfully.',
      color: formatColor(color, req),
    });
  } catch (err) {
    return handleDBError(err, res, 'color');
  }
};

/**
 * PUT /api/colors/:id
 */
const update = async (req, res) => {
  try {
    const color = await ColorCollection.findByPk(req.params.id);
    if (!color) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }

    const { name, hex, link, badge, description, isActive, removeImage } = req.body;

    if (name !== undefined) color.name = name.trim();
    if (hex !== undefined) color.hex = hex.trim();
    if (link !== undefined) color.link = link ? link.trim() : null;
    if (badge !== undefined) color.badge = badge ? badge.trim() : null;
    if (description !== undefined) color.description = description ? description.trim() : null;
    if (isActive !== undefined) color.isActive = (isActive === 'true' || isActive === true);

    // If new image file is uploaded
    if (req.file) {
      if (color.image) {
        await deleteFile(color.image);
      }
      color.image = `uploads/colors/${req.file.filename}`;
    } else if (removeImage === 'true' || removeImage === true) {
      if (color.image) {
        await deleteFile(color.image);
      }
      color.image = null;
    }

    await color.save();

    return res.json({
      success: true,
      message: 'Color updated successfully.',
      color: formatColor(color, req),
    });
  } catch (err) {
    return handleDBError(err, res, 'color');
  }
};

/**
 * DELETE /api/colors/:id
 */
const remove = async (req, res) => {
  try {
    const color = await ColorCollection.findByPk(req.params.id);
    if (!color) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }

    if (color.image) {
      await deleteFile(color.image);
    }

    await color.destroy();

    return res.json({
      success: true,
      message: 'Color deleted successfully.',
    });
  } catch (err) {
    return handleDBError(err, res, 'color');
  }
};

/**
 * PATCH /api/colors/reorder
 * Body: { items: [{ id: 1, sortOrder: 0 }, { id: 2, sortOrder: 1 }, ...] }
 */
const reorder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items array is required for reordering.' });
    }

    await Promise.all(
      items.map(({ id, sortOrder }) =>
        ColorCollection.update({ sortOrder }, { where: { id } })
      )
    );

    return res.json({ success: true, message: 'Colors reordered successfully.' });
  } catch (err) {
    return handleDBError(err, res, 'color reorder');
  }
};

/**
 * POST /api/colors/seed
 * Force reset / re-seed default colors
 */
const seed = async (req, res) => {
  try {
    for (const c of DEFAULT_COLORS) {
      const existing = await ColorCollection.findOne({ where: { name: c.name } });
      if (!existing) {
        await ColorCollection.create(c);
      }
    }
    const allItems = await ColorCollection.findAll({ order: [['sortOrder', 'ASC']] });
    return res.json({
      success: true,
      message: 'Default colors seeded successfully.',
      colors: allItems.map((c) => formatColor(c, req)),
    });
  } catch (err) {
    return handleDBError(err, res, 'color seed');
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  reorder,
  seed,
};
