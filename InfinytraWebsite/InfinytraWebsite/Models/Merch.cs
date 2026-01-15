using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class Merch
    {
        public int Id { get; set; } 

        [Required]
        public string ItemName { get; set; }

        public string ItemDescription { get; set; }

        public bool NewItem { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string ImageURL { get; set; }

        public string Gender { get; set;  }

        public bool InStock { get; set; }

        public string Categories { get; set; }

        public bool OnSale { get; set; }

        public decimal? SalePrice { get; set; }





    }
}
