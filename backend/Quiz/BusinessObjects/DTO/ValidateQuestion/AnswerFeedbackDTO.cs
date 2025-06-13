using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.DTO.ValidateQuestion
{
    public class AnswerFeedbackDTO
    {
        public bool IsCorrect { get; set; }
        public string Message { get; set; }
    }
}
