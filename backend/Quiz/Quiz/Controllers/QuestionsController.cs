using BusinessObjects.DTO.Submit;
using BusinessObjects.DTO.ValidateQuestion;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;

namespace Quiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionsController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        // GET: api/Questions
        [HttpGet]
        public IActionResult GetAll()
        {
            var questions = _questionRepository.GetAllQuestions();
            return Ok(questions);
        }

        [HttpPost("validate")]
        public ActionResult<AnswerFeedbackDTO> ValidateAnswer([FromBody] SubmitAnswerDTO request)
        {
            var isCorrect = _questionRepository.CheckAnswer(request.QuestionId, request.SelectedOptionId);

            return Ok(new AnswerFeedbackDTO
            {
                IsCorrect = isCorrect,
                Message = isCorrect ? "Correct!" : "Incorrect!"
            });
        }

        [HttpPost("submit")]
        public IActionResult SubmitQuiz([FromBody] QuizSubmitDTO dto)
        {
            DateTime receivedStartTime = dto.StartTime;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");

            DateTime startTimeUtc;
            if (receivedStartTime.Kind == DateTimeKind.Local)
            {
                startTimeUtc = receivedStartTime.ToUniversalTime();
            }
            else if (receivedStartTime.Kind == DateTimeKind.Unspecified)
            {
                startTimeUtc = DateTime.SpecifyKind(receivedStartTime, DateTimeKind.Utc);
            }
            else
            {
                startTimeUtc = receivedStartTime;
            }

            DateTime startTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(startTimeUtc, vietnamTimeZone);

            dto.StartTime = startTimeVietnam;
            var result = _questionRepository.SubmitQuiz(dto.Answers, dto.StartTime);
            return Ok(result);
        }

        [HttpGet("review/{quizResultId}")]
        public IActionResult GetReviewAnswers(int quizResultId)
        {
            var result = _questionRepository.GetReviewAnswers(quizResultId);
            if (result == null || !result.Any())
                return NotFound("No answers found for this quiz result.");

            return Ok(result);
        }
    }
}
