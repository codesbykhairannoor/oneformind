'use client';

import GuestLayout from '@/components/GuestLayout';
import StudentHero from '@/components/solutions/student/StudentHero';
import StudentProblem from '@/components/solutions/student/StudentProblem';
import StudentSolutions from '@/components/solutions/student/StudentSolutions';
import StudentKitWorkflow from '@/components/solutions/student/StudentKitWorkflow';
import StudentScienceFaqCta from '@/components/solutions/student/StudentScienceFaqCta';

export default function SolutionStudentPage() {
    return (
        <GuestLayout>
            <main id="solution-student" className="overflow-x-hidden text-left">
                <StudentHero />
                <StudentProblem />
                <StudentSolutions />
                <StudentKitWorkflow />
                <StudentScienceFaqCta />
            </main>
            <style>{`
                .animate-spin-slow {
                    animation: spin 45s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
