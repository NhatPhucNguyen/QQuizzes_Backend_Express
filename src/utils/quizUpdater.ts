import Question from "../models/question";
import Quiz from "../models/quiz";
//update total point and time limit when question data changes
const quizUpdater = async (quizId: string) => {
    const questions = await Question.find({ quizId: quizId });
    const totalPoints = questions.reduce(
        (x, question) => x + question.point,
        0
    );
    const timeLimit = questions.reduce(
        (x, question) => x + question.timeLimit,
        0
    );
    console.log(timeLimit);
    await Quiz.findByIdAndUpdate(quizId, {
        totalPoints: totalPoints,
        timeLimit: timeLimit,
    });
};
export default quizUpdater;
