// Think First career strength data. A sourced mapping of skills to roles, not a prediction of anyone's career.
// Sources are listed in careers-step1.md (ACM/IEEE CS2023, O*NET). Nothing here is shown with a link.
//
// How the 63 combinations were derived (the stored results below are what the page uses):
//   1. Each topic has weights (0 to 3) on four specialisations: ALG, SYS, DATA, PLC (topicWeights).
//   2. A combination's score per specialisation is the sum of its topics' weights.
//   3. A role's score is the sum of (specialisation score x role weight) divided by the role's total weight.
//   4. The top role always wins. A second role is added if its score is at least 70% of the top score.
//   5. Ties go to the order of the roles list. The tracks are the tracks of the chosen roles.
window.TF_CAREERS = {
  // One generic, non-personalised line shown to everyone after their first finished topic.
  generic: "Data Structures are what software engineers use to make programs fast and memory-efficient, from route finding and search to databases and operating systems. Roles across software engineering ask for this skill when they need someone to choose the right structure for a problem.",
  topicLetters: { search: "A", stackq: "B", lists: "C", trees: "D", graphs: "E", sorthash: "F" },
  specs: ["ALG", "SYS", "DATA", "PLC"],
  topicWeights: { A: [1, 0, 1, 0], B: [0, 2, 0, 2], C: [0, 3, 0, 0], D: [1, 0, 2, 2], E: [3, 0, 0, 1], F: [2, 1, 2, 0] },
  secondRoleRatio: 0.7,
  // listed in tie-break order
  roles: [
    { name: "Algorithm Engineer", w: [3, 0, 0, 0], track: "Algorithms", desc: "enjoys designing efficient solutions rather than implementing existing ones" },
    { name: "Research Engineer", w: [2, 1, 1, 1], track: "Algorithms", desc: "likes turning an open problem or a paper into working, tested code and experiments" },
    { name: "Systems Software Engineer", w: [1, 3, 0, 0], track: "Systems", desc: "likes building the layer other programs run on, where memory, threads and I/O matter, and finding why it is slow" },
    { name: "Kernel Developer", w: [0, 3, 0, 0], track: "Systems", desc: "wants to work close to the hardware, inside the operating system core, in C" },
    { name: "Compiler Engineer", w: [1, 0, 0, 3], track: "Languages and compilers", desc: "likes how code becomes a running program and enjoys trees, graphs and parsing" },
    { name: "Database Engineer", w: [1, 1, 3, 0], track: "Data", desc: "wants to build how data is stored, indexed and found quickly and safely" }
  ],
  foundation: ["Data Structures and Algorithms", "Discrete Mathematics", "Object-Oriented Programming", "Complexity Analysis", "C and C++"],
  tracks: {
    "Algorithms": { stack: ["advanced graph algorithms", "dynamic programming", "greedy algorithms", "computational geometry", "probability and statistics", "Python and C++ optimisation"], projects: ["route optimisation engine", "graph search visualiser", "scheduling optimiser"] },
    "Systems": { stack: ["Operating Systems (concurrency, scheduling, memory management)", "Computer Architecture", "networking", "Linux and Unix", "C, C++ and Rust"], projects: ["basic shell", "memory allocator", "task scheduler"] },
    "Data": { stack: ["database internals (B-trees, hash indexes, LSM-trees)", "indexing and transactions", "SQL and query processing", "C++, Go or Rust"], projects: ["B-tree index", "key-value store", "small SQL engine"] },
    "Languages and compilers": { stack: ["parsing", "syntax trees", "control-flow graphs and dataflow analysis", "LLVM", "C++"], projects: ["expression parser and evaluator", "bytecode interpreter", "small optimising compiler"] }
  },
  // All 63 non-empty sets of topics A to F. Letters are the topics in order.
  combos: {
    A: { roles: ["Algorithm Engineer","Database Engineer"], tracks: ["Algorithms","Data"] },
    B: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    C: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    D: { roles: ["Compiler Engineer","Database Engineer"], tracks: ["Languages and compilers","Data"] },
    E: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    F: { roles: ["Algorithm Engineer","Database Engineer"], tracks: ["Algorithms","Data"] },
    AB: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    AC: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    AD: { roles: ["Database Engineer","Algorithm Engineer"], tracks: ["Data","Algorithms"] },
    AE: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    AF: { roles: ["Algorithm Engineer","Database Engineer"], tracks: ["Algorithms","Data"] },
    BC: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BD: { roles: ["Compiler Engineer"], tracks: ["Languages and compilers"] },
    BE: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    BF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    CD: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    CE: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    CF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    DE: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    DF: { roles: ["Database Engineer","Algorithm Engineer"], tracks: ["Data","Algorithms"] },
    EF: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    ABC: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ABD: { roles: ["Compiler Engineer","Research Engineer"], tracks: ["Languages and compilers","Algorithms"] },
    ABE: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    ABF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ACD: { roles: ["Kernel Developer","Database Engineer"], tracks: ["Systems","Data"] },
    ACE: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ACF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ADE: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    ADF: { roles: ["Algorithm Engineer","Database Engineer"], tracks: ["Algorithms","Data"] },
    AEF: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    BCD: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BCE: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BCF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BDE: { roles: ["Compiler Engineer","Algorithm Engineer"], tracks: ["Languages and compilers","Algorithms"] },
    BDF: { roles: ["Compiler Engineer","Database Engineer"], tracks: ["Languages and compilers","Data"] },
    BEF: { roles: ["Algorithm Engineer","Research Engineer"], tracks: ["Algorithms"] },
    CDE: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    CDF: { roles: ["Kernel Developer","Database Engineer"], tracks: ["Systems","Data"] },
    CEF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    DEF: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    ABCD: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ABCE: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ABCF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ABDE: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    ABDF: { roles: ["Database Engineer","Algorithm Engineer"], tracks: ["Data","Algorithms"] },
    ABEF: { roles: ["Algorithm Engineer","Research Engineer"], tracks: ["Algorithms"] },
    ACDE: { roles: ["Algorithm Engineer","Research Engineer"], tracks: ["Algorithms"] },
    ACDF: { roles: ["Database Engineer","Algorithm Engineer"], tracks: ["Data","Algorithms"] },
    ACEF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ADEF: { roles: ["Algorithm Engineer"], tracks: ["Algorithms"] },
    BCDE: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BCDF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BCEF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    BDEF: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    CDEF: { roles: ["Algorithm Engineer","Research Engineer"], tracks: ["Algorithms"] },
    ABCDE: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ABCDF: { roles: ["Kernel Developer","Systems Software Engineer"], tracks: ["Systems"] },
    ABCEF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ABDEF: { roles: ["Algorithm Engineer","Compiler Engineer"], tracks: ["Algorithms","Languages and compilers"] },
    ACDEF: { roles: ["Algorithm Engineer","Research Engineer"], tracks: ["Algorithms"] },
    BCDEF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] },
    ABCDEF: { roles: ["Algorithm Engineer","Systems Software Engineer"], tracks: ["Algorithms","Systems"] }
  }
};
