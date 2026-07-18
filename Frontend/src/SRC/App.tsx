
import { useEffect, useState } from 'react'
import './App.css'
import Lightfall from '../3d-animation-idea-components/Light_fall'

type SectionKey = 'hero' | 'events' | 'articles' | 'projects' | 'committee' | 'logo'

const stats = [
  { label: 'Live events', value: '24+' },
  { label: 'Articles', value: '81' },
  { label: 'Projects', value: '14' },
  { label: 'Research', value: '9' },
]

const events = [
  {
    title: 'Quantum Drift Lab',
    date: 'Sep 28 · 19:00',
    type: 'Workshop',
    status: 'Open for registration',
    description: 'An immersive evening of qubit simulations, circuit visualization, and live quantum logic demos.',
    progress: 72,
  },
  {
    title: 'Moonshot Hack Night',
    date: 'Oct 11 · 18:30',
    type: 'Build Sprint',
    status: 'Seats filling',
    description: 'Prototype algorithms with our research team and bring a quantum-inspired interface to life.',
    progress: 58,
  },
  {
    title: 'Neural Lattice Review',
    date: 'Nov 02 · 16:00',
    type: 'Seminar',
    status: 'Completed',
    description: 'A retrospective on recent quantum computing experiments and the next wave of hybrid models.',
    progress: 100,
  },
]

const articles = [
  {
    title: 'Why quantum communities grow faster than ordinary clubs',
    category: 'Interesting story',
    blurb: 'A look into how collaborative research rituals create magnetic energy in student communities.',
  },
  {
    title: 'Reading the language of superposition',
    category: 'Concept explanation',
    blurb: 'A gentle explainer on how abstract quantum states become visual stories for new learners.',
  },
  {
    title: 'Quantum news digest',
    category: 'Quantum news',
    blurb: 'The week’s biggest breakthroughs, condensed into a luminous feed for curious minds.',
  },
]

const projects = [
  {
    title: 'Orbital Memory Mesh',
    type: 'Working prototype',
    problem: 'Students needed a playful way to understand entanglement and encryption.',
    solution: 'An interactive web-native simulator that maps particle states through motion and sound.',
    novelty: 'Uses living particles to represent coherence, collapse, and recovery in real time.',
    github: 'github.com/soqc/orbital-memory',
    team: ['Ava', 'Nico', 'Riya'],
  },
  {
    title: 'Waveform Atlas',
    type: 'Research concept',
    problem: 'Dense research notes were hard to navigate across multiple subfields.',
    solution: 'A visual graph of protocols, theories, and references that turns static data into a spatial map.',
    novelty: 'Applies a topological lens to make invisible structures tangible.',
    github: 'github.com/soqc/waveform-atlas',
    team: ['Jules', 'Mina', 'Theo'],
  },
]

