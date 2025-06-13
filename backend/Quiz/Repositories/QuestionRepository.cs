using BusinessObjects;
using BusinessObjects.DTO.ValidateQuestion;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.DTO.Submit;
using BusinessObjects.DTO;

namespace Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        //private readonly QuizDbContext _context;

        //public QuestionRepository(QuizDbContext context)
        //{
        //    _context = context;
        //}

        //public IEnumerable<Question> GetAllQuestions()
        //{
        //    return _context.Questions.Include(q => q.Options).ToList();
        //}
        private readonly QuestionDAO _questionDAO;

        public QuestionRepository(QuestionDAO questionDAO)
        {
            _questionDAO = questionDAO;
        }

        public IEnumerable<Question> GetAllQuestions() =>  _questionDAO.GetAllQuestions();
      
      
        public bool CheckAnswer(int questionId, int optionId)
        {
            return _questionDAO.CheckAnswer(questionId, optionId);
        }
        public QuizResultDTO SubmitQuiz(List<SubmitAnswerDTO> answers, DateTime startTime)
        {
            return _questionDAO.SubmitQuiz(answers, startTime);
        }
        public List<ReviewAnswerDTO> GetReviewAnswers(int quizResultId)
        {
            return _questionDAO.GetReviewAnswers(quizResultId);
        }

    }
}
