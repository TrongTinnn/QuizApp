using BusinessObjects;
using BusinessObjects.DTO.ValidateQuestion;
using BusinessObjects.DTO.Submit;
using BusinessObjects.DTO;

namespace Repositories
{
    public interface IQuestionRepository
    {
        IEnumerable<Question> GetAllQuestions();
        bool CheckAnswer(int questionId, int optionId);
        QuizResultDTO SubmitQuiz(List<SubmitAnswerDTO> answers, DateTime startTime);

        List<ReviewAnswerDTO> GetReviewAnswers(int quizResultId);
    }
}
