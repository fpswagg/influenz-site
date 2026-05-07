'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { clientsData } from '@/lib/data'

export default function TrustedBy() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const infoPanelRef = useRef<HTMLDivElement | null>(null)
  const mobileDialogRef = useRef<HTMLDivElement | null>(null)

  const activeClientId = selectedClientId ?? hoveredClientId
  const activeClient = useMemo(
    () => clientsData.find((client) => client.id === activeClientId) ?? null,
    [activeClientId]
  )

  useEffect(() => {
    if (!selectedClientId) return
    if (typeof window === 'undefined') return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches

    // Let the panel mount/animate, then shift attention smoothly.
    const id = window.setTimeout(() => {
      if (isDesktop) {
        infoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        infoPanelRef.current?.focus({ preventScroll: true })
      } else {
        mobileDialogRef.current?.focus({ preventScroll: true })
      }
    }, 60)

    return () => window.clearTimeout(id)
  }, [selectedClientId])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (isDesktop || !selectedClientId) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedClientId])

  const infoMicrocopy = language === 'fr'
    ? {
        hoverHint: 'Survolez ou touchez un partenaire pour afficher ses informations.',
        preview: 'Aperçu rapide',
        pinned: 'Fiche épinglée',
        action: 'Cliquez sur un autre partenaire pour changer.',
        close: 'Fermer',
      }
    : {
        hoverHint: 'Hover or tap a partner to reveal details.',
        preview: 'Quick preview',
        pinned: 'Pinned card',
        action: 'Click another partner to switch.',
        close: 'Close',
      }

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
              <button
                type="button"
                onMouseEnter={() => setHoveredClientId(client.id)}
                onMouseLeave={() => setHoveredClientId((currentId) => (
                  currentId === client.id ? null : currentId
                ))}
                onFocus={() => setHoveredClientId(client.id)}
                onBlur={() => setHoveredClientId((currentId) => (
                  currentId === client.id ? null : currentId
                ))}
                onClick={() => setSelectedClientId((currentId) => (
                  currentId === client.id ? null : client.id
                ))}
                aria-label={`${client.name} partner info`}
                aria-pressed={selectedClientId === client.id}
                className={`w-full aspect-square rounded-xl border bg-white flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-brand/10 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-brand/60 ${
                  activeClientId === client.id
                    ? 'border-purple-brand/60 bg-purple-brand/10 shadow-lg shadow-purple-brand/10 scale-105'
                    : 'border-purple-light/20 hover:border-purple-brand/50 hover:bg-purple-brand/5'
                }`}
              >
                {/* Logo - Image or fallback letters */}
                {client.image ? (
                  <div className={`relative w-[80px] h-[80px] mb-2 transition-opacity duration-300 flex items-center justify-center ${
                    activeClientId === client.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-[80px] h-[80px] flex items-center justify-center mb-2">
                    <span className={`text-3xl font-bold transition-colors duration-300 ${
                      activeClientId === client.id
                        ? 'text-purple-brand'
                        : 'text-purple-light group-hover:text-purple-brand'
                    }`}>
                      {client.logo}
                    </span>
                  </div>
                )}
                {/* Client name */}
                <p className={`text-xs transition-colors duration-300 text-center line-clamp-2 ${
                  activeClientId === client.id
                    ? 'text-purple-brand'
                    : 'text-purple-brand/60 group-hover:text-purple-brand'
                }`}>
                  {client.name}
                </p>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:block mt-8 min-h-[170px]">
          <AnimatePresence mode="wait">
            {activeClient ? (
              <motion.div
                key={activeClient.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-2xl border border-purple-light/25 bg-gradient-to-br from-white via-purple-brand/5 to-purple-light/10 p-5 md:p-6 shadow-lg shadow-purple-brand/10"
                ref={infoPanelRef}
                tabIndex={-1}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(115,50,255,0.10),transparent_55%)]" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-purple-light">
                      {selectedClientId ? infoMicrocopy.pinned : infoMicrocopy.preview}
                    </p>
                    <h3 className="text-xl font-bold text-purple-dark mt-1">
                      {activeClient.name}
                    </h3>
                  </div>

                  {selectedClientId ? (
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(null)}
                      className="text-xs px-3 py-1.5 rounded-full border border-purple-light/30 text-purple-brand hover:bg-purple-brand/10 transition-colors"
                    >
                      {infoMicrocopy.close}
                    </button>
                  ) : null}
                </div>

                <p className="relative mt-3 text-sm md:text-base text-purple-dark/85 leading-relaxed">
                  {activeClient.description[language]}
                </p>

                <p className="relative mt-4 text-xs text-purple-brand/70">
                  {selectedClientId ? infoMicrocopy.action : infoMicrocopy.hoverHint}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-purple-light/30 bg-purple-brand/5 p-5 md:p-6 text-sm text-purple-brand/70"
              >
                {infoMicrocopy.hoverHint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="md:hidden mt-6 text-xs text-purple-brand/70 text-center">
          {infoMicrocopy.hoverHint}
        </p>

        <AnimatePresence>
          {selectedClientId && activeClient ? (
            <motion.div
              key="mobile-partner-modal"
              className="md:hidden fixed inset-0 z-50 flex items-end bg-purple-dark/55 backdrop-blur-[2px] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClientId(null)}
            >
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 28, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="w-full rounded-3xl border border-purple-light/30 bg-white p-5 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                ref={mobileDialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={`${activeClient.name} partner details`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-purple-light">
                      {infoMicrocopy.pinned}
                    </p>
                    <h3 className="text-xl font-bold text-purple-dark mt-1">
                      {activeClient.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClientId(null)}
                    className="text-xs px-3 py-1.5 rounded-full border border-purple-light/30 text-purple-brand hover:bg-purple-brand/10 transition-colors"
                  >
                    {infoMicrocopy.close}
                  </button>
                </div>

                <p className="mt-3 text-sm text-purple-dark/85 leading-relaxed">
                  {activeClient.description[language]}
                </p>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}

