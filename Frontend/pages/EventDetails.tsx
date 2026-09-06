import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { events } from "../data/events/events";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Find event
  const event = events.find((item) => String(item.id) === String(id));

  // Images must be defined even if event doesn't exist
  const images = event?.image ?? [];

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Scroll to top whenever event changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    setCurrentImage(0);
  }, [id]);

  // Previous image
  const handlePrevious = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Next image
  const handleNext = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Back to events
  const handleBack = () => {
    navigate("/events");
  };

  // If event does not exist
  if (!event) {
    return (
      <div
        style={{
          minHeight: "100vh",
          paddingTop: isMobile ? 100 : 140,
          paddingBottom: 80,
          paddingLeft: 16,
          paddingRight: 16,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? 28 : 40,
            fontWeight: 700,
            marginBottom: 16,
            fontFamily: "Outfit",
          }}
        >
          Event Not Found
        </h1>

        <p
          style={{
            fontSize: 16,
            opacity: 0.65,
            marginBottom: 28,
            fontFamily: "Inter",
          }}
        >
          The event you're looking for doesn't exist.
        </p>

        <button
          onClick={handleBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid rgba(196,181,253,0.25)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 15,
            fontFamily: "Inter",
          }}
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: isMobile ? 80 : 100,
        paddingBottom: isMobile ? 60 : 120,
        position: "relative",
        zIndex: 1,
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 24px",
        }}
      >
        {/* TOP NAVIGATION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: isMobile ? 28 : 40,
            flexWrap: "wrap",
          }}
        >
          {/* Back button */}
          <button
            onClick={handleBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              padding: 0,
              fontSize: 14,
              fontFamily: "Inter",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#c4b5fd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Events</span>
          </button>

          {/* Category */}
          <div
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.2)",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              fontFamily: "JetBrains Mono",
              color: "#c4b5fd",
            }}
          >
            {event.category}
          </div>
        </div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            fontSize: isMobile ? 30 : 46,
            lineHeight: 1.15,
            fontWeight: 700,
            margin: 0,
            marginBottom: 18,
            letterSpacing: "-0.02em",
            fontFamily: "Outfit",
            color: "#fff",
          }}
        >
          {event.title}
        </motion.h1>

        {/* EVENT META */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 12 : 20,
            marginBottom: isMobile ? 28 : 40,
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {/* Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <CalendarDays size={17} color="#a855f7" />
            <span>
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <MapPin size={17} color="#a855f7" />
            <span>{event.location}</span>
          </div>

          {/* Attendees */}
          {event.attendees !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Users size={17} color="#a855f7" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </motion.div>

        {/* IMAGE GALLERY */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? 220 : 420,
              borderRadius: isMobile ? 16 : 24,
              overflow: "hidden",
              marginBottom: isMobile ? 32 : 48,
              border: "1px solid rgba(196,181,253,0.15)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <img
              src={images[currentImage]}
              alt={event.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Previous */}
            {images.length > 1 && (
              <button
                onClick={handlePrevious}
                aria-label="Previous image"
                style={{
                  position: "absolute",
                  left: isMobile ? 10 : 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: isMobile ? 36 : 42,
                  height: isMobile ? 36 : 42,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.45)";
                }}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                aria-label="Next image"
                style={{
                  position: "absolute",
                  right: isMobile ? 10 : 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: isMobile ? 36 : 42,
                  height: isMobile ? 36 : 42,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.45)";
                }}
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "JetBrains Mono",
                }}
              >
                {currentImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}

        {/* DESCRIPTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            fontSize: isMobile ? 16 : 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "Inter",
          }}
        >
          <p
            style={{
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {event.description}
          </p>
        </motion.div>

        {/* TAGS */}
        {event.tags && event.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: isMobile ? 28 : 40,
            }}
          >
            {event.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "7px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "JetBrains Mono",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* REGISTRATION BUTTON (if upcoming) */}
        {event.status === 'upcoming' && (event as any).registrationOpen && (
          <div
            style={{
              marginTop: isMobile ? 32 : 48,
              padding: isMobile ? 20 : 28,
              borderRadius: 16,
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.12)",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: isMobile ? "12px 20px" : "14px 24px",
                border: "none",
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "#fff",
                fontFamily: "Outfit",
                fontWeight: 600,
                fontSize: isMobile ? 15 : 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {(event as any).fee === 0
                ? "Register Free"
                : `Register — ₹${(event as any).fee}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}