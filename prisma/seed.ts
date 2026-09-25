import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { copyCatalog } from '../src/lib/content/copy-catalog'
import { detectMediaKind } from '../src/lib/storage/sastorage'
import { migrateMediaToStorage } from '../src/lib/storage/media-migration'
import {
  categoriesData,
  clientsData,
  projectsData,
  servicesData,
  solutionCategoriesData,
  solutionsData,
} from './legacy-content'

const prisma = new PrismaClient()

async function main() {
  await prisma.projectServiceOnProject.deleteMany()
  await prisma.projectMedia.deleteMany()
  await prisma.projectTranslation.deleteMany()
  await prisma.project.deleteMany()
  await prisma.projectService.deleteMany()
  await prisma.projectCategory.deleteMany()
  await prisma.solutionLink.deleteMany()
  await prisma.solutionMedia.deleteMany()
  await prisma.solutionTranslation.deleteMany()
  await prisma.solution.deleteMany()
  await prisma.solutionCategory.deleteMany()
  await prisma.client.deleteMany()
  await prisma.aboutService.deleteMany()
  await prisma.homeSection.deleteMany()
  await prisma.copyEntry.deleteMany()
  await prisma.siteConfig.deleteMany()

  await prisma.siteConfig.create({
    data: {
      id: 'site',
      siteName: 'iNFLUENZ',
      logoUrl: '/images/logo.png',
      textLogoUrl: '/images/text-logo.png',
      faviconUrl: '/images/logo.png',
      heroBannerUrl: '/images/banner.jpg',
      seoTitleFr: 'iNFLUENZ',
      seoTitleEn: 'iNFLUENZ',
      seoDescriptionFr: 'Agence de conseil & stratégie, relations presse, communication digitale et événementiel',
      seoDescriptionEn: 'Consulting & strategy, press relations, digital communication and events agency',
      email: 'info@influenz.cm',
      phone: '+237 699 22 24 40',
      phoneSecondary: '+237 652 20 93 23',
      address: 'BP 10107, Omnisports, Yaoundé, Cameroun',
      postalBox: 'BP 10107, Omnisports, Yaoundé',
      legalForm: 'SARL au capital de 990 000 FCAF',
      niu: 'M032217160598Q',
      rccm: 'RC/YAE/2022/B/962',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      mapsEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127331.57082244655!2d11.438201299999999!3d3.8480325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309ff7dd%3A0x50c4c7460ec157e!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2s!4v1234567890',
      contactIntroFr: 'Parlons de votre projet. Nous vous répondons sous 24h.',
      contactIntroEn: "Let's talk about your project. We respond within 24 hours.",
      locationBlurbFr:
        "Basé à Yaoundé, iNFLUENZ opère au Cameroun et à l'échelle internationale. Notre équipe d'experts en communication et stratégie vous accompagne dans tous vos projets.",
      locationBlurbEn:
        'Based in Yaoundé, iNFLUENZ operates in Cameroon and internationally. Our team of communication and strategy experts supports you in all your projects.',
    },
  })

  await prisma.copyEntry.createMany({
    data: copyCatalog.map((entry, index) => ({
      key: entry.key,
      group: entry.group,
      kind: entry.kind,
      label: entry.label,
      hint: entry.hint,
      valueFr: entry.valueFr,
      valueEn: entry.valueEn,
      sortOrder: index,
    })),
  })

  const homeSections = [
    { key: 'hero', component: 'Hero', enabled: true, showInNav: true, sortOrder: 1, labelFr: 'Accueil', labelEn: 'Home', eyebrowFr: '', eyebrowEn: '' },
    { key: 'trusted-by', component: 'TrustedBy', enabled: true, showInNav: false, sortOrder: 2, labelFr: 'Partenaires', labelEn: 'Partners', eyebrowFr: '', eyebrowEn: '' },
    { key: 'projects', component: 'Projets', enabled: true, showInNav: true, sortOrder: 3, labelFr: 'Projets', labelEn: 'Projects', eyebrowFr: 'Portfolio', eyebrowEn: 'Portfolio' },
    { key: 'solutions', component: 'Solutions', enabled: true, showInNav: true, sortOrder: 4, labelFr: 'Solutions', labelEn: 'Solutions', eyebrowFr: 'Problématiques', eyebrowEn: 'Challenges' },
    { key: 'about', component: 'About', enabled: true, showInNav: true, sortOrder: 5, labelFr: 'À propos', labelEn: 'About', eyebrowFr: 'À propos', eyebrowEn: 'About' },
    { key: 'contact', component: 'ContactForm', enabled: true, showInNav: true, sortOrder: 6, labelFr: 'Contact', labelEn: 'Contact', eyebrowFr: 'Contact', eyebrowEn: 'Contact' },
  ]

  await prisma.homeSection.createMany({ data: homeSections })

  const aboutServices = [
    { titleFr: 'Conseil & Stratégie', titleEn: 'Consulting & Strategy', descriptionFr: 'Accompagnement stratégique et audit de communication', descriptionEn: 'Strategic support and communication audit' },
    { titleFr: 'Relations Presse', titleEn: 'Press Relations', descriptionFr: 'Gestion des relations médias et couverture presse', descriptionEn: 'Media relations management and press coverage' },
    { titleFr: 'Communication Digitale', titleEn: 'Digital Communication', descriptionFr: 'Stratégie digitale et gestion des réseaux sociaux', descriptionEn: 'Digital strategy and social media management' },
    { titleFr: 'Événementiel', titleEn: 'Events', descriptionFr: "Organisation et gestion d'événements corporate", descriptionEn: 'Corporate event organization and management' },
  ]

  for (const [index, item] of aboutServices.entries()) {
    await prisma.aboutService.create({ data: { ...item, sortOrder: index } })
  }

  const projectCategoryRecords = []
  for (const [index, category] of categoriesData.entries()) {
    projectCategoryRecords.push(
      await prisma.projectCategory.create({
        data: {
          slug: category.id,
          labelFr: category.fr,
          labelEn: category.en,
          isAll: category.id === 'all',
          sortOrder: index,
        },
      })
    )
  }

  const serviceRecords = []
  for (const [index, service] of servicesData.entries()) {
    serviceRecords.push(
      await prisma.projectService.create({
        data: {
          slug: service.id,
          labelFr: service.fr,
          labelEn: service.en,
          sortOrder: index,
        },
      })
    )
  }

  const solutionCategoryRecords = []
  for (const [index, category] of solutionCategoriesData.entries()) {
    solutionCategoryRecords.push(
      await prisma.solutionCategory.create({
        data: {
          slug: category.id,
          labelFr: category.fr,
          labelEn: category.en,
          isAll: category.id === 'all',
          sortOrder: index,
        },
      })
    )
  }

  for (const [index, client] of clientsData.entries()) {
    await prisma.client.create({
      data: {
        name: client.name,
        logoLetters: client.logo,
        imageUrl: client.image,
        descriptionFr: client.description.fr,
        descriptionEn: client.description.en,
        sortOrder: index,
        published: true,
      },
    })
  }

  for (const [index, project] of projectsData.entries()) {
    const category = projectCategoryRecords.find((item) => item.slug === project.categoryId)
    if (!category) {
      throw new Error(`Missing project category ${project.categoryId}`)
    }

    const created = await prisma.project.create({
      data: {
        slug: project.slug,
        year: project.year,
        clientName: project.client,
        categoryId: category.id,
        published: true,
        featured: true,
        sortOrder: index,
        translations: {
          create: [
            {
              locale: 'fr',
              title: project.translations.fr.title,
              description: project.translations.fr.description,
              longDescription: project.translations.fr.longDescription,
              challenge: project.translations.fr.challenge,
              solution: project.translations.fr.solution,
              client: project.translations.fr.client,
              results: project.translations.fr.results,
            },
            {
              locale: 'en',
              title: project.translations.en.title,
              description: project.translations.en.description,
              longDescription: project.translations.en.longDescription,
              challenge: project.translations.en.challenge,
              solution: project.translations.en.solution,
              client: project.translations.en.client,
              results: project.translations.en.results,
            },
          ],
        },
        media: {
          create: (project.media || []).map((url, mediaIndex) => ({
            url,
            kind: detectMediaKind(url),
            sortOrder: mediaIndex,
          })),
        },
      },
    })

    for (const [serviceIndex, serviceSlug] of project.serviceIds.entries()) {
      const service = serviceRecords.find((item) => item.slug === serviceSlug)
      if (!service) continue
      await prisma.projectServiceOnProject.create({
        data: {
          projectId: created.id,
          serviceId: service.id,
          sortOrder: serviceIndex,
        },
      })
    }
  }

  for (const [index, solution] of solutionsData.entries()) {
    const category = solutionCategoryRecords.find((item) => item.slug === solution.categoryId)
    if (!category) {
      throw new Error(`Missing solution category ${solution.categoryId}`)
    }

    await prisma.solution.create({
      data: {
        slug: solution.slug,
        categoryId: category.id,
        icon: solution.icon,
        featured: solution.featured,
        coverUrl: solution.image,
        published: true,
        sortOrder: index,
        translations: {
          create: [
            {
              locale: 'fr',
              title: solution.translations.fr.title,
              problem: solution.translations.fr.problem,
              approach: solution.translations.fr.approach,
              callToAction: solution.translations.fr.callToAction,
              steps: solution.translations.fr.steps,
              results: solution.translations.fr.results,
            },
            {
              locale: 'en',
              title: solution.translations.en.title,
              problem: solution.translations.en.problem,
              approach: solution.translations.en.approach,
              callToAction: solution.translations.en.callToAction,
              steps: solution.translations.en.steps,
              results: solution.translations.en.results,
            },
          ],
        },
        media: {
          create: (solution.images || (solution.image ? [solution.image] : [])).map((url, mediaIndex) => ({
            url,
            kind: detectMediaKind(url),
            sortOrder: mediaIndex,
          })),
        },
        links: {
          create: (solution.links || []).map((link, linkIndex) => ({
            url: link.url,
            labelFr: link.labels.fr,
            labelEn: link.labels.en,
            sortOrder: linkIndex,
          })),
        },
      },
    })
  }

  // Content files (projects, solutions, partners, banner) are served from SA Storage, not /public
  if (process.env.SA_STORAGE_TOKEN) {
    console.log('Moving content media to SA Storage…')
    const report = await migrateMediaToStorage(prisma, {
      apply: true,
      publicDir: path.join(__dirname, '..', 'public'),
      log: (message) => console.log(`  ${message}`),
    })
    if (report.failed.length) console.warn(`  ${report.failed.length} media file(s) could not be moved (see above).`)
  } else {
    console.warn('SA_STORAGE_TOKEN is not set: media keep pointing at /public. Run `pnpm media:migrate --apply` later.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
