using System.Text.Json.Serialization;

namespace BusinessObjects
{
    public class Option
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }
        [JsonIgnore]
        public Question? Question { get; set; }
    }
}
