export interface JournalTemplate {
    id: string;
    icon: string;
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    moodDefault: string;
    tags: string[];
    contentTemplate: {
        id: string;
        en: string;
    };
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
    {
        id: 'morning_primer',
        icon: '🌅',
        title: {
            id: 'Persiapan Pagi (Morning Primer)',
            en: 'Morning Primer & Intentions'
        },
        subtitle: {
            id: 'Tentukan niat, 3 fokus utama, dan pola pikir terbaik hari ini',
            en: 'Set intentions, top 3 priorities, and daily mindset'
        },
        moodDefault: 'awesome',
        tags: ['pagi', 'fokus', 'produktivitas'],
        contentTemplate: {
            id: `### 🎯 Niat & Fokus Utama Hari Ini
1. 
2. 
3. 

### ☀️ Pola Pikir & Sikap Mental yang Ingin Saya Bawa
> "Hari ini saya memilih untuk tetap tenang, berorientasi solusi, dan tidak terdistraksi hal di luar kendali."

### 🙏 3 Hal Kecil yang Saya Syukuri Pagi Ini:
- 
- 
- `,
            en: `### 🎯 Today's Intentions & Top 3 Priorities
1. 
2. 
3. 

### ☀️ Mindset & Attitude I Choose to Embody
> "Today I choose to stay calm, solution-oriented, and undistracted by things outside my control."

### 🙏 3 Small Things I Am Grateful for This Morning:
- 
- 
- `
        }
    },
    {
        id: 'evening_reflection',
        icon: '🌙',
        title: {
            id: 'Refleksi Malam (Evening Decompression)',
            en: 'Evening Decompression & Wins'
        },
        subtitle: {
            id: 'Evaluasi pencapaian, lepaskan beban pikiran, dan istirahat berkualitas',
            en: 'Celebrate wins, release mental friction, and unwind'
        },
        moodDefault: 'good',
        tags: ['malam', 'refleksi', 'evaluasi'],
        contentTemplate: {
            id: `### 🏆 3 Kemenangan / Kemajuan Hari Ini (Wins of the Day):
1. 
2. 
3. 

### 💡 Pelajaran Berharga atau Hal yang Bisa Diperbaiki:
- 

### 🍃 Pelepasan Beban Mental (Brain Dump & Let Go):
> Hari ini telah selesai. Saya telah memberikan yang terbaik, dan hal-hal yang belum selesai akan saya lanjutkan besok dengan energi baru.`,
            en: `### 🏆 3 Wins & Progress of the Day:
1. 
2. 
3. 

### 💡 Key Lessons & What I Can Improve:
- 

### 🍃 Mental Decompression & Letting Go:
> The day is done. I gave my best effort, and whatever remains unfinished will be handled tomorrow with fresh energy.`
        }
    },
    {
        id: 'stoic_reframing',
        icon: '🏛️',
        title: {
            id: 'Refleksi Stoik (Cognitive Reframing)',
            en: 'Stoic Reflection & Cognitive Reframe'
        },
        subtitle: {
            id: 'Bedakan hal dalam vs luar kendali, ubah rintangan jadi pelajaran',
            en: 'Dichotomy of control & transforming obstacles into wisdom'
        },
        moodDefault: 'okay',
        tags: ['stoik', 'ketenangan', 'mindset'],
        contentTemplate: {
            id: `### 🌊 Peristiwa / Tantangan yang Menghampiri Hari Ini:
- 

### ⚖️ Dikotomi Kendali (Dichotomy of Control):
- **Di Luar Kendali Saya (Harus Diikhlaskan)**:
  - 
- **Dalam Kendali Saya (Fokus Tindakan Saya)**:
  - 

### 💎 Amor Fati (Mencintai Takdir & Mengubah Hambatan):
> "Hambatan dalam tindakan memajukan tindakan. Apa yang menghalangi jalan justru menjadi jalan."`,
            en: `### 🌊 Challenge or Trigger Faced Today:
- 

### ⚖️ Dichotomy of Control:
- **Outside My Control (Accept & Let Go)**:
  - 
- **Within My Control (My Response & Action)**:
  - 

### 💎 Amor Fati (Loving Fate & The Obstacle is the Way):
> "The impediment to action advances action. What stands in the way becomes the way."`
        }
    },
    {
        id: 'gratitude_box',
        icon: '🙏',
        title: {
            id: 'Log Rasa Syukur (Gratitude Journal)',
            en: 'Daily Gratitude Log'
        },
        subtitle: {
            id: 'Tingkatkan hormon kebahagiaan dengan menghargai momen bermakna',
            en: 'Boost positive psychology and appreciate meaningful moments'
        },
        moodDefault: 'awesome',
        tags: ['syukur', 'kebahagiaan', 'afirmasi'],
        contentTemplate: {
            id: `### 💖 3 Orang atau Hubungan yang Saya Hargai Hari Ini:
1. 
2. 
3. 

### ✨ 1 Momen Sederhana yang Membuat Saya Tersenyum:
- 

### 🌟 1 Keberuntungan atau Fasilitas Hidup yang Sering Saya Lupakan:
- `,
            en: `### 💖 3 People or Relationships I Deeply Appreciate Today:
1. 
2. 
3. 

### ✨ 1 Simple Moment That Made Me Smile Today:
- 

### 🌟 1 Privilege or Blessing I Often Take for Granted:
- `
        }
    },
    {
        id: 'brain_dump',
        icon: '💡',
        title: {
            id: 'Pembersihan Pikiran (Brain Dump & Ideas)',
            en: 'Brain Dump & Unfiltered Thinking'
        },
        subtitle: {
            id: 'Tumpahkan seluruh ide liar, kekhawatiran, dan rencana bebas',
            en: 'Unload all raw thoughts, creative sparks, and worries'
        },
        moodDefault: 'good',
        tags: ['ide', 'braindump', 'kreativitas'],
        contentTemplate: {
            id: `### ⚡ Ide Liar & Inspirasi Spontan:
- 

### 🌪️ Hal yang Sedang Mengisi Kepala Saya:
- 

### 🚀 1 Langkah Nyata Berikutnya:
- `,
            en: `### ⚡ Raw Ideas & Spontaneous Sparks:
- 

### 🌪️ Things Cluttering My Mind Right Now:
- 

### 🚀 The Next Immediate Actionable Step:
- `
        }
    }
];
