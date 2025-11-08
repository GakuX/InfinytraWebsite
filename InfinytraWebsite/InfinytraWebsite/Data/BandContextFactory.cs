using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace InfinytraWebsite.Data
{
    public class BandContextFactory : IDesignTimeDbContextFactory<BandContext>
    {
        public BandContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BandContext>();

            // Load appsettings.json manually
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = config.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new BandContext(optionsBuilder.Options);
        }
    }
}
