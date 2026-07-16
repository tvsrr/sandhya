// The two nanodegrees, extracted from the Udacity syllabi (nd213 C++, nd772 Software Architect).
// C++ modules forge a blade, piece by piece. Architect modules raise a temple, tier by tier.
// Each course carries a one-line "why" that fuses the two apprenticeships into one.

export interface Lesson {
  id: string;
  title: string;
  project?: boolean;
}

export interface Course {
  id: string;
  n: string; // "01"
  title: string;
  hours: number;
  artifact: string; // the blade component / temple tier this course forges
  why: string;
  lessons: Lesson[];
}

export interface Track {
  id: "cpp" | "arch";
  name: string;
  subtitle: string;
  hours: number;
  artifactName: string; // "The Blade" / "The Temple"
  courses: Course[];
}

export const CURRICULUM: Track[] = [
  {
    id: "cpp",
    name: "The Forge · C++",
    subtitle: "Udacity nd213 · 42 hours · forging The Blade",
    hours: 42,
    artifactName: "The Blade",
    courses: [
      {
        id: "cpp-c1",
        n: "01",
        title: "Introduction to C++",
        hours: 14,
        artifact: "The Tang — the spine the whole blade is built on",
        why: "Fluency in the language your future architecture will be reasoned about in.",
        lessons: [
          { id: "cpp-c1-l1", title: "Welcome — Stroustrup, impact & guidelines" },
          { id: "cpp-c1-l2", title: "Introduction to C++ and Setup" },
          { id: "cpp-c1-l3", title: "Working with Data Structures and the STL" },
          { id: "cpp-c1-l4", title: "Functions, Modularity and OOP" },
          { id: "cpp-c1-l5", title: "Algorithms — an A* Search implementation" },
          { id: "cpp-c1-l6", title: "Project: OpenStreetMap Route Planner", project: true },
        ],
      },
      {
        id: "cpp-c2",
        n: "02",
        title: "Object-Oriented Programming",
        hours: 12,
        artifact: "The Guard — where structure protects the hand",
        why: "Encapsulation and 'is-a vs has-a' ARE design thinking — the same muscle the architect trains.",
        lessons: [
          { id: "cpp-c2-l1", title: "Encapsulation and Class Design" },
          { id: "cpp-c2-l2", title: "Inheritance, Composition & Class Hierarchies" },
          { id: "cpp-c2-l3", title: "Polymorphism in Depth and Templates" },
          { id: "cpp-c2-l4", title: "Error Handling Strategies and Debugging" },
          { id: "cpp-c2-l5", title: "Project: System Monitoring Tool (htop-style)", project: true },
        ],
      },
      {
        id: "cpp-c3",
        n: "03",
        title: "Memory Management",
        hours: 10,
        artifact: "The Core — the heart of the steel",
        why: "RAII is your first lesson in systems that clean up after themselves — the essence of good architecture.",
        lessons: [
          { id: "cpp-c3-l1", title: "Memory Fundamentals & the System Memory Hierarchy" },
          { id: "cpp-c3-l2", title: "Pointers and Pointer Arithmetic" },
          { id: "cpp-c3-l3", title: "Dynamic Memory Allocation (Heap) & Ownership" },
          { id: "cpp-c3-l4", title: "Copy Constructors, Move Semantics & Rule of 3/5" },
          { id: "cpp-c3-l5", title: "Smart Pointers & Advanced Memory Management" },
          { id: "cpp-c3-l6", title: "Project: Memory BOT", project: true },
        ],
      },
      {
        id: "cpp-c4",
        n: "04",
        title: "Concurrency",
        hours: 6,
        artifact: "The Twin Edge — two things moving safely at once",
        why: "Data races and synchronization are distributed-systems problems in miniature.",
        lessons: [
          { id: "cpp-c4-l1", title: "Threads and Parallel Execution" },
          { id: "cpp-c4-l2", title: "Sharing Data and Task Synchronization" },
          { id: "cpp-c4-l3", title: "Mutexes, Locks and Condition Variables" },
          { id: "cpp-c4-l4", title: "Project: Concurrent Traffic Simulation", project: true },
        ],
      },
    ],
  },
  {
    id: "arch",
    name: "The Temple · Software Architect",
    subtitle: "Udacity nd772 · 53 hours · raising The Temple",
    hours: 53,
    artifactName: "The Temple",
    courses: [
      {
        id: "arch-c1",
        n: "01",
        title: "Test-Driven Development",
        hours: 14,
        artifact: "The Foundation — ground you can build on without fear",
        why: "Encode requirements as tests: the architect's contract with the future.",
        lessons: [
          { id: "arch-c1-l1", title: "Introduction to Test-Driven Development" },
          { id: "arch-c1-l2", title: "Introduction to Testing in Software Development" },
          { id: "arch-c1-l3", title: "Writing Unit Tests in Python (pytest)" },
          { id: "arch-c1-l4", title: "Robust & Maintainable Test Suites" },
          { id: "arch-c1-l5", title: "Diagnosing Failures & Scaling Testing" },
          { id: "arch-c1-l6", title: "Project: Udatracker Order Management System", project: true },
        ],
      },
      {
        id: "arch-c2",
        n: "02",
        title: "Design Patterns",
        hours: 11,
        artifact: "The Pillars — proven forms that bear weight",
        why: "Decades of engineering wisdom, connecting SOLID, dependency injection and clean design.",
        lessons: [
          { id: "arch-c2-l1", title: "Introduction to Design Patterns" },
          { id: "arch-c2-l2", title: "Creational Patterns — Singleton, Factory, Builder" },
          { id: "arch-c2-l3", title: "Structural Patterns — Adapter, Decorator, Composite" },
          { id: "arch-c2-l4", title: "Behavioral Patterns — Observer, Strategy, Command" },
          { id: "arch-c2-l5", title: "Principles in Practice — Dependency Injection" },
          { id: "arch-c2-l6", title: "Project: Personal Finance Manager", project: true },
        ],
      },
      {
        id: "arch-c3",
        n: "03",
        title: "Software Architecture Patterns",
        hours: 15,
        artifact: "The Vault — the span that holds a whole system up",
        why: "From working code to resilient architectures fit for the real world.",
        lessons: [
          { id: "arch-c3-l1", title: "Introduction to Software Architecture Patterns" },
          { id: "arch-c3-l2", title: "Software Architecture — MVC, layered, event-driven" },
          { id: "arch-c3-l3", title: "Communicating Architecture — Mermaid & D2 diagrams" },
          { id: "arch-c3-l4", title: "Microservices and Modular Design Patterns" },
          { id: "arch-c3-l5", title: "Cloud-Native Architectural Patterns (12-factor)" },
          { id: "arch-c3-l6", title: "Data and AI Architecture Patterns" },
          { id: "arch-c3-l7", title: "Distributed Architecture — CDN, IoT, blockchain" },
          { id: "arch-c3-l8", title: "Project: Real-Time Fraud Detection — Solution Design", project: true },
        ],
      },
      {
        id: "arch-c4",
        n: "04",
        title: "Systems Engineering",
        hours: 13,
        artifact: "The Spire — the lifecycle view that crowns it all",
        why: "Requirements to validation: the lifecycle view that separates engineers from architects.",
        lessons: [
          { id: "arch-c4-l1", title: "Introduction to Systems Engineering" },
          { id: "arch-c4-l2", title: "Requirements Analysis and System Modeling" },
          { id: "arch-c4-l3", title: "System Design and Architecture" },
          { id: "arch-c4-l4", title: "System Integration, Verification & Validation" },
          { id: "arch-c4-l5", title: "Project: Smart Home Security System (SysML)", project: true },
        ],
      },
    ],
  },
];

export const ALL_LESSON_IDS: string[] = CURRICULUM.flatMap((t) =>
  t.courses.flatMap((c) => c.lessons.map((l) => l.id))
);

export function trackProgress(track: Track, done: Record<string, boolean>) {
  const ids = track.courses.flatMap((c) => c.lessons.map((l) => l.id));
  const complete = ids.filter((id) => done[id]).length;
  return { complete, total: ids.length, pct: ids.length ? complete / ids.length : 0 };
}

export function courseProgress(course: Course, done: Record<string, boolean>) {
  const complete = course.lessons.filter((l) => done[l.id]).length;
  return { complete, total: course.lessons.length, pct: complete / course.lessons.length };
}
