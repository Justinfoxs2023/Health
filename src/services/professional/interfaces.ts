/**
 * @fileoverview TS 文件 interfaces.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICertificationData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** name 的描述 */
    name: string;
  /** idNumber 的描述 */
    idNumber: string;
  /** expertType 的描述 */
    expertType: string;
  /** certificates 的描述 */
    certificates: {
    type: string;
    number: string;
    issueDate: Date;
    expireDate: Date;
    imageUrl: string;
  }[];
  /** workExperience 的描述 */
    workExperience: {
    organization: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  /** education 的描述 */
    education: {
    school: string;
    degree: string;
    major: string;
    graduationDate: Date;
  }[];
  /** status 的描述 */
    status: "pending" | "approved" | "rejected";
  /** reviewReason 的描述 */
    reviewReason?: undefined | string;
  /** reviewedAt 的描述 */
    reviewedAt?: undefined | Date;
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IConsultationData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** expertId 的描述 */
    expertId: string;
  /** expertName 的描述 */
    expertName: string;
  /** patientName 的描述 */
    patientName: string;
  /** patientAge 的描述 */
    patientAge: number;
  /** patientGender 的描述 */
    patientGender: string;
  /** symptom 的描述 */
    symptom: string;
  /** medicalHistory 的描述 */
    medicalHistory: string;
  /** attachments 的描述 */
    attachments: string;
  /** status 的描述 */
    status: pending  in_progress  completed  cancelled;
  conclusion: {
    diagnosis: string;
    treatment: string;
    prescription: {
      medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        notes: string;
      }[];
      notes?: string;
    };
    followUpPlan?: string;
  };
  acceptedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourseData {
  /** _id 的描述 */
    _id: string;
  /** expertId 的描述 */
    expertId: string;
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** category 的描述 */
    category: string;
  /** subcategory 的描述 */
    subcategory: string;
  /** cover 的描述 */
    cover: string;
  /** price 的描述 */
    price: number;
  /** duration 的描述 */
    duration: number;
  /** chapters 的描述 */
    chapters: {
    title: string;
    description: string;
    content: string;
    duration: number;
    resources: {
      type: string;
      url: string;
      name: string;
    }[];
  }[];
  /** requirements 的描述 */
    requirements?: undefined | string[];
  /** objectives 的描述 */
    objectives?: undefined | string[];
  /** status 的描述 */
    status: "draft" | "published" | "archived";
  /** enrollments 的描述 */
    enrollments: number;
  /** rating 的描述 */
    rating: number;
  /** ratingCount 的描述 */
    ratingCount: number;
  /** publishedAt 的描述 */
    publishedAt?: undefined | Date;
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IContentData {
  /** _id 的描述 */
    _id: string;
  /** expertId 的描述 */
    expertId: string;
  /** title 的描述 */
    title: string;
  /** content 的描述 */
    content: string;
  /** category 的描述 */
    category: string;
  /** tags 的描述 */
    tags: string;
  /** images 的描述 */
    images: string;
  /** status 的描述 */
    status: draft  published  archived;
  views: number;
  likes: number;
  comments: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQueryParams {
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
  /** status 的描述 */
    status: string;
  /** category 的描述 */
    category: string;
  /** expertId 的描述 */
    expertId: string;
  /** keyword 的描述 */
    keyword: string;
  /** startDate 的描述 */
    startDate: string;
  /** endDate 的描述 */
    endDate: string;
}

export interface IExpertQualification {
  /** userId 的描述 */
    userId: string;
  /** expertType 的描述 */
    expertType: string;
  /** title 的描述 */
    title: string;
  /** organization 的描述 */
    organization: string;
  /** specialties 的描述 */
    specialties: string;
  /** certificates 的描述 */
    certificates: {
    type: string;
    number: string;
    issueDate: Date;
    expireDate: Date;
  }[];
  /** status 的描述 */
    status: "active" | "inactive" | "suspended";
  /** rating 的描述 */
    rating: number;
  /** ratingCount 的描述 */
    ratingCount: number;
  /** consultationCount 的描述 */
    consultationCount: number;
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IReviewData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** targetId 的描述 */
    targetId: string;
  /** targetType 的描述 */
    targetType: consultation  course  content;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IRevenueData {
  /** _id 的描述 */
    _id: string;
  /** expertId 的描述 */
    expertId: string;
  /** amount 的描述 */
    amount: number;
  /** type 的描述 */
    type: consultation  course  content;
  referenceId: string;
  status: pending  completed  refunded;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWithdrawalData {
  /** _id 的描述 */
    _id: string;
  /** expertId 的描述 */
    expertId: string;
  /** amount 的描述 */
    amount: number;
  /** bankInfo 的描述 */
    bankInfo: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  /** status 的描述 */
    status: "pending" | "completed" | "processing" | "failed";
  /** reason 的描述 */
    reason?: undefined | string;
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IStatisticsData {
  /** consultationCount 的描述 */
    consultationCount: number;
  /** courseCount 的描述 */
    courseCount: number;
  /** contentCount 的描述 */
    contentCount: number;
  /** totalRevenue 的描述 */
    totalRevenue: number;
  /** totalWithdrawal 的描述 */
    totalWithdrawal: number;
  /** rating 的描述 */
    rating: number;
  /** ratingCount 的描述 */
    ratingCount: number;
  /** periodStart 的描述 */
    periodStart: Date;
  /** periodEnd 的描述 */
    periodEnd: Date;
}
