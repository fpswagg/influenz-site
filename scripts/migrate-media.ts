/**
 * Moves content files (project media, solution covers/galleries, partner logos, home banner)
 * from /public (or other websites) to SA Storage and updates the database.
 *
 *   pnpm media:migrate                 → dry run: shows what would change, touches nothing
 *   pnpm media:migrate --apply         → uploads, updates the database, writes a backup file
 *   pnpm media:migrate --rollback <f>  → restores the URLs saved in a backup file
 *
 * Site identity files (logo, text logo, favicon) are not touched.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { applyChangesOperations, migrateMediaToStorage, type MediaChange } from '../src/lib/storage/media-migration'

const prisma = new PrismaClient()
const root = path.resolve(__dirname, '..')
const args = process.argv.slice(2)

async function rollback(file: string) {
  const backup = JSON.parse(await readFile(path.resolve(file), 'utf8')) as { changes: MediaChange[] }
  const reverse = backup.changes.map((change) => ({ field: change.field, id: change.id, to: change.url }))
  await prisma.$transaction(applyChangesOperations(prisma, reverse))
  console.log(`✓ ${reverse.length} référence(s) restaurée(s) depuis ${file}`)
}

async function main() {
  const rollbackIndex = args.indexOf('--rollback')
  if (rollbackIndex >= 0) {
    const file = args[rollbackIndex + 1]
    if (!file) throw new Error('Indiquez le fichier de sauvegarde : --rollback prisma/media-backups/<fichier>.json')
    await rollback(file)
    return
  }

  const apply = args.includes('--apply')
  console.log(apply ? '▶ Migration des médias vers SA Storage\n' : '▶ Simulation (aucune modification). Ajoutez --apply pour exécuter.\n')

  const report = await migrateMediaToStorage(prisma, {
    apply,
    publicDir: path.join(root, 'public'),
    log: (message) => console.log(`  ${message}`),
  })

  console.log('\nRésumé')
  console.log(`  Fichiers envoyés${apply ? '' : ' (prévus)'} : ${report.uploaded.length}`)
  console.log(`  Déjà présents dans le stockage : ${report.reused.length}`)
  console.log(`  Références ${apply ? 'mises à jour' : 'à mettre à jour'} : ${report.changes.length}`)
  if (report.skipped.length) console.log(`  Ignorés : ${report.skipped.map((item) => `${item.url} (${item.reason})`).join(', ')}`)
  if (report.failed.length) {
    console.log(`  Échecs : ${report.failed.length}`)
    report.failed.forEach((item) => console.log(`    - ${item.url} → ${item.reason} [${item.references.join(', ')}]`))
  }

  if (apply && report.changes.length) {
    const dir = path.join(root, 'prisma', 'media-backups')
    await mkdir(dir, { recursive: true })
    const file = path.join(dir, `media-migration-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    await writeFile(file, JSON.stringify({ createdAt: new Date().toISOString(), changes: report.changes }, null, 2))
    console.log(`\n  Sauvegarde des anciennes adresses : ${path.relative(root, file)}`)
    console.log(`  Pour annuler : pnpm media:migrate --rollback ${path.relative(root, file).replace(/\\/g, '/')}`)
  }

  if (report.failed.length) process.exitCode = 1
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
