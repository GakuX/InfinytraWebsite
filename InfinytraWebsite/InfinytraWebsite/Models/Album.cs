namespace InfinytraWebsite.Models
{
    public class Album
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Description { get; set; } 

        public DateTime CreatedDate { get; set; }   

        public string ImageURL { get; set; }

        public List<Song> Songs { get; set; }   
    }
}
