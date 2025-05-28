const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '12345678', // Substitua pela sua senha
  database: 'conexao_db',
});

async function listarEstruturaDasTabelas() {
  await client.connect();

  try {
    const tabelasResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    for (const { table_name } of tabelasResult.rows) {
      console.log(`\nTabela: ${table_name}`);
      console.log('-------------------------------------------------------------');
      console.log('| Coluna         | Tipo           | Nulo | Default   | PK | FK       |');
      console.log('-------------------------------------------------------------');

      const colunasResult = await client.query(`
        SELECT 
          cols.column_name,
          cols.data_type,
          cols.is_nullable,
          cols.column_default
        FROM information_schema.columns cols
        WHERE cols.table_name = $1 AND cols.table_schema = 'public';
      `, [table_name]);

      const pkResult = await client.query(`
        SELECT 
          kcu.column_name
        FROM 
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE 
          tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY';
      `, [table_name]);

      const fkResult = await client.query(`
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table,
          ccu.column_name AS foreign_column
        FROM 
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE 
          tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
      `, [table_name]);

      const pkCols = pkResult.rows.map(row => row.column_name);
      const fkMap = {};
      fkResult.rows.forEach(row => {
        fkMap[row.column_name] = `${row.foreign_table}(${row.foreign_column})`;
      });

      colunasResult.rows.forEach(col => {
        const isPK = pkCols.includes(col.column_name) ? 'Yes' : '';
        const isFK = fkMap[col.column_name] || '';
        console.log(`| ${col.column_name.padEnd(14)} | ${col.data_type.padEnd(14)} | ${col.is_nullable.padEnd(4)} | ${String(col.column_default || '').padEnd(9)} | ${isPK.padEnd(2)} | ${isFK.padEnd(8)} |`);
      });
    }
  } catch (error) {
    console.error('Erro ao obter a estrutura das tabelas:', error);
  } finally {
    await client.end();
  }
}

listarEstruturaDasTabelas();
