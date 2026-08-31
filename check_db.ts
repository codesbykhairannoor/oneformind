import { prisma } from './src/lib/prisma';

async function checkData() {
  try {
    const userCount = await prisma.user.count();
    const goalCount = await prisma.goal.count();
    const journalCount = await prisma.journal.count();
    const calendarCount = await prisma.calendarEvent.count();
    const habitCount = await prisma.habit.count();
    const plannerTaskCount = await prisma.plannerTask.count();
    const plannerDailyCount = await prisma.plannerDaily.count();
    const jobCount = await prisma.job.count();
    const financeTransCount = await prisma.financeTransaction.count();
    const financeCatCount = await prisma.financeCategory.count();
    const studyCourseCount = await prisma.studyCourse.count();
    const studyArchiveCount = await prisma.studyArchive.count();
    
    console.log('=== DATABASE RECORD COUNTS ===');
    console.log(`Users:              ${userCount}`);
    console.log(`Goals:              ${goalCount}`);
    console.log(`Journals:           ${journalCount}`);
    console.log(`Calendar Events:    ${calendarCount}`);
    console.log(`Habits:             ${habitCount}`);
    console.log(`Planner Tasks:      ${plannerTaskCount}`);
    console.log(`Planner Daily:      ${plannerDailyCount}`);
    console.log(`Jobs:               ${jobCount}`);
    console.log(`Finance Trans:      ${financeTransCount}`);
    console.log(`Finance Categories: ${financeCatCount}`);
    console.log(`Study Courses:      ${studyCourseCount}`);
    console.log(`Study Archives:     ${studyArchiveCount}`);
    console.log('==============================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
