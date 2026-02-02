const db = require('../db');

/* =========================
   USER RAISES A GRIEVANCE
========================= */
exports.raiseGrievance = (req, res) => {
  const userId = req.user.id;
  const { title, description, category, sub_category, type } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: 'Title and description are required'
    });
  }

  const sql = `
    INSERT INTO grievances
    (user_id, title, description, category, sub_category, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      title,
      description,
      category || null,
      sub_category || null,
      type || 'public'
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Grievance raised successfully',
        grievanceId: result.insertId
      });
    }
  );
};

/* =========================
   USER VIEWS OWN GRIEVANCES
========================= */
exports.getMyGrievances = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      id,
      title,
      description,
      category,
      sub_category,
      type,
      status,
      solution,
      is_closed,
      created_at
    FROM grievances
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      grievances: results
    });
  });
};

/* =========================
   ADMIN VIEWS ALL GRIEVANCES
========================= */
exports.getAllGrievances = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admins only.'
    });
  }

  const sql = `
    SELECT 
      g.id,
      g.title,
      g.description,
      g.category,
      g.sub_category,
      g.type,
      g.status,
      g.solution,
      g.is_closed,
      g.created_at,
      u.name AS user_name,
      u.email AS user_email
    FROM grievances g
    JOIN users u ON g.user_id = u.id
    ORDER BY g.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      grievances: results
    });
  });
};

/* =========================
   ADMIN GIVES SOLUTION
========================= */
exports.giveSolution = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admins only.'
    });
  }

  const grievanceId = req.params.id;
  const solution = req.body?.solution;

  if (!solution) {
    return res.status(400).json({
      message: 'Solution is required'
    });
  }

  const sql = `
    UPDATE grievances
    SET solution = ?, status = 'resolved'
    WHERE id = ?
  `;

  db.query(sql, [solution, grievanceId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Grievance not found'
      });
    }

    res.status(200).json({
      message: 'Solution added successfully'
    });
  });
};

/* =========================
   USER SATISFIED / NOT SATISFIED
========================= */
exports.respondToSolution = (req, res) => {
  const userId = req.user.id;
  const grievanceId = req.params.id;
  const { satisfied } = req.body;

  if (typeof satisfied !== 'boolean') {
    return res.status(400).json({
      message: 'Satisfied value must be true or false'
    });
  }

  const checkSql = `
    SELECT id FROM grievances
    WHERE id = ? AND user_id = ?
  `;

  db.query(checkSql, [grievanceId, userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Grievance not found or unauthorized'
      });
    }

    if (satisfied === true) {
      const closeSql = `
        UPDATE grievances
        SET is_closed = true
        WHERE id = ?
      `;

      db.query(closeSql, [grievanceId], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(200).json({
          message: 'Grievance closed successfully'
        });
      });
    } else {
      const reopenSql = `
        UPDATE grievances
        SET status = 'pending'
        WHERE id = ?
      `;

      db.query(reopenSql, [grievanceId], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(200).json({
          message: 'Grievance reopened. Admin will review again.'
        });
      });
    }
  });
};
