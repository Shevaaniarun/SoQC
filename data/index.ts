export const events = [
  {
    id: 1,
    title: "Quantum Entanglement Workshop",
    date: "2025-03-15",
    status: "completed",
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop&auto=format",
    description:
      "An intensive workshop exploring the principles of quantum entanglement and its applications in quantum communication.",
    attendees: 84,
    location: "Physics Lab A-204",
    tags: ["Entanglement", "Quantum Comms", "Hands-on"],
  },
  {
    id: 2,
    title: "Shor's Algorithm Deep Dive",
    date: "2025-04-22",
    status: "completed",
    category: "Seminar",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format",
    description:
      "A comprehensive study of Shor's factoring algorithm, its quantum circuit implementation, and implications for cryptography.",
    attendees: 120,
    location: "Auditorium Hall 1",
    tags: ["Shor's Algorithm", "Cryptography", "Circuits"],
  },
  {
    id: 3,
    title: "Quantum Machine Learning Symposium",
    date: "2025-06-10",
    status: "completed",
    category: "Symposium",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format",
    description:
      "Industry experts and researchers discuss the intersection of quantum computing and machine learning.",
    attendees: 156,
    location: "Online + Seminar Room 3",
    tags: ["QML", "AI", "Research"],
  },
  {
    id: 4,
    title: "Qiskit Hackathon 2025",
    date: "2025-09-05",
    status: "upcoming",
    category: "Hackathon",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&auto=format",
    description:
      "48-hour hackathon using IBM Qiskit to solve real-world problems with quantum computing. Prizes worth ₹2,00,000.",
    attendees: 0,
    maxAttendees: 200,
    location: "Innovation Hub",
    tags: ["Qiskit", "IBM", "Competitive"],
    registrationOpen: true,
    registrationDeadline: "2025-08-28",
    fee: 0,
  },
  {
    id: 5,
    title: "Quantum Cryptography Boot Camp",
    date: "2025-10-18",
    status: "upcoming",
    category: "Boot Camp",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop&auto=format",
    description:
      "Three-day intensive boot camp on quantum key distribution, BB84 protocol, and post-quantum cryptography standards.",
    attendees: 0,
    maxAttendees: 60,
    location: "CS Department Lab",
    tags: ["QKD", "BB84", "Security"],
    registrationOpen: true,
    registrationDeadline: "2025-10-05",
    fee: 499,
  },
  {
    id: 6,
    title: "Annual SoQC Research Conference",
    date: "2025-12-01",
    status: "upcoming",
    category: "Conference",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&auto=format",
    description:
      "Annual flagship conference featuring student research presentations, invited talks, and poster sessions on quantum science.",
    attendees: 0,
    maxAttendees: 300,
    location: "University Convention Center",
    tags: ["Research", "Annual", "Presentations"],
    registrationOpen: false,
    registrationDeadline: "2025-11-20",
    fee: 199,
  },
];

export const articles = [
  {
    id: 1,
    title: "Quantum Supremacy: What It Actually Means",
    category: "Quantum News",
    author: "Arjun Mehta",
    date: "2025-06-28",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "When Google claimed quantum supremacy in 2019, headlines exploded. But what does it really mean for the future of computing — and are we there yet?",
    tags: ["Supremacy", "Google", "Milestones"],
  },
  {
    id: 2,
    title: "Understanding Grover's Search: A Visual Guide",
    category: "Concept Explanations",
    author: "Priya Sharma",
    date: "2025-05-14",
    readTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "Grover's algorithm provides a quadratic speedup for searching unsorted databases. Let's understand the quantum oracle and amplitude amplification step by step.",
    tags: ["Grover's", "Algorithms", "Beginner"],
  },
  {
    id: 3,
    title: "The Bloch Sphere: Visualizing Qubit States",
    category: "Interesting Stories",
    author: "Dhruv Verma",
    date: "2025-04-30",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "A qubit is not just 0 or 1. The Bloch sphere gives us a beautiful geometric way to represent all possible quantum states of a single qubit.",
    tags: ["Qubit", "Visualization", "Physics"],
  },
  {
    id: 4,
    title: "Post-Quantum Cryptography: Preparing for Q-Day",
    category: "Discussions",
    author: "Sneha Patel",
    date: "2025-03-22",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "NIST has standardized new post-quantum cryptographic algorithms. What does this mean for your data, banking, and national security?",
    tags: ["Cryptography", "Security", "NIST"],
  },
  {
    id: 5,
    title: "Topological Qubits: Microsoft's Quantum Bet",
    category: "Quantum News",
    author: "Karan Singh",
    date: "2025-02-18",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "Microsoft's approach to quantum computing relies on exotic Majorana particles. We explore whether this topological approach can finally solve decoherence.",
    tags: ["Topological", "Microsoft", "Hardware"],
  },
  {
    id: 6,
    title: "Quantum Error Correction: Taming the Noise",
    category: "Concept Explanations",
    author: "Ananya Krishnan",
    date: "2025-01-10",
    readTime: "14 min read",
    image:
      "https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?w=800&h=500&fit=crop&auto=format",
    excerpt:
      "Decoherence is the nemesis of quantum computing. Surface codes and logical qubits promise a path to fault-tolerant quantum computation.",
    tags: ["Error Correction", "Surface Codes", "Advanced"],
  },
];

