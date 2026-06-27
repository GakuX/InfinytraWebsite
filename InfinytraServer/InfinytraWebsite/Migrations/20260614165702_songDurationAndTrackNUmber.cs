using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinytraWebsite.Migrations
{
    /// <inheritdoc />
    public partial class songDurationAndTrackNUmber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TrackNumber",
                table: "Songs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "TrackNumber",
                table: "Songs");
        }
    }
}
