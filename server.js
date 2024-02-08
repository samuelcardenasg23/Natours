import dotenv from 'dotenv'

import { app } from './app.js'

dotenv.config({ path: '.env' })

// ! STAR SERVER

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
