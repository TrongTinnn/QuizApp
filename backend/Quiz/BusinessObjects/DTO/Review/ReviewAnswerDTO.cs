using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.DTO
{
    public class ReviewAnswerDTO
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public List<OptionDTO> Options { get; set; }
        public int SelectedOptionId { get; set; }
        public int CorrectOptionId { get; set; }
    }
}
