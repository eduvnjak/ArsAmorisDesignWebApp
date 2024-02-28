using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArsAmorisDesignApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProductLike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "product_likes",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_likes", x => new { x.user_id, x.product_id });
                    table.ForeignKey(
                        name: "FK_product_likes_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_product_likes_product_id",
                table: "product_likes",
                column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "product_likes");
        }
    }
}
