import { Socket } from "socket.io";
import { ISelection } from "../../interfaces/db_interfaces";
import Question from "../../models/question";
export const questionHandlers = async (socket: Socket) => {
    socket.on(
        "checking_answer",
        async (data: { questionId: string; selection: ISelection }) => {
            const foundQuestion = await Question.findById(data.questionId);
            if (!foundQuestion) {
                return socket.emit("receive_answer", {
                    ...data,
                    message: "false",
                });
            }
            const foundSelection = foundQuestion?.selections.find(
                (item) => item.desc === data.selection.desc
            );
            if (!foundSelection || !foundSelection.isTrue) {
                return socket.emit("receive_answer", {
                    ...data,
                    message: "false",
                });
            }
            socket.emit("receive_answer", {
                ...data,
                message: "true",
            });
        }
    );
};
