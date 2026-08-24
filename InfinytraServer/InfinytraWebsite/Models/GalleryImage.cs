using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class GalleryImage
    {
        public int Id { get; set; }

        [Required]
        public string ImageURL { get; set; }

        public string Caption { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public DateTime UploadedDate { get; set; }
    }
}
