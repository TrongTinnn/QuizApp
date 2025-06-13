using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.DTO
{
    public class QuizResultDTO
    {
        public double  DurationSeconds { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public bool Passed { get; set; }
        public int SubmissionId { get; set; }
    }
}