export const projects = [
  {
    id: 1,
    title: "Quantum Key Distribution Simulator",
    type: "Working",
    status: "Active",
    problem:
      "Classical cryptographic protocols are vulnerable to future quantum attacks using Shor's algorithm. A practical demonstration was needed.",
    solution:
      "Implemented BB84 and E91 QKD protocols in Python + Qiskit simulating realistic quantum channel noise and eavesdropper detection.",
    novelty:
      "Real-time eavesdropper detection with visual feedback and comparison of classical vs quantum security metrics.",
    github: "https://github.com/soqc/qkd-simulator",
    tags: ["Qiskit", "Python", "Cryptography", "BB84"],
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop&auto=format",
    team: ["Arjun Mehta", "Priya Sharma", "Dhruv Verma"],
    guide: "Prof. R. Krishnamurthy",
    architecture: [
      "QChannel",
      "Alice Node",
      "Bob Node",
      "Eve Detector",
      "Key Generator",
      "Visualizer",
    ],
  },
  {
    id: 2,
    title: "Variational Quantum Eigensolver for Molecular Simulation",
    type: "Research",
    status: "Ongoing",
    problem:
      "Simulating molecular Hamiltonians on classical computers scales exponentially with molecule size, making drug discovery prohibitively expensive.",
    solution:
      "VQE algorithm with hardware-efficient ansatz circuits to find ground state energies of H₂, LiH, and BeH₂ molecules on IBM quantum hardware.",
    novelty:
      "Custom noise-mitigation technique reducing circuit depth by 40% while maintaining chemical accuracy.",
    github: "https://github.com/soqc/vqe-molecular",
    tags: ["VQE", "Chemistry", "IBM Quantum", "Optimization"],
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop&auto=format",
    team: ["Sneha Patel", "Karan Singh", "Rohan Joshi"],
    guide: "Prof. A. Bhattacharya",
    architecture: [
      "Hamiltonian",
      "Ansatz Circuit",
      "Parameter Optimizer",
      "IBM Backend",
      "Energy Calculator",
      "Results",
    ],
  },
  {
    id: 3,
    title: "Quantum Neural Network for Image Classification",
    type: "Research",
    status: "Completed",
    problem:
      "Quantum advantage in machine learning remains largely theoretical. Practical QNN implementations on NISQ devices lack empirical benchmarks.",
    solution:
      "Hybrid classical-quantum neural network using PennyLane and PyTorch, tested on MNIST subset. Parametric quantum circuits as hidden layers.",
    novelty:
      "Demonstrated 94.3% accuracy on 4-class MNIST with 12-qubit circuit, matching classical CNN with 10× fewer parameters.",
    github: "https://github.com/soqc/qnn-classifier",
    tags: ["PennyLane", "PyTorch", "QML", "NISQ"],
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&auto=format",
    team: ["Ananya Krishnan", "Vikram Rao", "Meera Nair"],
    guide: "Prof. S. Chakraborty",
    architecture: [
      "Input Encoder",
      "Quantum Layer 1",
      "Quantum Layer 2",
      "Classical Layer",
      "Softmax",
      "Output",
    ],
  },
];

