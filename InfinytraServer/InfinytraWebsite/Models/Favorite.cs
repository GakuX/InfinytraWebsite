using Newtonsoft.Json;

namespace InfinytraWebsite.Models
{
    public class Favorite
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }

        public int MerchId { get; set; }
        [JsonIgnore]
        public Merch? Merch { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
