using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class CheckoutRequest
    {
        [Required]
        public List<CheckoutItem> Items { get; set; } = new();
    }

    public class CheckoutItem
    {
        public int MerchId { get; set; }
        public int Qty { get; set; }
    }

    public class ReviewRequest
    {
        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;
    }
}
