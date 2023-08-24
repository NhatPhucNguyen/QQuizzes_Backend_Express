export interface IUser {
    username: string;
    password: string;
    email: string;
    purpose: string;
    fullName: string;
    educationInstitution?: string;
    job?: string;
    role: string;
    refreshToken?: string;
}

export interface IQuiz {
    quizName: string;
    topic: string;
    level: string;
    quantity?: number;
    userId: string;
}

export interface IQuestion {
    questionNumber?: number;
    question: string;
    desc?: string;
    selections: ISelection[];
    point: number;
    timeLimit: number;
    quizId: string;
}

export interface ISelection {
    selectionNumber: number;
    desc: string;
    isTrue?: boolean;
}

export interface IPlayer {
    userId: string;
    quizParticipated: string;
    attempts: IAttempt[];
}

export interface IAttempt {
    point: number;
    timeCompleted: number;
    correctAnswers: number;
    questionsCompleted?: number;
}
declare module "express" {
    export interface Request {
        userId?: string;
    }
}
