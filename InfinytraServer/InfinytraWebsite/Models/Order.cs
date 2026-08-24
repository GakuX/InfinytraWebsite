using Newtonsoft.Json;

namespace InfinytraWebsite.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; } = "Placed";

        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        [JsonIgnore]
        public Order? Order { get; set; }

        public int MerchId { get; set; }
        [JsonIgnore]
        public Merch? Merch { get; set; }

        // Snapshot of name/price at purchase time so later Merch edits don't rewrite order history.
        public string ItemName { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }

        public int Qty { get; set; }
    }
}
