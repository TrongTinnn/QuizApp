using BusinessObjects.DTO.ValidateQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.DTO.Submit
{
    public class QuizSubmitDTO
    {
        public List<SubmitAnswerDTO> Answers { get; set; }
        public DateTime StartTime { get; set; }
    }
}
