import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { events } from '../data/events/events'

type Event = (typeof events)[number]

function CountdownTimer({
  deadline,
}: {
  deadline: string
}) {
  const [time] = useState(() => {
    const diff =
      new Date(deadline).getTime() - Date.now()

    return diff > 0
      ? {
          d: Math.floor(diff / 86400000),
          h: Math.floor(
            (diff % 86400000) / 3600000
          ),
          m: Math.floor(
            (diff % 3600000) / 60000
          ),
        }
      : null
  })

  if (!time) {
    return (
      <span
        style={{
          color: 'rgba(248,248,255,0.3)',
          fontSize: 12,
          fontFamily: 'JetBrains Mono',
        }}
      >
        Registration closed
      </span>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {[
        ['d', time.d],
        ['h', time.h],
        ['m', time.m],
      ].map(([unit, value]) => (
        <div
          key={unit as string}
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 18,
              fontWeight: 700,
              color: '#c4b5fd',
              background: 'rgba(124,58,237,0.15)',
              padding: '4px 10px',
              borderRadius: 6,
              minWidth: 40,
            }}
          >
            {String(value).padStart(2, '0')}
          </div>

          <div
            style={{
              fontSize: 9,
              color: 'rgba(248,248,255,0.3)',
              marginTop: 2,
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.1em',
            }}
          >
            {unit}
          </div>
        </div>
      ))}
    </div>
  )
}

/* =====================================================
   EVENT GALLERY
===================================================== */