export const committee = {
  chair: {
    name: "Calvin S",
    role: "Chairperson",
    domain: "-",
    year: "IV Year",
    dept: "CSE",
    image: "",
    interests: [],
    linkedin: "#",
    instagram: "#",
  },

  viceChair: {
    name: "Jeffrin Edward A",
    role: "Vice Chairperson",
    domain: "-",
    year: "IV Year",
    dept: "IT",
    image: "",
    interests: [],
    linkedin: "#",
    instagram: "#",
  },

  directors: [
    {
      name: "Anantha Yashwanth G",
      role: "Director",
      domain: "Operations and Management",
      year: "IV Year",
      dept: "Geo-Informatics",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Sathia Danish Kevin Merlin Manohar M",
      role: "Director",
      domain: "Resources",
      year: "IV Year",
      dept: "ECE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Shevaani A",
      role: "Director",
      domain: "Web Development",
      year: "IV Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Varshini G",
      role: "Director",
      domain: "Outreach and Relations",
      year: "III Year",
      dept: "ECE - VLSI",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Jenny Alice N",
      role: "Director",
      domain: "Visuals",
      year: "IV Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Danish S",
      role: "Director",
      domain: "Innovation",
      year: "III Year",
      dept: "ECE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
  ],

  deputies: [
    {
      name: "Subbhadithya Singh",
      role: "Deputy Head",
      domain: "Operations and Management",
      year: "IV Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Harshad Kumar S",
      role: "Deputy Head",
      domain: "Resources",
      year: "II Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Sayyad Nazma",
      role: "Deputy Head",
      domain: "Resources",
      year: "III Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Thin Htet Htet Soe E",
      role: "Deputy Head",
      domain: "Web Development",
      year: "II Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Edeline Bertina A",
      role: "Deputy Head",
      domain: "Web Development",
      year: "II Year",
      dept: "IT",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Tharun",
      role: "Deputy Head",
      domain: "Outreach and Relations",
      year: "II Year",
      dept: "ECE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Varsha K",
      role: "Deputy Head",
      domain: "Visuals",
      year: "II Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Advaith P.V",
      role: "Deputy Head",
      domain: "Visuals",
      year: "II Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Niladri Roy K",
      role: "Deputy Head",
      domain: "Innovation",
      year: "II Year",
      dept: "ECE-VLSI",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Ayush R",
      role: "Deputy Head",
      domain: "Innovation",
      year: "II Year",
      dept: "CSE",
      image: "",
      interests: [],
      linkedin: "#",
      instagram: "#",
    },
  ],
};

export const roleColors = {

  Chairperson: {
    main: "#FBBF24",
    light: "rgba(251, 191, 36, 0.55)",
    glow: "rgba(251, 191, 36, 0.45)",
    softGlow: "rgba(251, 191, 36, 0.15)",
    background:
      "linear-gradient(145deg, rgba(120, 80, 8, 0.45), rgba(7, 7, 26, 0.94))",
  },

  "Vice Chairperson": {
    main: "#FF4FD8",
    light: "rgba(255, 79, 216, 0.55)",
    glow: "rgba(255, 79, 216, 0.45)",
    softGlow: "rgba(255, 79, 216, 0.15)",
    background:
      "linear-gradient(145deg, rgba(120, 20, 100, 0.5), rgba(7, 7, 26, 0.94))",
  },

  "Deputy Head": {
    main: "#c084fc",
    light: "rgba(192, 132, 252, 0.55)",
    glow: "rgba(192, 132, 252, 0.45)",
    softGlow: "rgba(192, 132, 252, 0.15)",
    background:
      "linear-gradient(145deg, rgba(88, 28, 135, 0.45), rgba(7, 7, 26, 0.94))",
  },

  Director: {
    main: "#22d3ee",
    light: "rgba(34, 211, 238, 0.55)",
    glow: "rgba(34, 211, 238, 0.45)",
    softGlow: "rgba(34, 211, 238, 0.15)",
    background:
      "linear-gradient(145deg, rgba(8, 51, 68, 0.55), rgba(7, 7, 26, 0.94))",
  },
};

/*
"Deputy Head": {
    main: "#f472b6",
    light: "rgba(244, 114, 182, 0.55)",
    glow: "rgba(244, 114, 182, 0.45)",
    softGlow: "rgba(244, 114, 182, 0.15)",
    background:
      "linear-gradient(145deg, rgba(112, 26, 73, 0.5), rgba(7, 7, 26, 0.94))",
  },

"Deputy Head": {
  main: "#F9A8D4",
  light: "rgba(249, 168, 212, 0.55)",
  glow: "rgba(249, 168, 212, 0.45)",
  softGlow: "rgba(249, 168, 212, 0.15)",
  background:
    "linear-gradient(145deg, rgba(131, 45, 94, 0.45), rgba(7, 7, 26, 0.94))",
},

*/
