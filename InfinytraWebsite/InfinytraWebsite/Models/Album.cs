using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace InfinytraWebsite.Models
{
    public class Album
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }
        [DataType(DataType.Date)]
        public DateTime? CreatedDate { get; set; }   

        [DataType(DataType.Url)]
        [Url]
        public string ImageURL { get; set; }

        [ValidateNever]
        public List<Song> Songs { get; set; }   
    }
}
