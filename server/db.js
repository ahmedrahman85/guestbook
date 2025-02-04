import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  connectionString: 'postgresql://postgres.efeirwmfsmgzxijicxjb:clownmonkeymountain12@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

try {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.stack)
      return
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        console.error('Error executing query', err.stack)
      } else {
        console.log('Database connection successful')
      }
    })
  })
} catch (error) {
  console.error('Database connection error:', error)
}