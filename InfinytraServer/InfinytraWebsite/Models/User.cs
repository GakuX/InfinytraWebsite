using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace InfinytraWebsite.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }

        // Never serialize this - even via an unrelated entity's navigation property (e.g. Review.User).
        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsAdmin { get; set; }
    }
}
