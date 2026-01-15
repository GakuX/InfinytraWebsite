using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinytraWebsite.Migrations
{
    /// <inheritdoc />
    public partial class addOnsale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OnSale",
                table: "Merches",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnSale",
                table: "Merches");
        }
    }
}
