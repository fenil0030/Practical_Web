export interface JobModel {
    id: number;
    userId: number;
    name: string;
    email: string;
    address: string;
    gender: string;
    contact: string;
    educationDetails: EducationDetail[];
    workExperience: WorkExperience[];
    languages: Language[];
    technicalSkills: TechnicalSkill[];
    preferredLocation: string;
    expectedCtc: string;
    currentCtc: string;
    noticePeriod: string;
    isDeleted: boolean;
  }
  interface TechnicalSkill {
    id: number;
    jobId: number;
    skillName: string;
    isMain: boolean;
    beginner: boolean;
    mediator: boolean;
    expert: boolean;
  }
  interface Language {
    id: number;
    jobId: number;
    languageName: string;
    isMain: boolean;
    canRead: boolean;
    canWrite: boolean;
    canSpeak: boolean;
  }
  interface WorkExperience {
    id: number;
    jobId: number;
    companyName: string;
    designation: string;
    fromDate: string;
    toDate: string;
    isDeleted: boolean;
  }
  interface EducationDetail {
    id: number;
    jobId: number;
    university: string;
    year: number;
    percentage: number;
    isDeleted: boolean;
  }