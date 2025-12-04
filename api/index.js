const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key]);
    });
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  const { method } = req;
  const path = req.url.replace('/api', '');

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      return res.status(200).json({ 
        success: true, 
        status: 'ok', 
        message: 'Server is running' 
      });
    }

    // Get all pages
    if (path === '/pages' && method === 'GET') {
      const pages = await sql`SELECT * FROM pages ORDER BY "order" ASC`;
      return res.status(200).json(pages);
    }

    // Get single page
    if (path.match(/^\/pages\/[^/]+$/) && method === 'GET') {
      const pageId = path.split('/')[2];
      const pages = await sql`SELECT * FROM pages WHERE id = ${pageId}`;
      
      if (pages.length === 0) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      return res.status(200).json(pages[0]);
    }

    // Create page
    if (path === '/pages' && method === 'POST') {
      const { name } = req.body;
      const result = await sql`
        INSERT INTO pages (name) 
        VALUES (${name}) 
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    // Update page
    if (path.match(/^\/pages\/[^/]+$/) && method === 'PATCH') {
      const pageId = path.split('/')[2];
      const { name, order } = req.body;
      
      const updates = [];
      const values = [];
      
      if (name !== undefined) {
        updates.push('name = $' + (updates.length + 1));
        values.push(name);
      }
      if (order !== undefined) {
        updates.push('"order" = $' + (updates.length + 1));
        values.push(order);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      values.push(pageId);
      const result = await sql`
        UPDATE pages 
        SET ${sql.unsafe(updates.join(', '))}
        WHERE id = ${pageId}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    // Delete page
    if (path.match(/^\/pages\/[^/]+$/) && method === 'DELETE') {
      const pageId = path.split('/')[2];
      await sql`DELETE FROM pages WHERE id = ${pageId}`;
      return res.status(204).send();
    }

    // Get rows by page
    if (path.match(/^\/pages\/[^/]+\/rows$/) && method === 'GET') {
      const pageId = path.split('/')[2];
      const rows = await sql`
        SELECT * FROM rows 
        WHERE page_id = ${pageId} 
        ORDER BY "order" ASC
      `;
      return res.status(200).json(rows);
    }

    // Get single row
    if (path.match(/^\/rows\/[^/]+$/) && method === 'GET') {
      const rowId = path.split('/')[2];
      const rows = await sql`SELECT * FROM rows WHERE id = ${rowId}`;
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Row not found' });
      }
      
      return res.status(200).json(rows[0]);
    }

    // Create row
    if (path === '/rows' && method === 'POST') {
      const { page_id, title } = req.body;
      const result = await sql`
        INSERT INTO rows (page_id, title) 
        VALUES (${page_id}, ${title}) 
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    // Update row
    if (path.match(/^\/rows\/[^/]+$/) && method === 'PATCH') {
      const rowId = path.split('/')[2];
      const { title, order } = req.body;
      
      const updates = [];
      if (title !== undefined) updates.push(`title = '${title}'`);
      if (order !== undefined) updates.push(`"order" = ${order}`);
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      const result = await sql.unsafe(`
        UPDATE rows 
        SET ${updates.join(', ')}
        WHERE id = '${rowId}'
        RETURNING *
      `);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Row not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    // Delete row
    if (path.match(/^\/rows\/[^/]+$/) && method === 'DELETE') {
      const rowId = path.split('/')[2];
      await sql`DELETE FROM rows WHERE id = ${rowId}`;
      return res.status(204).send();
    }

    // Get images by row
    if (path.match(/^\/rows\/[^/]+\/images$/) && method === 'GET') {
      const rowId = path.split('/')[2];
      const images = await sql`
        SELECT * FROM images 
        WHERE row_id = ${rowId} 
        ORDER BY "order" ASC
      `;
      return res.status(200).json(images);
    }

    // Get single image
    if (path.match(/^\/images\/[^/]+$/) && method === 'GET') {
      const imageId = path.split('/')[2];
      const images = await sql`SELECT * FROM images WHERE id = ${imageId}`;
      
      if (images.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      return res.status(200).json(images[0]);
    }

    // Create image
    if (path === '/images' && method === 'POST') {
      const { row_id, url, title, description } = req.body;
      const result = await sql`
        INSERT INTO images (row_id, url, title, description) 
        VALUES (${row_id}, ${url}, ${title || null}, ${description || null}) 
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    // Update image
    if (path.match(/^\/images\/[^/]+$/) && method === 'PATCH') {
      const imageId = path.split('/')[2];
      const { url, title, description, order } = req.body;
      
      const updates = [];
      if (url !== undefined) updates.push(`url = '${url}'`);
      if (title !== undefined) updates.push(`title = '${title}'`);
      if (description !== undefined) updates.push(`description = '${description}'`);
      if (order !== undefined) updates.push(`"order" = ${order}`);
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      const result = await sql.unsafe(`
        UPDATE images 
        SET ${updates.join(', ')}
        WHERE id = '${imageId}'
        RETURNING *
      `);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    // Delete image
    if (path.match(/^\/images\/[^/]+$/) && method === 'DELETE') {
      const imageId = path.split('/')[2];
      await sql`DELETE FROM images WHERE id = ${imageId}`;
      return res.status(204).send();
    }

    // Upload endpoint (ImgBB)
    if (path === '/upload' && method === 'POST') {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'ImgBB API key not configured' });
      }

      // Upload to ImgBB
      const formData = new URLSearchParams();
      formData.append('image', image.replace(/^data:image\/\w+;base64,/, ''));

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to ImgBB');
      }

      const data = await response.json();
      
      return res.status(200).json({ 
        url: data.data.url,
        display_url: data.data.display_url,
        thumb_url: data.data.thumb.url,
        medium_url: data.data.medium?.url,
        delete_url: data.data.delete_url
      });
    }

    // Share links
    if (path.match(/^\/share-links\/[^/]+$/) && method === 'POST') {
      const pageId = path.split('/')[2];
      
      // Check if share link exists
      const existing = await sql`
        SELECT * FROM share_links WHERE page_id = ${pageId}
      `;
      
      if (existing.length > 0) {
        return res.status(200).json(existing[0]);
      }
      
      // Create new share link
      const shortCode = Math.random().toString(36).substring(2, 10);
      const result = await sql`
        INSERT INTO share_links (short_code, page_id) 
        VALUES (${shortCode}, ${pageId}) 
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    // Get share link
    if (path.match(/^\/share-links\/[^/]+$/) && method === 'GET') {
      const shortCode = path.split('/')[2];
      const links = await sql`
        SELECT * FROM share_links WHERE short_code = ${shortCode}
      `;
      
      if (links.length === 0) {
        return res.status(404).json({ error: 'Share link not found' });
      }
      
      return res.status(200).json(links[0]);
    }

    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
};
