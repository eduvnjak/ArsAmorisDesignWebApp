using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArsAmorisDesignApi.Migrations
{
    /// <inheritdoc />
    public partial class MultipleImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_file_name",
                table: "products");

            migrationBuilder.CreateTable(
                name: "product_image",
                columns: table => new
                {
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_image", x => new { x.product_id, x.name });
                    table.ForeignKey(
                        name: "FK_product_image_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "product_image");

            migrationBuilder.AddColumn<string>(
                name: "image_file_name",
                table: "products",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
