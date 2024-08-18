import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomePageAdmin from './components/ADMIN/homepageadmin.vue';
import AdminDashboard from './components/ADMIN/ADashboard.vue';
import BarChart from './components/ADMIN/adminbarchart.vue';
import RegisterUser from './components/ADMIN/AregisterUser.vue'
import ManageUser from './components/ADMIN/AManageUser.vue';
import ManageUserTeachers from './components/ADMIN/manageTeachers.vue';
import ManageUserStudents from './components/ADMIN/manegeStudents.vue';
import StrandSection from './components/ADMIN/AStrandSection.vue';
import SectioninSHS from './components/ADMIN/ASection.vue';
import YearLevel from './components/ADMIN/AYearLevel.vue'
import Humms11Page from './components/ADMIN/STRAND/humms11.vue';
import Humms12Page from './components/ADMIN/STRAND/humms12.vue';
import Abm11Page from './components/ADMIN/STRAND/abm11.vue';
import Abm12Page from './components/ADMIN/STRAND/abm12.vue';
import Stem11Page from './components/ADMIN/STRAND/stem11.vue';
import Stem12Page from './components/ADMIN/STRAND/stem12.vue';
import Tvl12Page from './components/ADMIN/STRAND/tvl12.vue';
import Tvl11Page from './components/ADMIN/STRAND/tvl11.vue';
import PieChart from './components/ADMIN/STRAND/piechart.vue';


import Teacher_homepage from './components/TEACHER/teacherhomepage.vue';
import TeachersDashboard from './components/TEACHER/teacherdashboard.vue';
import TeacherAddSubject from './components/TEACHER/teacheraddsubject.vue';
import TeacherListsofSubject from './components/TEACHER/teacherlistofsubject.vue';
import ManagingSubjects from './components/TEACHER/managesubject.vue';
import SubjectPages from './components/TEACHER/subjectspage.vue';
import StudentsListSubject from './components/TEACHER/studentslist.vue';
import Addexaminations from './components/TEACHER/AddExam.vue';
import CreationOfExaminations from './components/TEACHER/CreatingExam.vue';
import FeedbacksofStudent from './components/TEACHER/Feedback.vue';
import ITEManalysis from './components/TEACHER/ItemAnalysis.vue';
import PerformancesTracking from './components/TEACHER/ItemAnalysis.vue';
import ReportGenerating from './components/TEACHER/GenerateReport.vue';

import Student_homepage from './components/STUDENT/studenthomepage.vue';
import StudentDashboard from './components/STUDENT/Sdashboard.vue';
import AddSubject from './components/STUDENT/Saddsubject.vue';
import PendingExam from './components/STUDENT/Spendingexam.vue';
import FinishedExam from './components/STUDENT/Sfinishedexam.vue';
import StudentPerformance from './components/STUDENT/Sperformance.vue';


const routes = [
  { path: '/', component: App },
  { path: '/adminpage', component: HomePageAdmin },
  { path: '/barchart', component: BarChart},
  { path: '/adashboard', component: AdminDashboard },
  { path: '/aregister', component: RegisterUser },
   { path: '/allusers', component: ManageUser },
  { path: '/manage_teachers', component: ManageUserTeachers },
  { path: '/manage_students', component: ManageUserStudents },
  { path: '/pie', component: PieChart},
   { path: '/strand-section', component: StrandSection },
  {path: '/ASection', component: SectioninSHS},
  {path: '/AYearLevel', component: YearLevel},
  { path: '/strand-section/abm11', component: Abm11Page},
  { path: '/strand-section/abm12', component: Abm12Page},
  { path: '/strand-section/humms11', component: Humms11Page},
  { path: '/strand-section/humms12', component: Humms12Page},
  { path: '/strand-section/stem11', component: Stem11Page},
  { path: '/strand-section/stem12', component: Stem12Page},
  { path: '/strand-section/tvl11', component: Tvl11Page},
  { path: '/strand-section/tvl12', component: Tvl12Page},
  { path: '/teacher', component: Teacher_homepage },
 
  { path: '/teacher', component: Teacher_homepage },
  { path: '/teacherdashboard', component: TeachersDashboard},
  { path: '/teacheraddsubject', component: TeacherAddSubject},
  { path: '/teacherlistofsubject', component: TeacherListsofSubject},
  { path: '/managesubject', component: ManagingSubjects},
  { path: '/subjectspage/:subjectId', component: SubjectPages, name: 'SubjectPage' },
  { path: '/studentslist', component: StudentsListSubject},
  { path: '/AddExam', component: Addexaminations },
  { path: '/CreatingExam', component: CreationOfExaminations},
  { path: '/Feedback', component: FeedbacksofStudent },
  { path: '/ItemAnalysis', component: ITEManalysis },
  { path: '/PerformanceTracking', component: PerformancesTracking },
  { path: '/GenerateReport', component: ReportGenerating},
  { path: '/student', component: Student_homepage },
  { path: '/sdashboard', component: StudentDashboard },
  { path: '/saddsubject', component: AddSubject },
  { path: '/spending', component: PendingExam },
  { path: '/sfinished', component: FinishedExam },
  { path: '/sperformance', component: StudentPerformance },
  // Add routes for other user types if needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;