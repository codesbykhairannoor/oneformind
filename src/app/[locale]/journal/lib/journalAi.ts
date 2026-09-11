export interface CognitiveDistortionInfo {
    name: string;
    description: string;
    reframeAdvice: string;
}

export interface CognitiveAnalysisResult {
    mindsetTheme: string;
    summarySentence: string;
    sentimentSummary: string;
    cognitiveTone: 'highly_positive' | 'productive_flow' | 'balanced_calm' | 'reflective_low' | 'stressed_friction';
    detectedDistortion?: CognitiveDistortionInfo;
    reframeAdvice: string;
    reflectionPrompt: string;
    reflectiveQuestion: string;
    suggestedTags: string[];
    wordCount: number;
    readingTimeMinutes: number;
}

export function analyzeJournalCognitive(
    text: string, 
    mood: string = 'awesome', 
    locale: string = 'id'
): CognitiveAnalysisResult {
    const isIndo = locale === 'id';
    const cleanText = (text || '').replace(/<[^>]*>?/gm, ' ').trim();
    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    const lower = cleanText.toLowerCase();

    // 1. Content pattern detection
    const isAmbitionMultitask = /bingung|lomba|prosiding|sinta|penelitian|intern|remote|conversation|seo|meta ads|banyak banget|mana dulu|target|proyek|bikin \d+|jasa web/i.test(lower);
    const isCatastrophizing = /hancur|bubar|kiamat|segalanya rusak|ruined|disaster|hopeless|terburuk|berantakan/i.test(lower);
    const isAllOrNothing = /selalu|tidak pernah|gagal total|pasti gagal|always|never|total failure|worthless|sia-sia/i.test(lower);
    const isOverwhelmed = /kewalahan|stres|capek banget|muak|burnout|overwhelmed|exhausted|too much|panik|pusing|mumet|frustrasi/i.test(lower);
    const isGratitude = /bersyukur|terima kasih|alhamdulillah|beruntung|grateful|thankful|blessed|senang sekali/i.test(lower);
    const isAchievement = /berhasil|selesai|tuntas|capai|sukses|win|achieved|finished|progress|goal/i.test(lower);
    const isDeepThinking = /kenapa|mengapa|makna|tujuan|belajar|future|purpose|meaning|lesson|hikmah/i.test(lower);

    // Auto-detect suggested tags
    const suggestedTags: string[] = [];
    if (isAmbitionMultitask) suggestedTags.push(isIndo ? 'ambisi' : 'ambition');
    if (isGratitude) suggestedTags.push(isIndo ? 'syukur' : 'gratitude');
    if (isAchievement) suggestedTags.push(isIndo ? 'pencapaian' : 'win');
    if (isOverwhelmed || isAmbitionMultitask) suggestedTags.push(isIndo ? 'kejelasan' : 'clarity');
    if (isDeepThinking) suggestedTags.push(isIndo ? 'refleksi' : 'reflection');
    if (/kerja|tugas|klien|proyek|kantor|work|project|code|bug|seo|web/i.test(lower)) suggestedTags.push(isIndo ? 'karier' : 'career');
    if (/keluarga|teman|istri|suami|anak|family|friends|partner/i.test(lower)) suggestedTags.push(isIndo ? 'keluarga' : 'family');
    if (/kesehatan|olahraga|gym|lari|tidur|health|sleep|workout/i.test(lower)) suggestedTags.push(isIndo ? 'kesehatan' : 'wellness');

    if (suggestedTags.length === 0) {
        suggestedTags.push(isIndo ? 'harian' : 'daily');
    }

    let mindsetTheme = isIndo ? 'Keseimbangan & Ketenangan' : 'Balance & Clarity';
    let cognitiveTone: CognitiveAnalysisResult['cognitiveTone'] = 'balanced_calm';
    let summarySentence = '';
    let detectedDistortion: CognitiveDistortionInfo | undefined = undefined;
    let reframeAdvice = '';
    let reflectionPrompt = '';

    // Content-aware evaluation order: Ambition/Overload -> Distortion/Stress -> Low/Sad -> Wins/Gratitude -> Baseline
    if (isAmbitionMultitask) {
        mindsetTheme = isIndo ? 'Ambisi Tinggi & Kejelasan Fokus' : 'High Ambition & Priority Focus';
        cognitiveTone = 'productive_flow';
        detectedDistortion = {
            name: isIndo ? 'Beban Pilihan & Keinginan Multitasking' : 'Choice Overload & Multitasking Impulse',
            description: isIndo 
                ? 'Terlalu banyak ide dan target besar berbarengan memicu kebingungan arah awal.' 
                : 'Having too many high-stakes goals simultaneously causes directional confusion.',
            reframeAdvice: isIndo
                ? 'Prinsip Prioritas Stoik: Kamu bisa melakukan segalanya, tapi TIDAK semuanya sekaligus. Pilih 1 prioritas terbesar minggu ini dan eksekusi dulu.'
                : 'Stoic Priority Principle: You can do anything, but NOT everything at once. Choose 1 primary goal this week and execute.'
        };
        summarySentence = isIndo
            ? 'Terdeteksi banyak target besar (lomba, penelitian, karir, web). Diperlukan urutan prioritas agar energi tidak terpecah.'
            : 'Multiple high-ambition targets detected (contests, research, career, web). Prioritization is key to prevent split focus.';
        reframeAdvice = detectedDistortion.reframeAdvice;
        reflectionPrompt = isIndo
            ? 'Dari semua target yang kamu tulis, mana 1 hal yang paling berdampak besar jika kamu selesaikan lebih dulu?'
            : 'Of all the goals listed, which single one will create the biggest leverage if completed first?';
    } else if (mood === 'angry' || isCatastrophizing || isOverwhelmed) {
        mindsetTheme = isIndo ? 'Tekanan Emosi & Ujian Stoik' : 'High Friction & Stoic Test';
        cognitiveTone = 'stressed_friction';
        detectedDistortion = isCatastrophizing 
            ? {
                name: isIndo ? 'Catastrophizing' : 'Catastrophizing',
                description: isIndo ? 'Kecenderungan melebih-lebihkan kemungkinan skenario terburuk.' : 'Tendency to assume the absolute worst possible outcome.',
                reframeAdvice: isIndo 
                    ? 'Tarik nafas dalam. Fakta apa yang sebenarnya terjadi vs apa yang hanya asumsi kekhawatiran pikiranmu?' 
                    : 'Take a deep breath. What are the objective facts versus what your anxious mind is assuming?'
            }
            : {
                name: isIndo ? 'Beban Kognitif Berlebih' : 'Cognitive Overload',
                description: isIndo ? 'Pikiran terlalu padat dengan terlalu banyak tuntutan simultan.' : 'Mind overloaded with too many simultaneous stimuli and demands.',
                reframeAdvice: isIndo
                    ? 'Prinsip Dikotomi Kendali Stoik: Lepaskan hal di luar kuasamu, fokus hanya pada 1 langkah mikro berikutnya.'
                    : 'Stoic Dichotomy of Control: Release external noise and focus solely on the immediate single next move.'
            };
        summarySentence = isIndo
            ? 'Terdeteksi gesekan emosi atau tekanan tinggi. Tubuh dan pikiran membutuhkan jeda dekompresi.'
            : 'High mental friction and acute pressure detected. Immediate decompression advised.';
        reframeAdvice = detectedDistortion.reframeAdvice;
        reflectionPrompt = isIndo
            ? 'Jika kamu melihat tantangan ini dari sudut pandang 1 tahun dari sekarang, apa yang paling bijak dilakukan malam ini?'
            : 'Looking back at this obstacle from 1 year in the future, what is the single most wise move tonight?';
    } else if (mood === 'sad' || isAllOrNothing) {
        mindsetTheme = isIndo ? 'Refleksi Diri & Pemulihan Energi' : 'Gentle Recovery & Introspection';
        cognitiveTone = 'reflective_low';
        detectedDistortion = isAllOrNothing
            ? {
                name: isIndo ? 'Pola Pikiran Serba Hitam-Putih' : 'All-or-Nothing Thinking',
                description: isIndo ? 'Melihat situasi hanya sebagai sukses total atau gagal total.' : 'Viewing outcomes purely as 100% success or complete failure.',
                reframeAdvice: isIndo
                    ? 'Hidup bukan angka biner. Kemajuan kecil sebesar 1% tetaplah sebuah kemajuan berharga.'
                    : 'Life is nuanced. A small 1% progressive step is still meaningful and worthy.'
            }
            : {
                name: isIndo ? 'Kelelahan Emosional' : 'Emotional Fatigue',
                description: isIndo ? 'Baterai mental sedang rendah.' : 'Low mental battery requiring gentle restoration.',
                reframeAdvice: isIndo
                    ? 'Satu hari yang berat tidak mendefinisikan hidupmu. Bersikaplah lembut pada diri sendiri malam ini.'
                    : 'One difficult day does not define your life trajectory. Practice gentle self-compassion.'
            };
        summarySentence = isIndo
            ? 'Fase refleksi mendalam dengan penurunan energi emosional. Waktu tepat untuk istirahat tanpa menghakimi diri.'
            : 'Deep introspective phase with low emotional energy. Ideal for gentle, non-judgmental rest.';
        reframeAdvice = detectedDistortion.reframeAdvice;
        reflectionPrompt = isIndo
            ? 'Apa 1 hal sederhana penuh kehangatan yang bisa kamu berikan pada dirimu malam ini?'
            : 'What is 1 simple, soothing act of care you can give yourself tonight?';
    } else if (isAchievement || isGratitude || mood === 'awesome') {
        mindsetTheme = isIndo ? 'Puncak Momentum & Rasa Syukur' : 'Peak Momentum & Gratitude';
        cognitiveTone = 'highly_positive';
        summarySentence = isIndo 
            ? 'Gelombang energi tinggi, rasa syukur mendalam, dan momentum pencapaian yang kuat.'
            : 'High-energy state, profound gratitude, and strong goal momentum.';
        reframeAdvice = isIndo
            ? 'Kunci pemicu keberhasilan hari ini agar pola pikir produktif ini dapat diulang kembali esok hari.'
            : 'Capture the key triggers of your win today so you can intentionally replicate this peak state.';
        reflectionPrompt = isIndo
            ? 'Pola pikir atau tindakan apa yang paling berkontribusi pada pencapaianmu hari ini?'
            : 'What mindset or action contributed the most to your wins today?';
    } else if (mood === 'good') {
        mindsetTheme = isIndo ? 'Fokus Berkelanjutan (Productive Flow)' : 'Sustainable Flow & Progress';
        cognitiveTone = 'productive_flow';
        summarySentence = isIndo
            ? 'Fokus stabil, kemajuan bertahap yang konsisten, dan suasana batin yang seimbang.'
            : 'Steady focus, consistent progressive growth, and balanced mental clarity.';
        reframeAdvice = isIndo
            ? 'Konsistensi kecil yang berulang adalah kunci kesuksesan jangka panjang. Kamu berada di jalur yang benar.'
            : 'Small continuous daily progress compounds into massive results. You are on track.';
        reflectionPrompt = isIndo
            ? 'Bagaimana kamu bisa mempertahankan ritme yang stabil ini untuk esok hari?'
            : 'How can you maintain this positive steady rhythm going into tomorrow?';
    } else {
        mindsetTheme = isIndo ? 'Ketenangan & Observasi Sadar' : 'Calm & Mindful Baseline';
        cognitiveTone = 'balanced_calm';
        summarySentence = isIndo
            ? 'Suasana hati netral, refleksi tenang, dan kesiapan untuk menerima hari baru.'
            : 'Calm and steady baseline state with room for mindful presence.';
        reframeAdvice = isIndo
            ? 'Ketenangan batin adalah ruang terbaik untuk menyusun ide dan mengambil keputusan strategis.'
            : 'Inner tranquility is the fertile ground for creative breakthroughs and sound strategy.';
        reflectionPrompt = isIndo
            ? 'Apa satu hal menarik yang ingin kamu pelajari atau eksplorasi esok hari?'
            : 'What is one intriguing idea you want to explore or deepen tomorrow?';
    }

    return {
        mindsetTheme,
        summarySentence,
        sentimentSummary: summarySentence,
        cognitiveTone,
        detectedDistortion,
        reframeAdvice,
        reflectionPrompt,
        reflectiveQuestion: reflectionPrompt,
        suggestedTags,
        wordCount,
        readingTimeMinutes
    };
}

// Alias for backward compatibility
export const analyzeJournalEntry = analyzeJournalCognitive;


