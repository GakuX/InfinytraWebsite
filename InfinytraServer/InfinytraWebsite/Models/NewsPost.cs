using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class NewsPost
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Blurb { get; set; }

        public DateTime PostedDate { get; set; }
    }
}
