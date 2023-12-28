
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
    totalPoints: number;
    timeLimit: number;
    userId: string;
    joinCode: string;
    numberOfPlays:number;
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
    desc: string;
    isTrue?: boolean;
}

export interface IPlayer {
    userId: string;
    quizParticipated: string;
    result: IResult;
    displayName: string;
}

export interface IResult {
    highestPoint: number;
    timeCompleted: number;
    correctAnswers: number;
    questionsCompleted?: number;
    attempts: number;
}
declare module "express" {
    export interface Request {
        userId?: string;
        displayName?: string;
    }
}