const committee = [
  {
    name: 'Dr. Mira Sol',
    role: 'Faculty Mentor',
    year: 'PhD • Physics',
    department: 'Computational Matter Lab',
    interests: 'Quantum optics, research design, architecture of curiosity',
    link: 'linkedin.com',
  },
  {
    name: 'Ari Chen',
    role: 'Chair',
    year: '3rd Year • CS',
    department: 'Systems & Theory',
    interests: 'Qiskit, interfaces, community systems',
    link: 'instagram.com',
  },
  {
    name: 'Lina Osei',
    role: 'Vice Chair',
    year: '4th Year • EE',
    department: 'Embedded Quantum',
    interests: 'Hardware loops, hybrid computation, motion design',
    link: 'linkedin.com',
  },
  {
    name: 'Noor Patel',
    role: 'Research Director',
    year: '2nd Year • Math',
    department: 'Algorithms',
    interests: 'Bayesian inference, entanglement visualisation',
    link: 'instagram.com',
  },
]

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero')
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [selectedMember, setSelectedMember] = useState(committee[0])
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const sections: Array<{ id: SectionKey; offset: number }> = [
        { id: 'hero', offset: 0 },
        { id: 'events', offset: window.innerHeight * 0.9 },
        { id: 'articles', offset: window.innerHeight * 1.9 },
        { id: 'projects', offset: window.innerHeight * 2.9 },
        { id: 'committee', offset: window.innerHeight * 3.9 },
        { id: 'logo', offset: window.innerHeight * 4.9 },
      ]

      const current = sections.reduce((closest, section) => {
        return Math.abs(section.offset - window.scrollY) < Math.abs(closest.offset - window.scrollY) ? section : closest
      }, sections[0])

      setActiveSection(current.id)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const scrollToSection = (id: SectionKey) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app-shell">
      <div className="background-layer" aria-hidden="true">
        <Lightfall
          speed={1.3}
          streakCount={3}
          streakWidth={0.5}
          streakLength={1.1}
          glow={1.2}
          density={0.6}
          twinkle={0.95}
          zoom={2.8}
          backgroundGlow={0.45}
          opacity={1}
          mouseInteraction
          mouseStrength={0.15}
          mouseRadius={1.1}
        />
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="grid-overlay" />
      </div>

      <div className="cursor-glow" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} />

      <header className="topbar">
        <button className="brand-pill" onClick={() => scrollToSection('hero')}>
          <span className="brand-mark" />
          SoQC / Quantum Computing Club
        </button>
        <nav className="nav-pills" aria-label="Section navigation">
          {(['hero', 'events', 'articles', 'projects', 'committee', 'logo'] as SectionKey[]).map((id) => (
            <button
              key={id}
              className={`nav-pill ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {id === 'hero' ? 'home' : id}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-stack">
        <section id="hero" className={`section-panel hero-panel ${activeSection === 'hero' ? 'active' : ''}`}>
          <div className="hero-copy">
            <p className="eyebrow">Quantum Computing Club • SoQC</p>
            <h1>Enter the next dimension of student innovation.</h1>
            <p className="hero-text">
              We build luminous experiences around quantum theory, hybrid systems, research culture, and bold experimentation.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollToSection('events')}>Explore the orbit</button>
              <button className="ghost-btn" onClick={() => scrollToSection('logo')}>See the emblem</button>
            </div>
            <div className="hero-stats">
              {stats.map((item) => (
                <div key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbital-shell">
              <div className="orbital-orbit orbit-a" />
              <div className="orbital-orbit orbit-b" />
              <div className="orbital-core">
                <span>SoQC</span>
              </div>
            </div>
            <div className="hero-panel-card">
              <p className="eyebrow">Live pulse</p>
              <h3>WhatsApp community is active across 14 time zones.</h3>
              <p>Recent updates: symposium rehearsals, lab demos, and collaboration threads.</p>
            </div>
          </div>
        </section>

        <section id="events" className={`section-panel ${activeSection === 'events' ? 'active' : ''}`}>
          <div className="section-heading">
            <p className="eyebrow">Events / calendar</p>
            <h2>Where the quantum field turns into live experience.</h2>
          </div>

          <div className="events-layout">
            <div className="event-list">
              {events.map((event, index) => (
                <button
                  key={event.title}
                  className={`event-card ${selectedEvent === index ? 'selected' : ''}`}
                  onClick={() => setSelectedEvent(index)}
                >
                  <div className="event-topline">
                    <span>{event.type}</span>
                    <span>{event.date}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-footer">
                    <span>{event.status}</span>
                    <span>{event.progress}% filled</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="event-detail-card">
              <div className="detail-glow" />
              <p className="eyebrow">Featured session</p>
              <h3>{events[selectedEvent].title}</h3>
              <p>{events[selectedEvent].description}</p>
              <div className="timeline">
                <div className="timeline-node" />
                <div className="timeline-node" />
                <div className="timeline-node" />
              </div>
              <div className="detail-meta">
                <span>Registration + payment</span>
                <span>Secure, fast, and live</span>
              </div>
              <button className="primary-btn">Reserve a place</button>
            </div>
          </div>
        </section>

        <section id="articles" className={`section-panel ${activeSection === 'articles' ? 'active' : ''}`}>
          <div className="section-heading">
            <p className="eyebrow">Articles / library</p>
            <h2>A reading experience inspired by journals and luminous documentation.</h2>
          </div>

          <div className="article-layout">
            <article className="article-card">
              <p className="eyebrow">Featured piece</p>
              <h3>{articles[0].title}</h3>
              <p>{articles[0].blurb}</p>
              <div className="article-scrollbar" />
              <p>
                The most magnetic student communities are not built through static meeting rooms but through shared rituals of curiosity. Quantum clubs thrive because they make uncertainty feel collaborative, visible, and alive.
              </p>
            </article>

            <aside className="toc-card">
              <h3>Table of contents</h3>
              {articles.map((item) => (
                <div key={item.title} className="toc-item">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section id="projects" className={`section-panel ${activeSection === 'projects' ? 'active' : ''}`}>
          <div className="section-heading">
            <p className="eyebrow">Projects & research</p>
            <h2>Every build feels like a prototype from the future.</h2>
          </div>

          <div className="project-layout">
            <div className="architecture-visual">
              <div className="node node-a" />
              <div className="node node-b" />
              <div className="node node-c" />
              <div className="connector connector-a" />
              <div className="connector connector-b" />
            </div>

            <div className="project-stack">
              {projects.map((project) => (
                <div key={project.title} className="project-card">
                  <div className="project-topline">
                    <span>{project.type}</span>
                    <span>{project.github}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p><strong>Problem</strong> {project.problem}</p>
                  <p><strong>Solution</strong> {project.solution}</p>
                  <p><strong>Novelty</strong> {project.novelty}</p>
                  <div className="team-row">
                    {project.team.map((member) => <span key={member}>{member}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="committee" className={`section-panel ${activeSection === 'committee' ? 'active' : ''}`}>
          <div className="section-heading">
            <p className="eyebrow">Committee / hierarchy</p>
            <h2>Leadership arranged as a living network.</h2>
          </div>

          <div className="committee-layout">
            <div className="network-graph">
              <div className="network-center">SoQC</div>
              {committee.map((member, index) => (
                <button
                  key={member.name}
                  className={`network-node node-${index + 1}`}
                  onClick={() => setSelectedMember(member)}
                >
                  <span>{member.role}</span>
                </button>
              ))}
            </div>

            <div className="profile-card">
              <p className="eyebrow">Selected profile</p>
              <h3>{selectedMember.name}</h3>
              <p>{selectedMember.role}</p>
              <p>{selectedMember.year}</p>
              <p>{selectedMember.department}</p>
              <p>{selectedMember.interests}</p>
              <div className="profile-links">
                <a href="#">LinkedIn</a>
                <a href="#">Instagram</a>
              </div>
            </div>
          </div>
        </section>

        <section id="logo" className={`section-panel ${activeSection === 'logo' ? 'active' : ''}`}>
          <div className="section-heading">
            <p className="eyebrow">Emblem / logo story</p>
            <h2>The symbol breaks apart, then reassembles into a pulse of light.</h2>
          </div>

          <div className="logo-stage">
            <div className="logo-fragment fragment-a" />
            <div className="logo-fragment fragment-b" />
            <div className="logo-fragment fragment-c" />
            <div className="logo-fragment fragment-d" />
            <div className="logo-core">Q</div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
