'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { clientsData } from '@/lib/data'

export default function TrustedBy() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]

  return (
    <section id="trusted-by" className="py-20 px-6 lg:px-24 border-y border-purple-light/20 bg-white">
      <div className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-wider text-purple-light mb-2">
            {t.trustedBy.title}
          </p>
          <h2 className="text-2xl font-bold text-purple-dark">
            {t.trustedBy.subtitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {clientsData.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="aspect-square rounded-xl border border-purple-light/20 bg-white flex flex-col items-center justify-center p-4 hover:border-purple-brand/50 hover:bg-purple-brand/5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-brand/10 hover:scale-105 cursor-pointer">
                {/* Logo - Image or fallback letters */}
                {client.image ? (
                  <div className="relative w-full h-full max-w-[80px] max-h-[80px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-purple-light group-hover:text-purple-brand transition-colors duration-300 mb-2">
                    {client.logo}
                  </div>
                )}
                {/* Client name */}
                <p className="text-xs text-purple-brand/60 group-hover:text-purple-brand transition-colors duration-300 text-center">
                  {client.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

