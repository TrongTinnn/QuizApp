using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class QuizResult
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int TotalCorrect { get; set; }
        public bool IsPass { get; set; }

        public ICollection<QuizAnswer> QuizAnswers { get; set; }

    }
}
