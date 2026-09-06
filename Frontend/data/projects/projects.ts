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