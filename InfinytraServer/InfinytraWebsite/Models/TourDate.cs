using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class TourDate
    {
        public int Id { get; set; }

        public DateTime ShowDate { get; set; }

        [Required]
        public string Venue { get; set; }

        public string Location { get; set; }

        public string? TicketUrl { get; set; }
    }
}
