export interface BlogSection {
  id: string;
  title: string;
  level: 'h2' | 'h3';
  paragraphs: string[];
  callout?: {
    type: 'tip' | 'quote' | 'important';
    text: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  isoDate: string;
  readTime: string;
  icon: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  takeaways: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'mastering-atomic-habits-in-daily-life',
    title: 'Mastering Atomic Habits: How Small 1% Improvements Compounding Every Day',
    subtitle: 'The behavioral psychology behind habit stacking, identity transformation, and friction reduction.',
    excerpt: 'Learn the exact psychological framework behind habit stacking, identity shift, and friction reduction.',
    category: 'Methodology',
    categoryColor: '#4f46e5',
    date: 'Aug 18, 2026',
    isoDate: '2026-08-18T08:00:00Z',
    readTime: '5 min read',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
    author: {
      name: 'Aditya Pratama',
      role: 'Behavioral Systems Architect',
      avatar: 'A',
      bio: 'Productivity researcher specializing in habit formation, cognitive workflow architecture, and behavioral economics.',
    },
    takeaways: [
      'Focus on systems and identity rather than standalone goals.',
      'Stack new micro-habits onto existing anchored routines to lower cognitive friction.',
      'The 2-Minute Rule prevents overwhelming your prefrontal cortex during habit initiation.',
      'A 28-day continuous streak cements neural pathways for lifelong automaticity.',
    ],
    sections: [
      {
        id: 'the-math-of-micro-habits',
        title: '1. The Exponential Mathematics of 1% Daily Improvements',
        level: 'h2',
        paragraphs: [
          'Most people overestimate what they can achieve in a single hyper-motivated weekend and drastically underestimate what happens when they improve by just 1% every day for a year. Mathematically, 1.01 to the power of 365 equals 37.78—meaning you become nearly 38 times more capable, disciplined, and effective.',
          'Conversely, when daily bad habits slip by 1% each day (0.99 to the power of 365), you decay down to 0.03. Habits are the compound interest of self-improvement. Just as money multiplies through compound interest, the effects of your daily actions multiply as you repeat them.',
        ],
        callout: {
          type: 'quote',
          text: 'You do not rise to the level of your goals. You fall to the level of your systems. — James Clear',
        },
      },
      {
        id: 'the-four-laws-in-digital-era',
        title: '2. The Four Laws of Behavior Change in a Digital Lifestyle',
        level: 'h2',
        paragraphs: [
          'To make a constructive habit stick in our era of non-stop notification bombardment, you must systematically design your environment across four psychological stages: Cue, Craving, Response, and Reward.',
          'Make it Obvious: Position your habit cues directly in your primary digital dashboard so you cannot ignore them. When you open your daily planner, your primary 3 habits should greet you instantly.',
          'Make it Attractive: Pair an essential routine with a high-dopamine activity (temptation bundling). For example, listen to your favorite podcast only while completing your daily exercise block.',
          'Make it Easy: Minimize friction. If a habit takes more than 2 minutes to initiate, resistance skyrockets. Never allow tool complexity to become an excuse for inaction.',
          'Make it Satisfying: Immediate positive reinforcement activates dopamine pathways. Visualizing your streak counter advancing triggers the neurological closure required for habit consolidation.',
        ],
      },
      {
        id: 'habit-stacking-architecture',
        title: '3. Habit Stacking: Building Unbreakable Neural Sequences',
        level: 'h2',
        paragraphs: [
          'One of the fastest ways to build a new habit is to identify a current habit you already do each day and stack your new behavior on top. The psychological formula is simple: "After [CURRENT HABIT], I will [NEW HABIT]."',
          'For example: "After I pour my first morning coffee, I will review my Tranvas 3 Most Important Tasks (MITs) for 2 minutes." By anchoring to an existing biological reflex, you bypass decision fatigue entirely.',
        ],
        callout: {
          type: 'tip',
          text: 'Start small: Limit your initial habit stack to no more than 3 consecutive micro-actions. Once that chain runs on autopilot for 21 days, layer the next behavior.',
        },
      },
      {
        id: 'navigating-the-plateau',
        title: '4. Surviving the Plateau of Latent Potential',
        level: 'h2',
        paragraphs: [
          'In the early weeks of building any meaningful habit, results are almost invisible. This lag between effort and visible outcome is known as the Plateau of Latent Potential. People often quit in week 2 or 3 because they feel their dedication is yielding no measurable reward.',
          'In reality, your effort is not wasted; it is simply being stored. Like ice melting only when the temperature rises from 31 to 32 degrees Fahrenheit, the breakthrough occurs after weeks of invisible molecular preparation. Tracking your streaks visibly ensures you stay consistent until the compound curve ignites.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Berapa hari waktu nyata yang dibutuhkan untuk membentuk kebiasaan baru?',
        a: 'Penelitian ilmiah dari Dr. Phillippa Lally di University College London menunjukkan bahwa rata-rata pembentukan kebiasaan membutuhkan waktu 66 hari, dengan rentang 18 hingga 254 hari tergantung kompleksitas kebiasaan. Tranvas menggunakan siklus sprint 28 hari sebagai fondasi awal terpenting.',
      },
      {
        q: 'Apa yang harus dilakukan jika saya melewatkan 1 hari dalam streak kebiasaan?',
        a: 'Terapkan aturan emas: "Never miss twice" (Jangan pernah bolos dua kali berturut-turut). Melewatkan satu hari adalah kecelakaan biologis; melewatkan dua hari adalah awal dari kebiasaan buruk baru.',
      },
      {
        q: 'Apakah lebih baik membangun banyak kebiasaan sekaligus atau satu per satu?',
        a: 'Fokuskan energi kemauan (willpower) Anda maksimal pada 2 hingga 3 kebiasaan inti (keystone habits) seperti tidur teratur, latihan fisik, atau time-blocking sebelum menambah kebiasaan spesifik lainnya.',
      },
    ],
  },
  {
    slug: 'deep-work-framework-for-modern-professionals',
    title: 'The Deep Work Blueprint: Eliminating Context Switching for Peak Focus',
    subtitle: 'How to structure your day into uninterrupted 90-minute focus blocks without burning out.',
    excerpt: 'How to structure your day into uninterrupted 90-minute focus blocks without burning out.',
    category: 'Focus',
    categoryColor: '#9333ea',
    date: 'Aug 15, 2026',
    isoDate: '2026-08-15T08:00:00Z',
    readTime: '7 min read',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
    author: {
      name: 'Nadia Salsabila',
      role: 'Executive Performance Strategist',
      avatar: 'N',
      bio: 'Consultant helping knowledge workers and engineering leaders eliminate distraction and design uninterrupted focus workflows.',
    },
    takeaways: [
      'Context switching costs up to 23 minutes of refocusing time per interruption.',
      'Structure work around the 90-minute Ultradian Rhythm for optimal cognitive throughput.',
      'Classify tasks aggressively using the Eisenhower Matrix before touching your keyboard.',
      'A shutdown ritual completely terminates cognitive open loops at the end of each workday.',
    ],
    sections: [
      {
        id: 'the-hidden-cost-of-attention-residue',
        title: '1. Attention Residue: The Silent Productivity Killer',
        level: 'h2',
        paragraphs: [
          'When you switch from Task A to Task B, your attention does not immediately follow. A residue of your cognition remains stuck thinking about the previous task, especially if Task A was left unresolved. Dr. Sophie Leroy at the University of Minnesota coined this phenomenon "Attention Residue."',
          'Checking an incoming message or responding to an email for just 30 seconds can sabotage your concentration for up to 20 minutes. Knowledge workers who switch tabs dozens of times each hour operate in a chronic state of cognitive exhaustion without producing genuine high-value output.',
        ],
        callout: {
          type: 'important',
          text: 'Deep Work is the ability to focus without distraction on a cognitively demanding task. It creates new value, improves your skill, and is hard to replicate.',
        },
      },
      {
        id: 'the-90-minute-ultradian-block',
        title: '2. The 90-Minute Ultradian Rhythm Focus Cycle',
        level: 'h2',
        paragraphs: [
          'Human biology operates on ultradian rhythms throughout both sleep and wakefulness. Our brain can sustain high-frequency beta and gamma waves of peak mental acuity for approximately 90 minutes before requiring a physiological dip.',
          'Instead of attempting marathon 8-hour uninterrupted slogs, divide your day into two or three 90-minute Deep Work blocks separated by 20-minute restorative breaks. During these 90 minutes, enter full flight-mode: turn off notifications, close auxiliary browser tabs, and focus exclusively on your single most critical objective.',
        ],
      },
      {
        id: 'the-eisenhower-prioritization-matrix',
        title: '3. Prioritizing via the Eisenhower Matrix',
        level: 'h2',
        paragraphs: [
          'What is urgent is seldom important, and what is important is seldom urgent. Most professionals spend 80% of their bandwidth firefighting trivial emergencies generated by other people.',
          'Quadrant 1 (Urgent & Important): Crises, deadlines, project launches. Execute immediately.',
          'Quadrant 2 (Not Urgent but Important): Deep work, strategic planning, skill mastery, health habits. Schedule dedicated blocks in advance. This is where high performers create their 10x leverage.',
          'Quadrant 3 (Urgent but Not Important): Constant pings, minor approvals. Delegate or batch into 15-minute bursts.',
          'Quadrant 4 (Neither Urgent nor Important): Mindless social scrolling, unnecessary tweaking. Eliminate ruthlessly.',
        ],
      },
      {
        id: 'the-evening-shutdown-ritual',
        title: '4. The Cognitive Shutdown Ritual',
        level: 'h2',
        paragraphs: [
          'Without a formal boundary marking the end of work, incomplete tasks generate the Zeigarnik effect—an intrusive psychological tension that keeps your brain ruminating on unfinished business throughout dinner and family time.',
          'At the conclusion of your workday, execute a 5-minute shutdown ritual: review completed tasks in your planner, migrate uncompleted items to tomorrow, jot down any lingering thoughts in your journal, and verbally confirm: "Shutdown Complete." This signals your subconscious that it is safe to recover.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Berapa jam Deep Work yang realistis bisa dicapai dalam satu hari?',
        a: 'Bagi kebanyakan profesional dan pemikir tingkat tinggi, batas fisiologis deep work murni adalah sekitar 3 hingga 4 jam per hari. Menghabiskan 4 jam dalam konsentrasi mendalam menghasilkan lebih banyak nilai daripada 10 jam kerja terdistraksi.',
      },
      {
        q: 'Bagaimana menghadapi rekan kerja atau atasan yang menuntut balasan instan?',
        a: 'Komunikasikan jadwal Deep Work Anda secara transparan. Tetapkan "office hours" atau jendela waktu tertentu (misalnya pukul 11.00 dan 16.00) untuk membalas email dan pesan internal.',
      },
      {
        q: 'Apakah mendengarkan musik membantu deep work?',
        a: 'Musik instrumental tanpa vokal (seperti ambient, lo-fi, atau binaural beats pada frekuensi 40Hz) terbukti membantu mempertahankan fokus dengan menyaring kebisingan lingkungan tanpa memicu pemrosesan bahasa di otak.',
      },
    ],
  },
  {
    slug: 'financial-clarity-with-tranvas-finance-os',
    title: 'Financial Peace of Mind: Bridging Daily Spending with Long-Term Wealth',
    subtitle: 'A zero-based budgeting system built inside your productivity workflow to eliminate money anxiety.',
    excerpt: 'A zero-based budgeting system built inside your productivity workflow to eliminate money anxiety.',
    category: 'Finance OS',
    categoryColor: '#059669',
    date: 'Aug 10, 2026',
    isoDate: '2026-08-10T08:00:00Z',
    readTime: '6 min read',
    icon: '💰',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    author: {
      name: 'Rizky Firmansyah',
      role: 'Certified Financial Planner & Systems Designer',
      avatar: 'R',
      bio: 'Financial educator helping modern professionals automate wealth building, master cashflow forecasting, and eliminate lifestyle inflation.',
    },
    takeaways: [
      'Money management is 80% behavioral psychology and only 20% math.',
      'Give every single rupiah or dollar a job before the month starts using Zero-Based Budgeting.',
      'Aligning daily habits with spending categories uncovers the root cause of financial leakage.',
      'A 15-minute Weekly Financial Check-in eliminates end-of-month financial anxiety forever.',
    ],
    sections: [
      {
        id: 'the-behavioral-roots-of-spending',
        title: '1. The Behavioral Psychology of Money Leaks',
        level: 'h2',
        paragraphs: [
          'Traditional budgeting advice fails because it treats money as an isolated spreadsheet problem. In reality, spending decisions are emotional symptoms of our daily habits, stress levels, and cognitive fatigue.',
          'When you work late under extreme stress, you order expensive delivery. When you feel disconnected, retail therapy provides an instant dopamine hit. If your financial tool lives in an isolated spreadsheet that you check once every two months, you only diagnose the financial damage long after it occurred.',
        ],
        callout: {
          type: 'tip',
          text: 'Behavior is upstream of money. By tracking your daily habits and expenses in the same integrated workflow, you cure the cause rather than merely lamenting the symptom.',
        },
      },
      {
        id: 'zero-based-budgeting-principles',
        title: '2. The Zero-Based Cashflow Framework',
        level: 'h2',
        paragraphs: [
          'Zero-based budgeting does not mean having zero dollars in your bank account; it means your Income minus your Expenses, Savings, and Investments equals zero at the planning stage.',
          'Before a new month begins, allocate every single unit of currency into predefined buckets: Needs (50%), Strategic Goals & Wealth Building (30%), and Conscious Guilt-Free Spending (20%). When money is given a mission in advance, it cannot slip away into untracked impulse purchases.',
        ],
      },
      {
        id: 'connecting-cashflow-to-goals',
        title: '3. Connecting Daily Transactions to Milestone Goals',
        level: 'h2',
        paragraphs: [
          'Saving money for the abstract sake of "saving" is neurologically painful. The brain perceives delayed gratification as a penalty. To make financial discipline effortless, connect every automated transfer directly to an inspiring milestone in your Goal Tracker.',
          'Whether building a 6-month Emergency Fund, investing in your seed capital, or funding a dream sabbatical, watching your progress bar climb from 30% to 75% transforms saving from an act of deprivation into a game of tangible victory.',
        ],
      },
      {
        id: 'the-weekly-finance-sprint',
        title: '4. The 15-Minute Sunday Financial Reconciliation',
        level: 'h2',
        paragraphs: [
          'Never wait until the end of the month to check your accounts. By then, budget variances are irreversible. Instead, perform a 15-minute weekly reconciliation every Sunday afternoon.',
          'Review your actual outflow versus your weekly allowance, reconcile your bank and digital wallet balances, and adjust your remaining categories. This lightweight rhythm keeps you fully in control of your financial destiny.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Berapa besaran dana darurat yang ideal untuk seorang profesional mandiri atau freelancer?',
        a: 'Untuk profesional dengan pendapatan tidak tetap, disarankan memiliki dana darurat setara dengan 6 hingga 12 bulan pengeluaran rutin. Untuk karyawan dengan penghasilan tetap, 3 hingga 6 bulan sudah memadai.',
      },
      {
        q: 'Bagaimana cara mencegah "lifestyle creep" (pengeluaran meningkat saat gaji naik)?',
        a: 'Terapkan aturan pembagian kenaikan: jika Anda mendapatkan kenaikan penghasilan atau bonus, alokasikan minimal 70% dari selisih tersebut langsung ke investasi dan tabungan, dan gunakan maksimal 30% untuk peningkatan gaya hidup.',
      },
      {
        q: 'Apakah mencatat pengeluaran setiap hari menyita banyak waktu?',
        a: 'Tidak, jika dilakukan langsung pada saat transaksi atau dicatat sekilas dalam waktu 60 detik setiap malam di dashboard Tranvas Finance OS Anda.',
      },
    ],
  },
  {
    slug: 'building-a-second-brain-for-personal-knowledge',
    title: 'Building a Second Brain: Organising Notes, Insights, and Ideas Effortlessly',
    subtitle: 'Stop forgetting great ideas. Transform your digital journal into an active knowledge retrieval hub.',
    excerpt: 'Stop forgetting great ideas. Transform your digital journal into an active knowledge retrieval hub.',
    category: 'Second Brain',
    categoryColor: '#d97706',
    date: 'Aug 05, 2026',
    isoDate: '2026-08-05T08:00:00Z',
    readTime: '8 min read',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&q=80',
    author: {
      name: 'Maya Indriani',
      role: 'Knowledge Systems Researcher',
      avatar: 'M',
      bio: 'Author and knowledge management consultant specializing in digital cognition, mental models, and personal learning networks.',
    },
    takeaways: [
      'Your biological brain is designed for having ideas, not for holding them.',
      'Implement the CODE framework: Capture, Organize, Distill, Express.',
      'Organize notes by actionability (projects and areas) rather than academic categories.',
      'Transform passive consumption into active synthesis with reflective journaling.',
    ],
    sections: [
      {
        id: 'the-biological-brain-bottleneck',
        title: '1. The Biological Brain Bottleneck',
        level: 'h2',
        paragraphs: [
          'Human working memory can hold only four to seven chunks of information simultaneously. Trying to remember project deadlines, book quotes, meeting takeaways, and grocery lists inside your biological skull creates severe cognitive drag.',
          'As productivity pioneer David Allen noted, "Your brain is for having ideas, not for holding them." When you offload the storage of knowledge to an external digital system, your mind is freed to do what it does best: synthesize, connect, and innovate.',
        ],
        callout: {
          type: 'quote',
          text: 'Information only becomes knowledge when you integrate it into your personal workflow and take action on it.',
        },
      },
      {
        id: 'the-code-framework',
        title: '2. The CODE Methodology: From Capture to Expression',
        level: 'h2',
        paragraphs: [
          'Capture: Keep only what resonates. Do not bookmark hundreds of articles blindly. Save only high-signal excerpts, personal epiphanies, and profound insights that spark immediate curiosity.',
          'Organize: Organize for actionability, not by topic. Filing notes under "Psychology" or "Marketing" guarantees you will never look at them again. File them under active projects, focus areas, or study modules.',
          'Distill: Find the essence through Progressive Summarization. Read the raw text, bold the key sentences, highlight the core golden nuggets, and write an executive summary in your own words.',
          'Express: Show your work. Knowledge that is never expressed dies in digital storage. Turn your notes into articles, client pitches, presentations, or finished products.',
        ],
      },
      {
        id: 'active-retrieval-hub',
        title: '3. Connecting Daily Journaling with Long-Term Knowledge',
        level: 'h2',
        paragraphs: [
          'A diary records what happened yesterday; an active Second Brain journal records what you learned and how it changes your strategy for tomorrow.',
          'By logging daily reflections, key mistakes, and weekly lessons learned inside your Tranvas Journal, you construct an indexed personal operating manual that becomes exponentially more valuable with each passing year.',
        ],
      },
      {
        id: 'escaping-the-collectors-fallacy',
        title: '4. Escaping the Collector\'s Fallacy',
        level: 'h2',
        paragraphs: [
          'The Collector\'s Fallacy is the deceptive feeling that by saving an article, buying a book, or clipping a webpage, you have acquired its underlying knowledge. You have not—you have only acquired the digital container.',
          'Real learning requires wrestling with ideas: rephrasing concepts, linking them to your current projects, and testing them in real-world scenarios. Make distillation mandatory before filing anything into your archive.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Apa perbedaan antara catatan biasa dan Second Brain?',
        a: 'Catatan biasa bersifat pasif dan terfragmentasi di berbagai folder yang sering terlupakan. Second Brain adalah sistem dinamis yang diorganisir berdasarkan proyek aktif, siap disintesis menjadi karya nyata sewaktu-waktu.',
      },
      {
        q: 'Berapa banyak waktu yang harus saya luangkan untuk mengelola Second Brain?',
        a: 'Cukup 10 hingga 15 menit per hari saat melakukan review harian dan 30 menit saat Weekly Review. Jangan biarkan proses pengorganisasian memakan waktu lebih banyak daripada eksekusi.',
      },
      {
        q: 'Bagaimana cara mencari catatan lama dengan cepat?',
        a: 'Gunakan penamaan yang konsisten, tag berbasis proyek, dan tulis ringkasan satu kalimat di bagian atas setiap catatan agar mudah dipindai.',
      },
    ],
  },
  {
    slug: 'why-habit-and-finance-in-one-app-beats-notion',
    title: 'Why Habit & Finance in One App Beats Notion Templates',
    subtitle: 'Modern high performers spend too much time connecting fragmented tools. Here is why an integrated Life OS creates lasting consistency.',
    excerpt: 'Modern high performers spend too much time connecting fragmented tools. Here is why an integrated Life OS creates lasting consistency.',
    category: 'Architecture',
    categoryColor: '#2563eb',
    date: 'Aug 01, 2026',
    isoDate: '2026-08-01T08:00:00Z',
    readTime: '6 min read',
    icon: '🚀',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    author: {
      name: 'Aditya Pratama',
      role: 'Behavioral Systems Architect',
      avatar: 'A',
      bio: 'Productivity researcher specializing in habit formation, cognitive workflow architecture, and behavioral economics.',
    },
    takeaways: [
      'Fragmented tools create mental fatigue and context switching penalties.',
      'Habit discipline directly impacts spending patterns; separating them blinds you to root causes.',
      'Pre-built, opinionated operating systems eliminate the procrastination trap of infinite template customization.',
      'Unified data across 8 core modules enables holistic life acceleration.',
    ],
    sections: [
      {
        id: 'the-procrastination-of-notion-customization',
        title: '1. The Productivity Trap of Infinite Customization',
        level: 'h2',
        paragraphs: [
          'Notion is a marvelous blank canvas for wikis and documentation. However, when applied to personal daily execution, its endless flexibility becomes a trap. Users spend hours tweaking database relations, color schemes, and rollups—mistaking interface configuration for genuine life accomplishment.',
          'This phenomenon is known as "Productive Procrastination." You feel exhausted from work, yet zero meaningful tasks were completed. An opinionated, finely tuned Personal OS removes the setup friction so you can focus 100% on execution from minute one.',
        ],
        callout: {
          type: 'important',
          text: 'The best productivity system is the one that gets out of your way and lets you do your actual work.',
        },
      },
      {
        id: 'the-friction-of-fragmented-apps',
        title: '2. The Cognitive Friction of App Hopping',
        level: 'h2',
        paragraphs: [
          'Logging tasks in Todoist, habits in Habitify, expenses in Spendee, notes in Apple Notes, and goals in a spreadsheet requires opening five separate applications and managing five separate logins.',
          'Each transition introduces a momentary lapse of concentration and opens the door to notification distractions. By converging all eight vital domains into Tranvas, your daily workflow becomes a seamless, unified continuum.',
        ],
      },
      {
        id: 'holistic-behavioral-data',
        title: '3. Holistic Feedback Loops for Life Mastery',
        level: 'h2',
        paragraphs: [
          'When your habit tracker, time-blocked planner, and budget exist in the same database ecosystem, you gain unprecedented self-awareness. You notice that weeks with high deep work hours correlate with zero impulse spending and consistent exercise streaks.',
          'Disconnected apps can never provide this cross-domain intelligence. An integrated Life OS mirrors your complete human operating system with total clarity.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Apakah Tranvas sepenuhnya menggantikan Notion?',
        a: 'Untuk tim kolaboratif dan dokumentasi wiki perusahaan, Notion tetap sangat baik. Namun untuk manajemen hidup personal harian (tugas, kebiasaan, keuangan, goals), Tranvas memberikan kecepatan dan integrasi yang jauh lebih superior tanpa beban setup.',
      },
      {
        q: 'Apakah data saya aman dan privat di Tranvas?',
        a: 'Ya. Seluruh data pengguna diamankan dengan enkripsi standar enterprise di PostgreSQL, dan kami tidak pernah menjual atau membagikan data personal Anda kepada pihak ketiga.',
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

