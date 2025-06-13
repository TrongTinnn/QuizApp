using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class QuizAnswer
    {
        public int Id { get; set; }
        public int QuizResultId { get; set; }
        public QuizResult QuizResult { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public int SelectedOptionId { get; set; }
        public Option SelectedOption { get; set; }
    }
}
