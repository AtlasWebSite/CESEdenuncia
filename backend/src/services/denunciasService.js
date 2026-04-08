const pool = require('../db/pool');

async function createDenuncia(data) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `
        INSERT INTO denuncias (nome, descricao)
        VALUES ($1, $2)
        RETURNING id, nome, descricao, data
      `,
      [data.nome || null, data.descricao]
    );

    await client.query(
      `
        DELETE FROM denuncias
        WHERE id IN (
          SELECT id
          FROM denuncias
          ORDER BY data DESC, id DESC
          OFFSET 100
        )
      `
    );

    await client.query('COMMIT');

    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function listDenuncias() {
  const result = await pool.query(
    `
      SELECT id, nome, descricao, data
      FROM denuncias
      ORDER BY data DESC, id DESC
    `
  );

  return result.rows;
}

async function deleteDenunciaById(id) {
  const result = await pool.query(
    `
      DELETE FROM denuncias
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  return result.rowCount > 0;
}

async function deleteAllDenuncias() {
  const result = await pool.query('DELETE FROM denuncias');

  return result.rowCount;
}

module.exports = {
  createDenuncia,
  listDenuncias,
  deleteDenunciaById,
  deleteAllDenuncias
};
