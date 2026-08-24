using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace InfinytraWebsite.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int MerchId { get; set; }
        [JsonIgnore]
        public Merch? Merch { get; set; }

        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }

        // Snapshot of the username at review time so the review still reads fine if the account changes later.
        public string Username { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }
}
