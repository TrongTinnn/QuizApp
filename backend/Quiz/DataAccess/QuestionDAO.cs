using BusinessObjects;
using BusinessObjects.DTO;
using BusinessObjects.DTO.Submit;
using BusinessObjects.DTO.ValidateQuestion;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class QuestionDAO
    {

        private readonly QuizDbContext _context;

        public QuestionDAO(QuizDbContext context)
        {
            _context = context;
        }
        public IEnumerable<Question> GetAllQuestions()
        {
            return _context.Questions.Include(q => q.Options).ToList();
        }
        //public List<QuestionDTO> GetAllQuestions()
        //{
        //    return _context.Questions
        //        .Include(q => q.Options)
        //        .Select(q => new QuestionDTO
        //        {
        //            Id = q.Id,
        //            Text = q.Text,
        //            Options = q.Options.Select(o => new OptionDTO
        //            {
        //                Id = o.Id,
        //                Text = o.Text,
        //                IsCorrect = o.IsCorrect
        //            }).ToList()
        //        }).ToList();
        //}
        public bool CheckAnswer(int questionId, int optionId)
        {
            var option = _context.Options
                .FirstOrDefault(o => o.Id == optionId && o.QuestionId == questionId);

            return option?.IsCorrect ?? false;
        }

        public QuizResultDTO SubmitQuiz(List<SubmitAnswerDTO> answers, DateTime startTime)
        {
            int correct = 0;

            foreach (var ans in answers)
            {
                var isCorrect = _context.Options
                    .Any(o => o.Id == ans.SelectedOptionId && o.QuestionId == ans.QuestionId && o.IsCorrect);

                if (isCorrect)
                    correct++;
            }

            var endTime = DateTime.Now;
            bool passed = correct >= answers.Count * 0.6;

            // Lưu kết quả quiz
            var quizResult = new QuizResult
            {
                StartTime = startTime,
                EndTime = endTime,
                TotalCorrect = correct,
                IsPass = passed,
                QuizAnswers = answers.Select(a => new QuizAnswer
                {
                    QuestionId = a.QuestionId,
                    SelectedOptionId = a.SelectedOptionId
                }).ToList()
            };

            _context.QuizResults.Add(quizResult);
            _context.SaveChanges();

            return new QuizResultDTO
            {
                DurationSeconds = (endTime - startTime).TotalSeconds,
                CorrectAnswers = correct,
                TotalQuestions = answers.Count,
                Passed = passed,
               SubmissionId = quizResult.Id
            };
        }

        public List<ReviewAnswerDTO> GetReviewAnswers(int quizResultId)
        {
            var result = _context.QuizAnswers
                .Where(qa => qa.QuizResultId == quizResultId)
                .Include(qa => qa.Question)
                    .ThenInclude(q => q.Options)
                .Include(qa => qa.SelectedOption)
                .Select(qa => new ReviewAnswerDTO 
                {
                    QuestionId = qa.QuestionId,
                    QuestionText = qa.Question.Text,
                    Options = qa.Question.Options.Select(o => new OptionDTO
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList(),
                    SelectedOptionId = qa.SelectedOptionId,
                    CorrectOptionId = qa.Question.Options.FirstOrDefault(o => o.IsCorrect).Id
                })
                .ToList();

            return result;
        }


    }
}