function EventGallery({
  event,
  onClick,
}: {
  event: Event
  onClick: () => void
}) {
  const [currentImage, setCurrentImage] = useState(0)

  const images = event.image || []

  const previousImage = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    if (images.length <= 1) return

    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    )
  }

  const nextImage = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    if (images.length <= 1) return

    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    )
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.35)',
      }}
    >
      <AnimatePresence mode="wait">
        {images.length > 0 ? (
          <motion.img
            key={`${event.id}-${currentImage}`}
            src={images[currentImage]}
            alt={`${event.title} — image ${
              currentImage + 1
            }`}
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(248,248,255,0.3)',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
            }}
          >
            No image available
          </div>
        )}
      </AnimatePresence>

      {/* Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(3,3,15,0.15) 30%, rgba(3,3,15,0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Status */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          padding: '5px 12px',
          background:
            event.status === 'upcoming'
              ? 'linear-gradient(135deg, rgba(124,58,237,0.85), rgba(168,85,247,0.85))'
              : 'rgba(0,0,0,0.55)',
          borderRadius: 100,
          fontSize: 10,
          color:
            event.status === 'upcoming'
              ? '#fff'
              : 'rgba(248,248,255,0.6)',
          fontFamily: 'JetBrains Mono',
          letterSpacing: '0.08em',
          backdropFilter: 'blur(10px)',
          border:
            '1px solid rgba(196,181,253,0.2)',
          zIndex: 2,
        }}
      >
        {event.status === 'upcoming'
          ? '● UPCOMING'
          : '✓ COMPLETED'}
      </div>

      {/* Category */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          maxWidth: '45%',
          padding: '5px 12px',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: 100,
          fontSize: 10,
          color: '#c4b5fd',
          fontFamily: 'JetBrains Mono',
          backdropFilter: 'blur(10px)',
          zIndex: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {event.category}
      </div>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={previousImage}
          aria-label="Previous image"
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            border:
              '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
          }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={nextImage}
          aria-label="Next image"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            border:
              '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
          }}
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            padding: '5px 10px',
            borderRadius: 100,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            zIndex: 2,
          }}
        >
          {currentImage + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

/* =====================================================
   EVENT CARD
===================================================== */

function EventCard({
  event,
  index,
  onClick,
}: {
  event: Event
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
  })

  const [hovered, setHovered] = useState(false)

  const upcoming = event.status === 'upcoming'

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        background: hovered
          ? 'rgba(124,58,237,0.1)'
          : 'rgba(124,58,237,0.05)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${
          hovered
            ? 'rgba(196,181,253,0.25)'
            : 'rgba(196,181,253,0.1)'
        }`,
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        boxShadow: hovered
          ? '0 20px 60px rgba(124,58,237,0.2), 0 0 60px rgba(124,58,237,0.1)'
          : 'none',
        transform: hovered
          ? 'translateY(-5px)'
          : 'translateY(0)',
      }}
    >
      <EventGallery
        event={event}
        onClick={onClick}
      />

      <div
        onClick={onClick}
        style={{
          padding: '20px 24px 24px',
          cursor: 'pointer',
        }}
      >
        {/* Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            color: '#c4b5fd',
            fontSize: 12,
            fontFamily: 'JetBrains Mono',
            marginBottom: 8,
          }}
        >
          <CalendarDays size={14} />

          {new Date(
            event.date
          ).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>

        {/* Venue */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            color:
              'rgba(248,248,255,0.4)',
            fontSize: 12,
            fontFamily: 'Inter',
            marginBottom: 16,
          }}
        >
          <MapPin
            size={14}
            style={{
              flexShrink: 0,
              marginTop: 1,
            }}
          />

          <span>{event.location}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Outfit',
            fontSize:
              'clamp(20px, 2vw, 24px)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </h3>

        {/* Hint */}
        <div
          style={{
            marginTop: 14,
            color:
              'rgba(196,181,253,0.55)',
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            letterSpacing: '0.08em',
          }}
        >
          CLICK FOR DETAILS →
        </div>

        {/* Registration */}
        {upcoming &&
          (event as any)
            .registrationOpen && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 18,
                borderTop:
                  '1px solid rgba(196,181,253,0.1)',
              }}
            >
              {(event as any)
                .registrationDeadline && (
                <CountdownTimer
                  deadline={
                    (event as any)
                      .registrationDeadline
                  }
                />
              )}
            </div>
          )}
      </div>
    </motion.div>
  )
}

/* =====================================================
   EVENTS PAGE
===================================================== */

export default function Events() {
  const navigate = useNavigate()

  const hasUpcomingEvents =
    events.some(
      (event) =>
        event.status === 'upcoming'
    )

  const [filter, setFilter] = useState<
    'all' | 'upcoming' | 'completed'
  >('all')

  const filters = hasUpcomingEvents
    ? ([
        'all',
        'upcoming',
        'completed',
      ] as const)
    : ([
        'all',
        'completed',
      ] as const)

  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter(
          (event) =>
            event.status === filter
        )

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: 100,
        paddingBottom: 120,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '50px 20px 55px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          style={{
            fontFamily:
              'JetBrains Mono',
            color: '#a855f7',
            fontSize: 11,
            letterSpacing: '0.2em',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          SoQC — Events
        </motion.div>

        <motion.h1
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.8,
          }}
          style={{
            fontFamily: 'Outfit',
            fontSize:
              'clamp(42px, 8vw, 80px)',
            fontWeight: 900,
            background:
              'linear-gradient(135deg, #ffffff, #c4b5fd 40%, #a855f7)',
            WebkitBackgroundClip:
              'text',
            WebkitTextFillColor:
              'transparent',
            backgroundClip: 'text',
            letterSpacing:
              '-0.04em',
            lineHeight: 0.95,
            marginBottom: 22,
          }}
        >
          Quantum
          <br />
          Events
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.8,
          }}
          style={{
            color:
              'rgba(248,248,255,0.5)',
            fontFamily: 'Inter',
            fontSize: 15,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          From hands-on workshops to
          symposiums — we bring quantum
          computing to life through
          experiences that inspire,
          educate, and connect.
        </motion.p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 45,
          padding: '0 16px',
          flexWrap: 'wrap',
        }}
      >
        {filters.map(
          (filterName) => (
            <motion.button
              key={filterName}
              onClick={() =>
                setFilter(filterName)
              }
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              style={{
                padding:
                  '8px 20px',
                borderRadius: 100,
                border:
                  filter ===
                  filterName
                    ? '1px solid rgba(196,181,253,0.4)'
                    : '1px solid rgba(196,181,253,0.1)',
                background:
                  filter ===
                  filterName
                    ? 'rgba(124,58,237,0.2)'
                    : 'transparent',
                color:
                  filter ===
                  filterName
                    ? '#c4b5fd'
                    : 'rgba(248,248,255,0.4)',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 13,
                cursor: 'pointer',
                textTransform:
                  'capitalize',
              }}
            >
              {filterName}
            </motion.button>
          )
        )}
      </div>

      {/* Events */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <AnimatePresence mode="wait">
          {filteredEvents.length >
          0 ? (
            <motion.div
              key={filter}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 24,
              }}
            >
              {filteredEvents.map(
                (
                  event,
                  index
                ) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onClick={() =>
                      navigate(
                        `/events/${event.id}`
                      )
                    }
                  />
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              style={{
                textAlign: 'center',
                padding:
                  '70px 20px',
                color:
                  'rgba(248,248,255,0.35)',
                fontFamily: 'Inter',
              }}
            >
              No {filter} events yet.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}